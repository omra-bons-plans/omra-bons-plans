-- Fix RLS security issues flagged by Supabase Security Advisor
--
-- Issue 1: notifications table — INSERT policy WITH CHECK (true) allowed anonymous inserts.
-- Edge functions use the service_role key which bypasses RLS by default, so this policy
-- is not needed for legitimate server-side notification creation.
-- Regular users and anonymous visitors must NOT be able to create notifications directly.

DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;

-- Issue 2: hajj_newsletter_subscriptions — INSERT policy WITH CHECK (true) allowed any
-- input, including malformed emails. Tighten the check to validate email format.
-- Public signup remains allowed (no auth required) but input is validated.

DROP POLICY IF EXISTS "Anyone can subscribe to Hajj newsletter" ON public.hajj_newsletter_subscriptions;

CREATE POLICY "Anyone can subscribe to Hajj newsletter"
  ON public.hajj_newsletter_subscriptions
  FOR INSERT
  WITH CHECK (email ~* '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$');
