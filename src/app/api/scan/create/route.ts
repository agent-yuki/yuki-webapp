import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { inngest } from '@/lib/inngest/client';

export async function POST(req: NextRequest) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SECRET_KEY!
    );

    try {
        // 1. Auth & Validation
        const authHeader = req.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        // 2. Credit Deduction
        const { data: profile } = await supabase.from('profiles').select('credits').eq('id', user.id).single();
        if (!profile || profile.credits < 1) {
            return NextResponse.json({ error: 'Insufficient credits.' }, { status: 402 });
        }

        const { error: deductError } = await supabase.rpc('decrement_credits', { p_user_id: user.id });
        if (deductError) {
            // Fallback or Error
            return NextResponse.json({ error: 'Failed to process credits.' }, { status: 500 });
        }

        // 3. Create Incident Record (Processing State)
        const body = await req.json();
        const { type, content, network, scanned_files } = body;
        const newId = crypto.randomUUID();

        const title = type === 'GITHUB'
            ? `Repo Scan: ${content.split('/').slice(-1)}`
            : type === 'FILES' ? `File Scan: ${scanned_files?.length} files`
                : `Analysis: ${content.slice(0, 8)}...`;

        // Initial Insert
        const { error: insertError } = await supabase
            .from('security_incidents')
            .insert({
                id: newId,
                user_id: user.id,
                title,
                network: network || 'SOLANA',
                status: 'Processing', // Background state
                severity: 'Low', // Placeholder, required by DB
                visibility: body.visibility || 'PUBLIC', // Use passed visibility or default
                contract_address: type === 'ADDRESS' ? content : 'Manual Upload',
                source_code: type === 'CODE' ? content : undefined,
                scanned_files: scanned_files,
                tags: ['Processing'],
                timestamp: new Date().toISOString()
            });

        if (insertError) {
            throw insertError;
        }

        // 4. Trigger Inngest Event
        await inngest.send({
            name: "app/scan.request",
            data: {
                incidentId: newId,
                type,
                content,
                network,
                scanned_files
            }
        });

        return NextResponse.json({ id: newId, status: 'Processing' });

    } catch (error: any) {
        console.error('Scan Create Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
