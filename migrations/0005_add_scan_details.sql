-- Update security_incidents with scan specific details
-- Supporting multi-chain analysis details

ALTER TABLE security_incidents
ADD COLUMN IF NOT EXISTS network TEXT DEFAULT 'SOLANA', -- ETHEREUM, SOLANA, AVAX, etc.
ADD COLUMN IF NOT EXISTS contract_address TEXT,
ADD COLUMN IF NOT EXISTS score INTEGER CHECK (score >= 0 AND score <= 100),
ADD COLUMN IF NOT EXISTS analysis_summary TEXT,
ADD COLUMN IF NOT EXISTS vulnerabilities JSONB DEFAULT '[]'::jsonb;

-- Create index for searching by contract address or network
CREATE INDEX IF NOT EXISTS idx_security_incidents_contract ON security_incidents(contract_address);
CREATE INDEX IF NOT EXISTS idx_security_incidents_network ON security_incidents(network);
