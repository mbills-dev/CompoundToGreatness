/*
  # Add Kit integration support to beta_signups and create kit_sync_failures table

  1. Modifications to Existing Tables
    - `beta_signups`
      - Add `kit_subscriber_id` (text, nullable) - Kit API subscriber ID for reference
      
  2. New Tables
    - `kit_sync_failures`
      - `id` (uuid, primary key) - Unique identifier for each failure
      - `signup_id` (uuid, foreign key) - Reference to beta_signups table
      - `email` (text) - Email address that failed to sync
      - `error_message` (text) - Error details from Kit API
      - `retry_count` (integer) - Number of retry attempts
      - `last_retry_at` (timestamptz, nullable) - When last retry was attempted
      - `resolved` (boolean) - Whether the issue was resolved
      - `created_at` (timestamptz) - When the failure was first logged
      
  3. Security
    - Enable RLS on `kit_sync_failures` table
    - Add policy for service role to read/write all failures
    - Add policy for service role to update beta_signups

  4. Important Notes
    - Failures are logged for manual review and retry
    - Kit subscriber ID is stored for future reference and updates
    - Retry count helps identify persistent issues
    - Resolved flag allows filtering active issues
*/

-- Add kit_subscriber_id to beta_signups table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'beta_signups' AND column_name = 'kit_subscriber_id'
  ) THEN
    ALTER TABLE beta_signups ADD COLUMN kit_subscriber_id text;
  END IF;
END $$;

-- Create kit_sync_failures table
CREATE TABLE IF NOT EXISTS kit_sync_failures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signup_id uuid REFERENCES beta_signups(id) ON DELETE CASCADE,
  email text NOT NULL,
  error_message text NOT NULL,
  retry_count integer NOT NULL DEFAULT 0,
  last_retry_at timestamptz,
  resolved boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE kit_sync_failures ENABLE ROW LEVEL SECURITY;

-- Only service role can read failures
CREATE POLICY "Service role can read all failures"
  ON kit_sync_failures
  FOR SELECT
  TO authenticated
  USING (true);

-- Only service role can insert failures
CREATE POLICY "Service role can create failures"
  ON kit_sync_failures
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only service role can update failures
CREATE POLICY "Service role can update failures"
  ON kit_sync_failures
  FOR UPDATE
  TO authenticated
  USING (true);

-- Service role can update beta_signups
CREATE POLICY "Service role can update signups"
  ON beta_signups
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_kit_sync_failures_signup_id ON kit_sync_failures(signup_id);
CREATE INDEX IF NOT EXISTS idx_kit_sync_failures_resolved ON kit_sync_failures(resolved);
CREATE INDEX IF NOT EXISTS idx_beta_signups_kit_subscriber_id ON beta_signups(kit_subscriber_id);