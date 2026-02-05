'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const DocsPage = () => {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />

            <main className="flex-1 pt-32 pb-16 px-6 container mx-auto w-full">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Developer Integration Guide
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Integrate the Yuki Security Engine directly into your dApps, CI/CD pipelines, and audit workflows.
                    </p>
                </div>

                <div className="space-y-16">
                    {/* Section 1: Authentication */}
                    <section id="authentication" className="scroll-mt-32">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm">1</span>
                            Authentication
                        </h2>
                        <div className="prose prose-invert max-w-none text-muted-foreground">
                            <p className="mb-4">
                                To access the API, you need an <strong className="text-foreground">API Key</strong>.
                            </p>
                            <ol className="list-decimal pl-6 space-y-2 mb-6">
                                <li>Log in to your <a href="/dashboard" className="text-accent hover:underline">Yuki Dashboard</a>.</li>
                                <li>Navigate to <strong className="text-foreground">API Keys</strong> in the sidebar.</li>
                                <li>Click <strong className="text-foreground">"Generate New Key"</strong>.</li>
                                <li>Keep this key safe! It starts with <code className="bg-muted px-1 py-0.5 rounded text-sm text-foreground">yuki_sk_...</code>.</li>
                            </ol>

                            <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/10 text-yellow-200 text-sm">
                                <strong>Security Note:</strong> Never expose your Secret Key (<code className="bg-black/30 px-1 rounded">yuki_sk_...</code>) in frontend code. All API calls should be made from your secure backend environment.
                            </div>
                        </div>
                    </section>

                    {/* Section 2: SDK */}
                    <section id="sdk" className="scroll-mt-32">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm">2</span>
                            Using the SDK (Recommended)
                        </h2>
                        <p className="mb-6 text-muted-foreground">
                            Our official SDK provides a type-safe, easy way to interact with the Yuki Engine.
                        </p>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-foreground">Installation</h3>
                                <SyntaxHighlighter language="bash" style={vscDarkPlus} className="rounded-xl !bg-[#0d1117] border border-border">
                                    {`npm install @agent-yuki/sdk
# or
yarn add @agent-yuki/sdk`}
                                </SyntaxHighlighter>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-foreground">Initialization</h3>
                                <SyntaxHighlighter language="typescript" style={vscDarkPlus} className="rounded-xl !bg-[#0d1117] border border-border">
                                    {`import { YukiClient } from '@agent-yuki/sdk';

const yuki = new YukiClient({
  apiKey: process.env.YUKI_API_KEY, // e.g., 'yuki_sk_...'
});`}
                                </SyntaxHighlighter>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-foreground">Examples</h3>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Scan a Solana Address</h4>
                                        <p className="text-sm text-muted-foreground mb-3">Analyze a deployed smart contract or wallet address.</p>
                                        <SyntaxHighlighter language="typescript" style={vscDarkPlus} className="rounded-xl !bg-[#0d1117] border border-border">
                                            {`const analysis = await yuki.scan.address({
  address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  network: 'SOLANA', // 'SOLANA' | 'ETHEREUM' | 'BASE'
});

console.log(\`Score: \${analysis.score}/100\`);
console.log('Vulnerabilities:', analysis.vulnerabilities);`}
                                        </SyntaxHighlighter>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Scan a GitHub Repository</h4>
                                        <p className="text-sm text-muted-foreground mb-3">Perfect for CI/CD integrations.</p>
                                        <SyntaxHighlighter language="typescript" style={vscDarkPlus} className="rounded-xl !bg-[#0d1117] border border-border">
                                            {`const analysis = await yuki.scan.github({
  url: 'https://github.com/client-xyz/new-defi-protocol',
  branch: 'main' // optional
});`}
                                        </SyntaxHighlighter>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Scan Raw Code</h4>
                                        <p className="text-sm text-muted-foreground mb-3">Analyze un-deployed code snippets on the fly.</p>
                                        <SyntaxHighlighter language="typescript" style={vscDarkPlus} className="rounded-xl !bg-[#0d1117] border border-border">
                                            {`const codeSnippet = \`
  pub fn insecure_transfer(ctx: Context<Transfer>, amount: u64) -> Result<()> {
     // ... risky logic ...
  }
\`;

const analysis = await yuki.scan.raw({
  content: codeSnippet,
  language: 'RUST' // optional hint
});`}
                                        </SyntaxHighlighter>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Direct API */}
                    <section id="api" className="scroll-mt-32">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm">3</span>
                            Direct API Usage
                        </h2>
                        <div className="space-y-6 text-muted-foreground">
                            <p>
                                If you prefer not to use the SDK, you can make HTTP requests directly.
                            </p>

                            <div className="flex items-center gap-2 font-mono text-sm bg-muted/50 p-3 rounded-lg border border-border w-fit">
                                <span className="px-2 py-0.5 rounded bg-accent text-accent-foreground font-bold">POST</span>
                                <span>https://api.agent-yuki.com/v1/analyze</span>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-foreground">Headers</h3>
                                <SyntaxHighlighter language="http" style={vscDarkPlus} className="rounded-xl !bg-[#0d1117] border border-border">
                                    {`Content-Type: application/json
Authorization: Bearer yuki_sk_...`}
                                </SyntaxHighlighter>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-foreground">Request Body</h3>
                                <SyntaxHighlighter language="json" style={vscDarkPlus} className="rounded-xl !bg-[#0d1117] border border-border">
                                    {`{
  "type": "ADDRESS",
  "content": "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
  "network": "SOLANA"
}`}
                                </SyntaxHighlighter>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-foreground">Response Preview</h3>
                                <SyntaxHighlighter language="json" style={vscDarkPlus} className="rounded-xl !bg-[#0d1117] border border-border">
                                    {`{
  "score": 85,
  "severity": "Low",
  "status": "No Issues Detected",
  "summary": "Contract appears well-structured...",
  "vulnerabilities": [],
  "timestamp": "2026-05-10T12:00:00Z"
}`}
                                </SyntaxHighlighter>
                            </div>
                        </div>
                    </section>

                    {/* Section 4: Response Schema */}
                    <section id="response-schema" className="scroll-mt-32">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm">4</span>
                            Response Schema
                        </h2>
                        <p className="mb-4 text-muted-foreground">
                            The API returns a JSON object containing the analysis results. The <code className="bg-muted px-1 rounded text-foreground">vulnerabilities</code> array contains detailed findings.
                        </p>
                        <SyntaxHighlighter language="json" style={vscDarkPlus} className="rounded-xl !bg-[#0d1117] border border-border mb-6">
                            {`{
  "score": 85, // 0-100 Security Score
  "severity": "Low", // Critical | High | Medium | Low | Info
  "status": "No Issues Detected",
  "summary": "Contract appears well-structured...",
  "vulnerabilities": [
    {
      "id": "vuln-123",
      "name": "Reentrancy Risk",
      "severity": "High",
      "line": 42,
      "description": "External call before state update...",
      "recommendation": "Use ReentrancyGuard or Checks-Effects-Interactions pattern."
    }
  ],
  "timestamp": "2026-05-10T12:00:00Z"
}`}
                        </SyntaxHighlighter>
                    </section>

                    {/* Section 5: Supported Platforms */}
                    <section id="platforms" className="scroll-mt-32">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm">5</span>
                            Supported Platforms
                        </h2>
                        <div className="overflow-hidden rounded-xl border border-border">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted/50 text-foreground font-semibold">
                                    <tr>
                                        <th className="p-4">Network</th>
                                        <th className="p-4">Languages</th>
                                        <th className="p-4">Key Features</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border bg-background">
                                    <tr>
                                        <td className="p-4 font-medium">Solana</td>
                                        <td className="p-4 text-muted-foreground">Rust (Anchor), Native</td>
                                        <td className="p-4 text-muted-foreground">PDA Validation, SPL Token Security, Signer Checks</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium">Ethereum</td>
                                        <td className="p-4 text-muted-foreground">Solidity, Vyper</td>
                                        <td className="p-4 text-muted-foreground">Reentrancy, Gas Optimization, ERC Compliance</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium">Base / L2s</td>
                                        <td className="p-4 text-muted-foreground">Solidity</td>
                                        <td className="p-4 text-muted-foreground">Standard EVM Security Checks</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Section 6: Error Handling */}
                    <section id="errors" className="scroll-mt-32">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm">6</span>
                            Error Handling
                        </h2>
                        <div className="space-y-4">
                            <p className="text-muted-foreground">
                                The API uses standard HTTP status codes to indicate success or failure.
                            </p>
                            <div className="grid gap-3">
                                <div className="flex items-center gap-4 p-3 rounded-lg border border-border bg-background">
                                    <code className="text-red-400 font-bold w-12">400</code>
                                    <span className="text-foreground font-medium">Bad Request</span>
                                    <span className="text-muted-foreground text-sm">Invalid JSON or unsupported language.</span>
                                </div>
                                <div className="flex items-center gap-4 p-3 rounded-lg border border-border bg-background">
                                    <code className="text-orange-400 font-bold w-12">401</code>
                                    <span className="text-foreground font-medium">Unauthorized</span>
                                    <span className="text-muted-foreground text-sm">Missing or invalid API Key.</span>
                                </div>
                                <div className="flex items-center gap-4 p-3 rounded-lg border border-border bg-background">
                                    <code className="text-yellow-400 font-bold w-12">402</code>
                                    <span className="text-foreground font-medium">Payment Required</span>
                                    <span className="text-muted-foreground text-sm">Insufficient credits. Please top up.</span>
                                </div>
                                <div className="flex items-center gap-4 p-3 rounded-lg border border-border bg-background">
                                    <code className="text-blue-400 font-bold w-12">429</code>
                                    <span className="text-foreground font-medium">Too Many Requests</span>
                                    <span className="text-muted-foreground text-sm">Rate limit exceeded (60/min).</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 7: Best Practices */}
                    <section id="best-practices" className="scroll-mt-32">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm">7</span>
                            Best Practices
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-5 rounded-xl border border-border bg-muted/10">
                                <h3 className="font-bold text-foreground mb-2">🔒 CI/CD Integration</h3>
                                <p className="text-sm text-muted-foreground">
                                    Fail your build pipelines if <code className="bg-muted px-1 rounded">severity</code> is 'High' or 'Critical'. This prevents vulnerable code from reaching production.
                                </p>
                            </div>
                            <div className="p-5 rounded-xl border border-border bg-muted/10">
                                <h3 className="font-bold text-foreground mb-2">⚡ Caching</h3>
                                <p className="text-sm text-muted-foreground">
                                    Cache analysis results for immutable smart contract versions to save credits and reduce latency.
                                </p>
                            </div>
                        </div>
                    </section>
                    <section id="limits" className="scroll-mt-32">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm">8</span>
                            Rate Limits & Credits
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-6 rounded-xl border border-border bg-muted/20">
                                <h3 className="font-bold mb-2 text-foreground">Rate Limits</h3>
                                <p className="text-muted-foreground">60 requests per minute per IP.</p>
                            </div>
                            <div className="p-6 rounded-xl border border-border bg-muted/20">
                                <h3 className="font-bold mb-2 text-foreground">Credits</h3>
                                <p className="text-muted-foreground">Each scan consumes <strong className="text-accent">1 Credit</strong>.</p>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-muted-foreground">
                            Check your balance via <code className="bg-muted px-1 rounded text-foreground">yuki.users.me()</code> or the Dashboard.
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default DocsPage;
