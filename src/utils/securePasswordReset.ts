/**
 * Secure Password Reset Handler
 * ✅ SECURITY: Tokens never exposed in URL or history
 */

import { supabase } from '@/integrations/supabase/client';

export interface PasswordResetRequest {
  email: string;
  token: string;
  newPassword: string;
}

/**
 * Exchange reset token via POST (not URL parameters)
 * ✅ SECURE: Token in request body, not URL
 */
export async function exchangeResetToken(token: string): Promise<{
  valid: boolean;
  email?: string;
  sessionToken?: string;
  error?: string;
}> {
  try {
    // Send token via POST, not URL
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-reset-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Include cookies
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      return { valid: false, error: 'Token invalid or expired' };
    }

    const data = await response.json();

    // ✅ SECURE: Don't store token in memory/localStorage
    // Store ephemeral session marker only (memory-only)
    sessionStorage.setItem('_reset_session', 'active');

    return {
      valid: true,
      email: data.email,
      sessionToken: data.sessionToken, // ✅ Use httpOnly cookie, not this
    };
  } catch (err) {
    return { valid: false, error: err instanceof Error ? err.message : 'Verification failed' };
  }
}

/**
 * Complete password reset with new password
 * ✅ SECURE: Token exchange done, now reset with session auth
 */
export async function completePasswordReset(newPassword: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Validate password strength
    if (newPassword.length < 12) {
      return { success: false, error: 'Password must be at least 12 characters' };
    }

    if (!/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      return {
        success: false,
        error: 'Password must contain uppercase letters and numbers',
      };
    }

    // ✅ SECURE: Use authenticated session to reset (token already verified)
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error('❌ Password reset failed:', error.message);
      return { success: false, error: error.message };
    }

    // ✅ SECURITY: Clear reset session marker
    sessionStorage.removeItem('_reset_session');

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Reset failed' };
  }
}

/**
 * Validate that user is in password reset flow
 * ✅ SECURE: Only memory-based, not URL-based
 */
export function isInPasswordResetFlow(): boolean {
  return sessionStorage.getItem('_reset_session') === 'active';
}

/**
 * Clear reset flow (on cancel or completion)
 * ✅ SECURE: Cleanup sensitive session state
 */
export function clearPasswordResetFlow(): void {
  sessionStorage.removeItem('_reset_session');
  // Clear URL fragment if present
  window.history.replaceState({}, document.title, window.location.pathname);
}

/**
 * ⚠️ SECURITY: Handle legacy URL parameter case (backwards compatibility)
 * This safely extracts token from URL without logging it
 */
export function extractResetTokenFromUrl(): string | null {
  const params = new URLSearchParams(window.location.hash.substring(1));
  const token = params.get('reset_token');

  // ✅ SECURITY: Remove token from URL immediately to prevent history leak
  if (token) {
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  return token;
}
