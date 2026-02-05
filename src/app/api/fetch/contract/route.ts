import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const SOLSCAN_API_KEY = process.env.SOLSCAN_API_KEY;

// Lazy initialization to avoid build-time errors
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );
}

export async function POST(req: NextRequest) {
    const supabaseAdmin = getSupabaseAdmin();
    try {
        // ============ AUTHENTICATION ============
        const authHeader = req.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
        
        if (authError || !user) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
        }

        const { network, address } = await req.json();

        // Validate network against whitelist
        const VALID_NETWORKS = ['ETHEREUM', 'BSC', 'POLYGON', 'AVAX', 'SOLANA'];
        if (network && !VALID_NETWORKS.includes(network)) {
            return NextResponse.json({ error: 'Invalid network. Must be one of: ' + VALID_NETWORKS.join(', ') }, { status: 400 });
        }

        if (!address || typeof address !== 'string') {
            return NextResponse.json({ error: 'Address is required' }, { status: 400 });
        }

        // Validate address length to prevent abuse
        if (address.length > 200) {
            return NextResponse.json({ error: 'Invalid address format' }, { status: 400 });
        }

        let sourceCode = '';
        let contractName = '';
        let language = 'Unknown';
        let files: any[] = [];

        // --- SOLANA PRE-MOCK (Real API integration placeholder) ---
        if (network === 'SOLANA') {
            // Solscan Public API (v1 or v2) often requires paid plans for source code or verified build info.
            // We will try a public endpoint if available, otherwise mock for demo purposes if key is missing.

            // Note: Real Solana source code fetching is complex as it's often not stored on-chain in text.
            // Ideally we fetch from Anchor IDL or a registry.

            // Simulation for demo:
            language = 'Rust';
            sourceCode = `// Fetching source for Solana program: ${address}\n// (Simulation: In standard Solana apps, source is not on-chain)\n\nuse anchor_lang::prelude::*;\n\ndeclare_id!("${address}");\n\n#[program]\npub mod my_program {\n    use super::*;\n    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {\n        Ok(())\n    }\n}`;
            contractName = 'SolanaProgram';

            return NextResponse.json({ sourceCode, contractName, language, files });
        }

        // --- EVM (ETHERSCAN) ---
        // Mapping networks to Etherscan-compatible APIs
        let baseUrl = '';
        if (network === 'ETHEREUM') baseUrl = 'https://api.etherscan.io/api';
        else if (network === 'BSC') baseUrl = 'https://api.bscscan.com/api';
        else if (network === 'POLYGON') baseUrl = 'https://api.polygonscan.com/api';
        else if (network === 'AVAX') baseUrl = 'https://api.snowtrace.io/api'; // Discontinued/Moved usually

        if (baseUrl && ETHERSCAN_API_KEY) {
            const response = await fetch(`${baseUrl}?module=contract&action=getsourcecode&address=${address}&apikey=${ETHERSCAN_API_KEY}`);
            const data = await response.json();

            if (data.status === '1' && data.result && data.result[0]) {
                const result = data.result[0];
                sourceCode = result.SourceCode;
                contractName = result.ContractName;

                // Check if it's a multi-file JSON
                if (sourceCode.startsWith('{{')) {
                    // Formatting for Etherscan "double bracket" JSON
                    const cleanJson = sourceCode.slice(1, -1);
                    try {
                        const parsed = JSON.parse(cleanJson);
                        // Extract files if possible
                        if (parsed.sources) {
                            files = Object.entries(parsed.sources).map(([path, content]: any) => ({
                                name: path,
                                content: content.content
                            }));
                            language = 'Solidity'; // Usually
                        }
                    } catch (e) {
                        console.error('Failed to parse double-bracket source', e);
                    }
                } else if (sourceCode.startsWith('{')) {
                    try {
                        const parsed = JSON.parse(sourceCode);
                        if (parsed.sources) {
                            files = Object.entries(parsed.sources).map(([path, content]: any) => ({
                                name: path,
                                content: content.content
                            }));
                            language = 'Solidity';
                        }
                    } catch (e) { /* Single file JSON? */ }
                } else {
                    // Single file
                    language = 'Solidity';
                }
            }
        } else {
            // Fallback or Simulation if no Key
            language = 'Solidity';
            sourceCode = `// Etherscan API Key missing or Network not supported for simulation.\n// Contract: ${address}\n// Network: ${network}`;
        }

        return NextResponse.json({ sourceCode, contractName, language, files });

    } catch (error) {
        console.error('Fetch Contract Error:', error);
        return NextResponse.json({ error: 'Failed to fetch contract' }, { status: 500 });
    }
}
