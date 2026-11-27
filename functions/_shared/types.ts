/**
 * Shared types for Cloudflare Pages Functions.
 *
 * Env exposes the runtime environment variables (set in the Cloudflare Pages
 * project settings). These are the same VITE_* values Vite inlines into the
 * client bundle; on Cloudflare they must also be declared as runtime env vars
 * so Functions can read them via context.env.
 */

export interface Env {
  SUPABASE_URL?: string;
  SUPABASE_PUBLISHABLE_KEY?: string;
}

/** Minimal manual typing of the Cloudflare Pages Functions context. */
export interface PagesFunctionContext {
  request: Request;
  env: Env;
  params: Record<string, string | string[] | undefined>;
  next: () => Promise<Response>;
  waitUntil: (promise: Promise<unknown>) => void;
  data: Record<string, unknown>;
}
