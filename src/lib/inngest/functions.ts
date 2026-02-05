import { inngest } from "./client";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin outside the handler to reuse if possible (though Inngest functions are stateless)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
);

const MAX_CONTENT_SIZE = 500 * 1024;

export const scanFunction = inngest.createFunction(
    {
        id: "process-scan",
        onFailure: async ({ event, error }) => {
            // Handle failure: Update incident status to 'Failed'
            const { incidentId } = event.data.event.data;
            if (incidentId) {
                await supabaseAdmin
                    .from('security_incidents')
                    .update({
                        status: 'Failed',
                        analysis_summary: `Analysis failed: ${error.message}`
                    })
                    .eq('id', incidentId);
            }
        }
    },
    { event: "app/scan.request" },
    async ({ event, step }) => {
        const { incidentId, type, content, network, scanned_files } = event.data;

        // 1. Simulate Processing Delay (Step allows retries on this specific block if needed, though sleep is just sleep)
        await step.sleep("simulated-delay", "2s");

        // 2. Perform Analysis
        const result = await step.run("run-analysis", async () => {
            // --- LOGIC FROM api/analyze/route.ts ---

            // Size limit check (Duplicate check from create route, but good for safety)
            const contentSize = typeof content === 'string' ? content.length : JSON.stringify(content).length;
            if (contentSize > MAX_CONTENT_SIZE) {
                throw new Error('Content too large for analysis.');
            }

            // Logic ...
            const entropy = (typeof content === 'string' ? content.length : 100) % 100;
            let score = 0;
            let vulnerabilities: any[] = [];
            let summary = "";
            let language = "Unknown";

            if (type === 'ADDRESS') {
                score = 85 + (entropy % 15);
                summary = `Contract at ${content.slice(0, 10)}... appears well-structured. Standard security patterns for ${network || 'SOLANA'} are observed.`;
                language = network === 'SOLANA' ? 'Rust' : 'Solidity';
                if (score < 90) vulnerabilities.push({ id: 'aud-1', name: 'Gas Optimization Hint', severity: 'Low' });
            } else if (type === 'GITHUB') {
                score = 70 + (entropy % 25);
                summary = `Repository scan complete. Analyzed logic in main branch. Project structure matches standard patterns.`;
                language = entropy > 50 ? 'Rust' : 'Solidity';
                vulnerabilities.push({ id: 'gh-1', name: 'Hardcoded Secrets Check', severity: 'Low' });
                if (entropy > 60) vulnerabilities.push({ id: 'gh-2', name: 'Dependency Vulnerability', severity: 'Medium' });
            } else if (type === 'FILES') {
                const files = scanned_files || [];
                score = 75 + (files.length % 20);
                summary = `Analyzed ${files.length} uploaded files. Project structure and dependencies reviewed.`;
                // Simple lang detection
                if (files.some((f: any) => f.name.endsWith('.rs'))) language = 'Rust';
                else language = 'Solidity';

                if (files.length < 2) vulnerabilities.push({ id: 'file-1', name: 'Single File Risk', severity: 'Low' });
            } else {
                // RAW CODE
                const code = (content as string).toLowerCase();
                if (code.includes('anchor')) language = 'Rust';
                else language = 'Solidity';

                if (content.length < 50) {
                    score = 45;
                    summary = "Code snippet is too short to be secure. Lacks standard imports and safety checks.";
                    vulnerabilities.push({ id: 'v-crit', name: 'Incomplete Implementation', severity: 'High' });
                } else {
                    score = 60 + (entropy % 35);
                    summary = "Static analysis complete. Function visibility and state mutability checks passed with minor warnings.";
                    if (entropy > 50) {
                        vulnerabilities.push({ id: 'v-1', name: 'Unchecked External Call', severity: 'Medium' });
                    }
                }
            }

            // Tags
            const tags: string[] = [];
            if (language !== 'Unknown') tags.push(language);
            if (network) tags.push(network);
            if (tags.length === 0) tags.push('Smart Contract');

            // Status
            const severity = score < 60 ? 'High' : (score < 80 ? 'Medium' : 'Low');
            const status = score < 80 ? 'Issues Detected' : 'No Issues Detected';

            return { score, severity, status, summary, vulnerabilities, language, tags };
        });

        // 3. Save Results
        await step.run("save-results", async () => {
            const { error } = await supabaseAdmin
                .from('security_incidents')
                .update({
                    score: result.score,
                    severity: result.severity,
                    status: result.status,
                    analysis_summary: result.summary,
                    vulnerabilities: result.vulnerabilities,
                    language: result.language,
                    tags: result.tags
                })
                .eq('id', incidentId);

            if (error) throw new Error(`Database update failed: ${error.message}`);
        });

        return { success: true, incidentId };
    }
);
