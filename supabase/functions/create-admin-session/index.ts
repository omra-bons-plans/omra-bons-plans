import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting: store attempts in memory (use Redis in production)
const attemptMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(identifier: string, maxAttempts = 5, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const record = attemptMap.get(identifier);

  if (!record || now > record.resetTime) {
    attemptMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (record.count >= maxAttempts) {
    return true;
  }

  record.count++;
  return false;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, deviceFingerprint, userAgent, timestamp } = await req.json();

    // 🔐 SECURITY: Validate input
    if (!email || !email.includes("@")) {
      return new Response(
        JSON.stringify({ error: "Invalid email" }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (!deviceFingerprint) {
      return new Response(
        JSON.stringify({ error: "Device fingerprint required" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // 🔐 SECURITY: Rate limit by email and IP
    const clientIp = req.headers.get("x-forwarded-for") || "unknown";
    const rateLimitKey = `${email}:${clientIp}`;

    if (isRateLimited(rateLimitKey, 5, 15 * 60 * 1000)) {
      return new Response(
        JSON.stringify({ error: "Too many attempts. Try again later." }),
        { status: 429, headers: corsHeaders }
      );
    }

    // Initialize Supabase admin client (server-side only)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // 🔐 SECURITY: Verify email is an admin
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from("admin_users")
      .select("id, email, is_active")
      .eq("email", email)
      .single();

    if (adminError || !adminData?.is_active) {
      console.error("Admin verification failed:", adminError);
      // ⚠️ Don't reveal if email exists or not (prevent enumeration)
      return new Response(
        JSON.stringify({ error: "Invalid credentials" }),
        { status: 401, headers: corsHeaders }
      );
    }

    // 🔐 SECURITY: Generate secure session token
    const sessionId = crypto.randomUUID();
    const sessionSecret = btoa(crypto.getRandomValues(new Uint8Array(32))).substring(0, 32);
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(); // 2 hours

    // 🔐 SECURITY: Hash the session for storage (don't store plaintext)
    const sessionHash = await hashSession(sessionSecret);

    // Store session in database
    const { error: sessionError } = await supabaseAdmin
      .from("admin_sessions")
      .insert({
        admin_id: adminData.id,
        session_id: sessionId,
        session_hash: sessionHash,
        device_fingerprint: deviceFingerprint,
        user_agent: userAgent,
        ip_address: clientIp,
        expires_at: expiresAt,
        created_at: timestamp,
        is_active: true,
      });

    if (sessionError) {
      console.error("Session storage failed:", sessionError);
      return new Response(
        JSON.stringify({ error: "Session creation failed" }),
        { status: 500, headers: corsHeaders }
      );
    }

    // 🔐 SECURITY: Set httpOnly, Secure, SameSite cookie (server-side only)
    const cookieValue = `${sessionId}.${sessionSecret}`;
    const setCookieHeader = [
      `admin_session=${cookieValue}`,
      "Path=/",
      "HttpOnly", // 🔐 JavaScript cannot access this cookie
      "Secure", // 🔐 Only sent over HTTPS
      "SameSite=Strict", // 🔐 Prevent CSRF
      `Max-Age=${2 * 60 * 60}`, // 2 hours
    ].join("; ");

    // 🔐 SECURITY: Log session creation for audit
    await supabaseAdmin
      .from("admin_audit_logs")
      .insert({
        admin_id: adminData.id,
        action: "session_created",
        details: { ip_address: clientIp, device_fingerprint: deviceFingerprint },
        timestamp: new Date().toISOString(),
      });

    return new Response(
      JSON.stringify({ success: true, message: "Session created" }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Set-Cookie": setCookieHeader,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: corsHeaders }
    );
  }
});

// Simple hash function (use proper bcrypt in production)
async function hashSession(session: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(session);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
