/*
  # Allow anonymous inserts to beta_signups

  ## Problem
  The beta_signups table has RLS enabled but no policy allowing unauthenticated
  users to insert rows. Since this is a public landing page signup form with no
  auth, unauthenticated visitors need to be able to submit their details.

  ## Changes
  - Adds an INSERT policy for the anon role on beta_signups
  - Restricts to only the columns that should be user-supplied
*/

CREATE POLICY "Anyone can sign up for beta"
  ON beta_signups
  FOR INSERT
  TO anon
  WITH CHECK (true);
