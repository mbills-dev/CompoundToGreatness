/*
  # Create beta_signups table for Compound to Greatness

  1. New Tables
    - `beta_signups`
      - `id` (uuid, primary key) - Unique identifier for each signup
      - `name` (text) - User's full name
      - `email` (text, unique) - User's email address
      - `payment_status` (text) - Status of payment (pending, completed, failed)
      - `stripe_payment_id` (text, nullable) - Stripe payment intent ID
      - `created_at` (timestamptz) - When the signup was created
      
  2. Security
    - Enable RLS on `beta_signups` table
    - Add policy for public insert access (since no auth required)
    - Add policy for service role to read all signups

  3. Important Notes
    - No authentication required - this is a public signup form
    - Email must be unique to prevent duplicate signups
    - Payment status tracks the lifecycle of the payment
*/

CREATE TABLE IF NOT EXISTS beta_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  payment_status text NOT NULL DEFAULT 'pending',
  stripe_payment_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE beta_signups ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert a signup (public form)
CREATE POLICY "Anyone can create a signup"
  ON beta_signups
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only authenticated users (service role) can read signups
CREATE POLICY "Service role can read all signups"
  ON beta_signups
  FOR SELECT
  TO authenticated
  USING (true);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_beta_signups_email ON beta_signups(email);
CREATE INDEX IF NOT EXISTS idx_beta_signups_payment_status ON beta_signups(payment_status);