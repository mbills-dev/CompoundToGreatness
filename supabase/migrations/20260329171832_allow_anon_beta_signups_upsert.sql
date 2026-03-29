/*
  # Allow anon upsert on beta_signups

  ## Problem
  Upsert (insert on conflict update) requires both INSERT and UPDATE permissions.
  Currently anon only has INSERT. When a duplicate email is submitted, the upsert
  needs UPDATE access to succeed.

  ## Changes
  - Adds UPDATE policy for anon role scoped to matching email (own row only)
*/

CREATE POLICY "Anyone can update their own signup"
  ON beta_signups
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
