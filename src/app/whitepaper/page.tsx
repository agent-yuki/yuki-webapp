'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useTheme } from '../../contexts/ThemeContext';
import { Bot, Lock, Settings } from 'lucide-react';

export default function WhitepaperPage() {
  const { colors } = useTheme();

  return (
    <div className="min-h-screen selection:bg-cyan-500 selection:text-white" style={{ backgroundColor: colors.primaryBg }}>
      <Navbar />
      
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
            style={{ color: colors.textPrimary }}
          >
            Agent Yuki <span style={{ color: colors.accent }}>Whitepaper</span>
          </h1>
          <p className="text-lg font-medium opacity-80" style={{ color: colors.textSecondary }}>
            Adaptive Agentic Security for Web3 • Version 1.0 • January 2026
          </p>
          <div className="mt-4 inline-block px-4 py-1 rounded-full text-xs font-mono border" style={{ borderColor: colors.accent, color: colors.accent }}>
            Token: $YUKI on Solana
          </div>
        </div>

        {/* Content Container */}
        <div className="space-y-16">
          
          {/* Executive Summary */}
          <section>
            <h2 className="text-2xl font-bold mb-4 border-b pb-2" style={{ color: colors.textPrimary, borderColor: colors.borderDark }}>
              Executive Summary
            </h2>
            <p className="leading-relaxed text-lg" style={{ color: colors.textSecondary }}>
              Agent Yuki pioneers the Adaptive Agentic Security Platform, revolutionizing smart contract auditing with predictive multi-agent AI that outpaces traditional tools. Over 250,000 contracts deploy monthly, yet 85% evade audits due to cost and speed barriers. Yuki delivers 99.5% faster, deeper analysis across 20+ chains, powered by $YUKI—the utility token fueling audits, governance, and ecosystem growth on Solana's high-speed network.
            </p>
          </section>

          {/* Problem & Solution Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl border" style={{ backgroundColor: colors.secondaryBg, borderColor: colors.borderDark }}>
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2" style={{ color: '#ef4444' }}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                The Problem
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
                Web3's explosion leaves security behind: 80-90% of contracts ship unaudited, exposing $10B+ in annual exploits from logic flaws, reentrancy, and cross-chain risks. Static scanners miss dynamic threats; manual audits take weeks and cost $50K+. Builders sacrifice safety for velocity, while users bear the losses.
              </p>
            </div>
            
            <div className="p-6 rounded-2xl border" style={{ backgroundColor: colors.secondaryBg, borderColor: colors.borderDark }}>
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2" style={{ color: colors.accent }}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Our Solution
              </h3>
              <p className="text-sm leading-relaxed mb-3" style={{ color: colors.textSecondary }}>
                Agent Yuki deploys a swarm of adaptive agents mimicking elite red teams:
              </p>
              <ul className="text-sm space-y-2 list-disc list-inside" style={{ color: colors.textSecondary }}>
                <li><strong style={{ color: colors.textPrimary }}>Logic Probes:</strong> Detect business flaws via symbolic execution and fuzzing.</li>
                <li><strong style={{ color: colors.textPrimary }}>Attack Simulators:</strong> Model flash loans, oracle manipulations, and bridges.</li>
                <li><strong style={{ color: colors.textPrimary }}>Predictive Engines:</strong> ML forecasts exploits using 1M+ historical data.</li>
              </ul>
            </div>
          </div>

          {/* Technical Architecture */}
          <section>
            <h2 className="text-2xl font-bold mb-6 border-b pb-2" style={{ color: colors.textPrimary, borderColor: colors.borderDark }}>
              Technical Architecture
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Agent Swarm', desc: '50+ specialized LLMs orchestrated via on-chain coordination.', icon: <Bot /> },
                { title: 'Zero-Knowledge Proofs', desc: 'Verify audits without revealing code.', icon: <Lock /> },
                { title: 'Hybrid Execution', desc: 'Off-chain simulation + on-chain consensus for trustless results.', icon: <Settings /> }
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border flex flex-col items-center text-center" style={{ borderColor: colors.borderDark, backgroundColor: colors.cardBg }}>
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h4 className="font-bold mb-2" style={{ color: colors.textPrimary }}>{item.title}</h4>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-sm italic" style={{ color: colors.textSecondary }}>Supports EVM, SVM, MoveVM with unified APIs.</p>
          </section>

          {/* Tokenomics */}
          <section>
            <h2 className="text-2xl font-bold mb-6 border-b pb-2" style={{ color: colors.textPrimary, borderColor: colors.borderDark }}>
              Tokenomics: $YUKI
            </h2>
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div>
                <div className="mb-6">
                  <span className="text-sm uppercase tracking-wider text-gray-500">Total Supply</span>
                  <div className="text-3xl font-mono font-bold" style={{ color: colors.accent }}>1,000,000,000 $YUKI</div>
                </div>
                
                <h3 className="font-bold mb-3" style={{ color: colors.textPrimary }}>Token Utility</h3>
                <ul className="space-y-2 text-sm" style={{ color: colors.textSecondary }}>
                  <li className="flex gap-2">
                    <span style={{ color: colors.accent }}>•</span>
                    Stake for priority audits and revenue share.
                  </li>
                  <li className="flex gap-2">
                    <span style={{ color: colors.accent }}>•</span>
                    Govern platform upgrades.
                  </li>
                  <li className="flex gap-2">
                    <span style={{ color: colors.accent }}>•</span>
                    Pay for premium features (e.g., custom agents).
                  </li>
                </ul>
                <div className="mt-6 text-xs p-3 rounded border bg-opacity-50" style={{ borderColor: colors.accent, backgroundColor: `${colors.accent}10`, color: colors.textSecondary }}>
                  <strong>Launch:</strong> Fair launch on Solana, January 2026—no VC dumps.
                </div>
              </div>

              {/* Allocation Table */}
              <div className="overflow-hidden rounded-xl border" style={{ borderColor: colors.borderDark }}>
                <table className="w-full text-sm text-left">
                  <thead style={{ backgroundColor: colors.secondaryBg }}>
                    <tr>
                      <th className="p-3 font-semibold" style={{ color: colors.textPrimary }}>Allocation</th>
                      <th className="p-3 font-semibold" style={{ color: colors.textPrimary }}>%</th>
                      <th className="p-3 font-semibold" style={{ color: colors.textPrimary }}>Vesting/Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: colors.borderDark }}>
                    {[
                      { name: 'Ecosystem/Staking', pct: '40%', note: 'Rewards for auditors/nodes' },
                      { name: 'Audits', pct: '25%', note: 'Burn mechanism via use' },
                      { name: 'Team/Vesting', pct: '15%', note: '4-year cliff + linear' },
                      { name: 'Liquidity', pct: '10%', note: 'DEXs (Raydium, Jupiter)' },
                      { name: 'Community', pct: '10%', note: 'Airdrops Q1 2026' }
                    ].map((row, idx) => (
                      <tr key={idx} style={{ backgroundColor: colors.cardBg }}>
                        <td className="p-3" style={{ color: colors.textSecondary }}>{row.name}</td>
                        <td className="p-3 font-mono" style={{ color: colors.accent }}>{row.pct}</td>
                        <td className="p-3" style={{ color: colors.textSecondary }}>{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Roadmap & Governance */}
          <div className="grid md:grid-cols-2 gap-12">
            <section>
              <h2 className="text-2xl font-bold mb-4 border-b pb-2" style={{ color: colors.textPrimary, borderColor: colors.borderDark }}>
                Roadmap
              </h2>
              <div className="space-y-4">
                {[
                  { q: 'Q1 2026', items: 'Mainnet beta, $YUKI TGE, 10-chain support' },
                  { q: 'Q2 2026', items: 'Full 20+ chains, VSCode/CI integrations, 100K audits' },
                  { q: 'Q3 2026', items: 'Predictive bounties, $500M TVS audited' },
                  { q: '2027', items: 'Cross-chain verifier, enterprise tier' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="font-mono font-bold min-w-[80px]" style={{ color: colors.accent }}>{item.q}</div>
                    <div className="text-sm" style={{ color: colors.textSecondary }}>{item.items}</div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 border-b pb-2" style={{ color: colors.textPrimary, borderColor: colors.borderDark }}>
                Governance
              </h2>
              <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
                Decentralized via $YUKI DAO on Solana Realms:
              </p>
              <ul className="space-y-2 text-sm" style={{ color: colors.textSecondary }}>
                <li className="flex gap-2">
                  <span style={{ color: colors.accent }}>•</span>
                  Proposal threshold: 1% staked $YUKI.
                </li>
                <li className="flex gap-2">
                  <span style={{ color: colors.accent }}>•</span>
                  Quarterly votes on agent upgrades, chain expansions, treasury.
                </li>
                <li className="flex gap-2">
                  <span style={{ color: colors.accent }}>•</span>
                  Human-AI hybrid: Community vetoes + agent risk scoring.
                </li>
              </ul>
            </section>
          </div>

          {/* Team */}
          <section>
             <h2 className="text-2xl font-bold mb-4 border-b pb-2" style={{ color: colors.textPrimary, borderColor: colors.borderDark }}>
              Core Team
            </h2>
            <div className="grid sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl border bg-opacity-50" style={{ borderColor: colors.borderDark, backgroundColor: colors.secondaryBg }}>
                <h4 className="font-bold mb-1" style={{ color: colors.textPrimary }}>Founders</h4>
                <p className="text-xs" style={{ color: colors.textSecondary }}>Ex-Paradigm security leads, Solana core contributors.</p>
              </div>
              <div className="p-4 rounded-xl border bg-opacity-50" style={{ borderColor: colors.borderDark, backgroundColor: colors.secondaryBg }}>
                <h4 className="font-bold mb-1" style={{ color: colors.textPrimary }}>Agents</h4>
                <p className="text-xs" style={{ color: colors.textSecondary }}>10+ PhDs in formal verification and AI.</p>
              </div>
              <div className="p-4 rounded-xl border bg-opacity-50" style={{ borderColor: colors.borderDark, backgroundColor: colors.secondaryBg }}>
                <h4 className="font-bold mb-1" style={{ color: colors.textPrimary }}>Advisors</h4>
                <p className="text-xs" style={{ color: colors.textSecondary }}>Industry vets from Forta, OpenZeppelin.</p>
              </div>
            </div>
          </section>

          {/* Disclaimers */}
          <section className="text-xs opacity-60 mt-20 pt-8 border-t" style={{ borderColor: colors.borderDark, color: colors.textSecondary }}>
            <p className="uppercase tracking-widest font-bold mb-2">Risks & Disclaimers</p>
            <p>Audits reduce but don't eliminate risks. $YUKI is volatile; DYOR. Not financial advice. Compliant with Solana ecosystem standards.</p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
