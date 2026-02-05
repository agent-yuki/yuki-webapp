import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from 'octokit';
import { createClient } from '@supabase/supabase-js';

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

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

        const { url } = await req.json();

        if (!url || typeof url !== 'string') {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // Validate URL length to prevent DoS
        if (url.length > 500) {
            return NextResponse.json({ error: 'URL too long' }, { status: 400 });
        }

        // Parse Owner and Repo - strict validation for github.com only
        // Example: https://github.com/owner/repo/tree/main/programs
        const regex = /^https:\/\/github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)/;
        const match = url.match(regex);

        if (!match) {
            return NextResponse.json({ error: 'Invalid GitHub URL. Must be https://github.com/owner/repo' }, { status: 400 });
        }

        const owner = match[1];
        const repo = match[2];

        // Default to main/master if not specified, but usually we just get default branch
        // We'll fetch the default branch's tree recursively

        // 1. Get repo info to find default branch
        const { data: repoData } = await octokit.rest.repos.get({
            owner,
            repo,
        });

        const branch = repoData.default_branch;

        // 2. Get Tree
        const { data: treeData } = await octokit.rest.git.getTree({
            owner,
            repo,
            tree_sha: branch,
            recursive: 'true',
        });

        const RELEVANT_EXTENSIONS = ['.sol', '.rs', '.vy', '.move', '.toml', '.json', '.js', '.ts', '.py'];

        // Filter files
        const relevantFiles = treeData.tree.filter((item: any) =>
            item.type === 'blob' &&
            RELEVANT_EXTENSIONS.some(ext => item.path?.endsWith(ext))
        ).slice(0, 30); // Limit to 30 files for demo/safety

        // 3. Fetch Content (Parallel)
        const files = await Promise.all(relevantFiles.map(async (file: any) => {
            try {
                const { data } = await octokit.rest.repos.getContent({
                    owner,
                    repo,
                    path: file.path,
                });

                if ('content' in data && data.encoding === 'base64') {
                    const content = Buffer.from(data.content, 'base64').toString('utf-8');
                    return {
                        name: file.path,
                        content: content
                    };
                }
            } catch (e) {
                console.error(`Failed to fetch ${file.path}`, e);
            }
            return null;
        }));

        const validFiles = files.filter(Boolean);

        return NextResponse.json({
            files: validFiles,
            owner,
            repo,
            branch
        });

    } catch (error) {
        console.error('Fetch GitHub Error:', error);
        return NextResponse.json({ error: 'Failed to fetch repository' }, { status: 500 });
    }
}
