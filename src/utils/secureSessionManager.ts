/**
 * Secure Session Manager
 * Handles admin sessions without exposing tokens to JavaScript
 * Uses server-side httpOnly cookies via Supabase
 */

import { supabase } from '@/integrations/supabase/client';

export interface AdminSessionData {
  email: string;
  expiresAt: string;
  deviceFingerprint?: string;
}

/**
 * Generate device fingerprint (basic implementation)
 * In production, use a proper library like fingerprintjs2
 */
export function generateDeviceFingerprint(): string {
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    new Date().getTimezoneOffset(),
    !!window.sessionStorage,
    !!window.localStorage,
  ].join('|');

  return btoa(fingerprint); // Base64 encode
}

/**
 * Start admin session via Supabase
 * ✅ SECURE: Session data stored server-side, not in JavaScript
 */
export async function initializeAdminSession(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Call your edge function to create session
    // The function should SET httpOnly cookies on response
    const { data, error } = await supabase.functions.invoke('create-admin-session', {
      body: {
        email,
        deviceFingerprint: generateDeviceFingerprint(),
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      },
    });

    if (error) {
      console.error('❌ Session creation failed:', error.message);
      return { success: false, error: error.message };
    }

    // ✅ Session cookie is automatically set by server via Set-Cookie header
    // JavaScript CANNOT access httpOnly cookies
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('❌ Session error:', message);
    return { success: false, error: message };
  }
}

/**
 * Validate admin session
 * ✅ SECURE: Server validates session cookie, not client-side token
 */
export async function validateAdminSession(): Promise<{ valid: boolean; email?: string }> {
  try {
    // Server automatically sends httpOnly cookie with request
    const { data, error } = await supabase.functions.invoke('validate-admin-session', {
      body: {
        deviceFingerprint: generateDeviceFingerprint(),
      },
    });

    if (error || !data?.valid) {
      return { valid: false };
    }

    return { valid: true, email: data.email };
  } catch {
    return { valid: false };
  }
}

/**
 * Clear admin session
 * ✅ SECURE: Server clears httpOnly cookie
 */
export async function clearAdminSession(): Promise<void> {
  try {
    await supabase.functions.invoke('logout-admin-session', {
      body: { timestamp: new Date().toISOString() },
    });
  } catch (err) {
    console.error('❌ Logout error:', err);
  }

  // Also clear any memory-based state
  window.dispatchEvent(new Event('admin-logout'));
}

/**
 * Refresh session if expiring
 * ✅ SECURE: Server issues new httpOnly cookie
 */
export async function refreshAdminSession(): Promise<{ valid: boolean }> {
  try {
    const { data, error } = await supabase.functions.invoke('refresh-admin-session', {
      body: { deviceFingerprint: generateDeviceFingerprint() },
    });

    if (error) return { valid: false };
    return { valid: data?.valid ?? false };
  } catch {
    return { valid: false };
  }
}

/**
 * Check for session hijacking (device mismatch)
 * ✅ SECURITY: Detect if session is being used from different device
 */
export async function checkSessionIntegrity(): Promise<{ secure: boolean; reason?: string }> {
  try {
    const currentFingerprint = generateDeviceFingerprint();

    const { data, error } = await supabase.functions.invoke('verify-session-integrity', {
      body: { deviceFingerprint: currentFingerprint },
    });

    if (error) {
      return { secure: false, reason: 'Session validation failed' };
    }

    if (!data?.fingerprint_match) {
      return { secure: false, reason: 'Device fingerprint mismatch - possible session hijacking' };
    }

    return { secure: true };
  } catch (err) {
    return { secure: false, reason: 'Integrity check failed' };
  }
}
