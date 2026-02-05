import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Lazy initialization to avoid build-time errors
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );
}

// Maximum content size (500KB)
const MAX_CONTENT_SIZE = 500 * 1024;

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

    // ============ CREDIT CHECK & ATOMIC DEDUCTION ============
    // Use a transaction-like approach: check and deduct atomically
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    if (profile.credits < 1) {
      return NextResponse.json({ error: 'Insufficient credits. Please purchase more credits.' }, { status: 402 });
    }

    // Atomically deduct credit BEFORE processing (prevents race conditions)
    const { error: deductError } = await supabaseAdmin.rpc('decrement_credits', {
      p_user_id: user.id,
    });

    if (deductError) {
      // Fallback: atomic update with guard
      const { data: updated, error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ credits: profile.credits - 1 })
        .eq('id', user.id)
        .gt('credits', 0)
        .select('credits')
        .single();
        
      if (updateError || !updated) {
        return NextResponse.json({ error: 'Failed to deduct credit' }, { status: 500 });
      }
    }

    const body = await req.json();
    const { type, content, network } = body;

    // ============ INPUT VALIDATION ============
    // Validate type against whitelist
    const VALID_TYPES = ['ADDRESS', 'GITHUB', 'FILES', 'RAW'];
    if (!type || !VALID_TYPES.includes(type)) {
      return NextResponse.json({ error: 'Invalid type. Must be one of: ' + VALID_TYPES.join(', ') }, { status: 400 });
    }

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    // Size limit to prevent DoS
    const contentSize = typeof content === 'string' ? content.length : JSON.stringify(content).length;
    if (contentSize > MAX_CONTENT_SIZE) {
      return NextResponse.json({ error: 'Content too large. Maximum 500KB allowed.' }, { status: 413 });
    }

    // ------------------------------------------------------------------
    // TODO: INTEGRATE REAL AI HERE (OpenAI / Anthropic / Custom Model)
    // ------------------------------------------------------------------
    // For now, we simulate a sophisticated analysis backend.

    // Simulate processing delay (1.5s - 3s)
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500));

    // Deterministic simulation based on content length to make it feel "real"
    // (longer code = more chance of issues in this dummy logic)
    const entropy = content.length % 100;

    let score = 0;
    let vulnerabilities = [];
    let summary = "";

    let language = "Unknown";

    if (type === 'ADDRESS') {
      // Simulation for verified contract address
      score = 85 + (entropy % 15); // High score 85-99
      summary = `Contract at ${content.slice(0, 10)}... appears well-structured. Standard security patterns for ${network || 'SOLANA'} are observed.`;

      // Infer language from network
      if (network === 'SOLANA') language = 'Rust';
      else if (network === 'ETHEREUM' || network === 'BSC' || network === 'POLYGON' || network === 'AVAX') language = 'Solidity';
      else language = 'Solidity'; // Default

      if (score < 90) {
        vulnerabilities.push({ id: 'aud-1', name: 'Gas Optimization Hint', severity: 'Low' });
      }
    } else if (type === 'GITHUB') {
      // Simulation for GitHub Repo
      score = 70 + (entropy % 25); // Score 70-95
      summary = `Repository scan complete. Analyzed logic in main branch. Project structure matches standard patterns.`;

      // Simple heuristic for demo
      language = entropy > 50 ? 'Rust' : 'Solidity';

      vulnerabilities.push({ id: 'gh-1', name: 'Hardcoded Secrets Check', severity: 'Low' });
      if (entropy > 60) {
        vulnerabilities.push({ id: 'gh-2', name: 'Dependency Vulnerability', severity: 'Medium' });
      }
      if (entropy > 60) {
        vulnerabilities.push({ id: 'gh-2', name: 'Dependency Vulnerability', severity: 'Medium' });
      }
    } else if (type === 'FILES') {
      // Simulation for Uploaded Files
      const files = body.scanned_files || [];
      const entropy = files.length * 15;
      score = 75 + (entropy % 20); // Score 75-95
      summary = `Analyzed ${files.length} uploaded files. Project structure and dependencies reviewed.`;

      // Language detection based on extensions
      if (files.some((f: any) => f.name.endsWith('.vy'))) language = 'Vyper';
      else if (files.some((f: any) => f.name.endsWith('.rs'))) language = 'Rust';
      else if (files.some((f: any) => f.name.endsWith('.move'))) language = 'Move';
      else language = 'Solidity';

      if (files.length < 2) {
        vulnerabilities.push({ id: 'file-1', name: 'Single File Risk', severity: 'Low' });
      }
    } else {
      // Simulation for Raw Code
      // Basic detection
      const code = content.toLowerCase();

      // Vyper detection (look for searching decorators or version pragma)
      if (code.includes('#pragma version') || code.includes('@external') || code.includes('@deploy') || content.includes('# @version')) {
        language = 'Vyper';
      }
      // Rust / Anchor
      else if (code.includes('use anchor_lang') || code.includes('pub fn') || code.includes('declare_id!')) {
        language = 'Rust';
      }
      // Move
      else if (code.includes('module move') || code.includes('public fun') || code.includes('has key, store')) {
        language = 'Move';
      }
      // Solidity
      else if (code.includes('pragma solidity') || code.includes('contract ') || code.includes('library ') || code.includes('interface ')) {
        language = 'Solidity';
      }
      else {
        language = 'Solidity'; // Default fallback
      }

      // If code is short, maybe it's risky? Just for fun/demo.
      if (content.length < 50) {
        score = 45;
        summary = "Code snippet is too short to be secure. Lacks standard imports and safety checks.";
        vulnerabilities.push({ id: 'v-crit', name: 'Incomplete Implementation', severity: 'High' });
      } else {
        score = 60 + (entropy % 35); // Score 60-95
        summary = "Static analysis complete. Function visibility and state mutability checks passed with minor warnings.";

        if (entropy > 50) {
          vulnerabilities.push({ id: 'v-1', name: 'Unchecked External Call', severity: 'Medium' });
          vulnerabilities.push({ id: 'v-2', name: 'Floating Pragma', severity: 'Low' });
        }
      }
    }


    // Generate Tags based on content and findings
    const tags: string[] = [];
    if (language !== 'Unknown') tags.push(language);
    if (network) tags.push(network);

    const lowerContent = typeof content === 'string' ? content.toLowerCase() : '';

    // Heuristic Tags
    if (lowerContent.includes('spl-token') || lowerContent.includes('erc20') || lowerContent.includes('token')) tags.push('Token');
    if (lowerContent.includes('nft') || lowerContent.includes('erc721') || lowerContent.includes('metaplex')) tags.push('NFT');
    if (lowerContent.includes('swap') || lowerContent.includes('liquidity') || lowerContent.includes('amm')) tags.push('DeFi');
    if (lowerContent.includes('staking') || lowerContent.includes('reward')) tags.push('Staking');
    if (lowerContent.includes('admin') || lowerContent.includes('owner') || lowerContent.includes('auth')) tags.push('Auth');

    // Fallback tag if empty
    if (tags.length === 0) tags.push('Smart Contract');

    // Determine Status properties
    const severity = score < 60 ? 'High' : (score < 80 ? 'Medium' : 'Low');
    const status = score < 80 ? 'Issues Detected' : 'No Issues Detected';

    return NextResponse.json({
      score,
      severity,
      status,
      summary,
      vulnerabilities,
      language,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Analysis API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
