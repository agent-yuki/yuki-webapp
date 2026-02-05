'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useTheme } from '../../contexts/ThemeContext';

export default function AboutPage() {
  const { colors } = useTheme();

  return (
    <div className="min-h-screen selection:bg-cyan-500 selection:text-white" style={{ backgroundColor: colors.primaryBg }}>
      <Navbar />
      
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 
            className="text-4xl md:text-5xl font-bold mb-6 tracking-tight"
            style={{ color: colors.textPrimary }}
          >
            About <span style={{ color: colors.accent }}>Agent Yuki</span>
          </h1>
          <p 
            className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ color: colors.textSecondary }}
          >
            Agent Yuki's full About page expands on the core sections with detailed, standalone content for easy integration.
          </p>
        </div>

        {/* Vision & Mission Grid */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          {/* Our Vision */}
          <div 
            className="p-8 rounded-2xl border transition-all duration-300 hover:shadow-lg"
            style={{ 
              backgroundColor: colors.cardBg,
              borderColor: colors.borderDark 
            }}
          >
            <h2 
              className="text-2xl font-bold mb-4 flex items-center gap-3"
              style={{ color: colors.textPrimary }}
            >
              <span className="w-2 h-8 rounded-full" style={{ backgroundColor: colors.accent }}></span>
              Our Vision
            </h2>
            <p className="leading-relaxed" style={{ color: colors.textSecondary }}>
              Agent Yuki redefines Web3 security by fusing adaptive AI agents with human intuition, ensuring no vulnerability slips through—even in the most intricate DeFi protocols or NFT marketplaces. We envision a world where builders focus on innovation, not fear, as our platform preempts exploits before they emerge. Founded by ex-Consensys and Paradigm engineers, Agent Yuki scales security to match Web3's explosive growth.
            </p>
          </div>

          {/* What We Do */}
          <div 
            className="p-8 rounded-2xl border transition-all duration-300 hover:shadow-lg"
            style={{ 
              backgroundColor: colors.cardBg,
              borderColor: colors.borderDark 
            }}
          >
            <h2 
              className="text-2xl font-bold mb-4 flex items-center gap-3"
              style={{ color: colors.textPrimary }}
            >
              <span className="w-2 h-8 rounded-full" style={{ backgroundColor: colors.accent }}></span>
              What We Do
            </h2>
            <p className="leading-relaxed" style={{ color: colors.textSecondary }}>
              Our platform deploys a swarm of specialized agents that collaborate like a elite security team: one probes for logic bombs, another stress-tests cross-chain bridges, and a third predicts flash-loan attacks via Monte Carlo simulations. Unlike rigid tools, Yuki learns from your codebase in real-time, adapting to custom patterns and generating fix suggestions with 95% accuracy. This end-to-end pipeline integrates natively into your workflow, turning security into a superpower rather than a bottleneck.
            </p>
          </div>
        </div>

        {/* Key Capabilities */}
        <div>
          <h2 
            className="text-3xl font-bold mb-10 text-center"
            style={{ color: colors.textPrimary }}
          >
            Key Capabilities
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Lightning Audits",
                desc: "Full-spectrum scans complete in 2-5 minutes, covering 10x more exploit vectors than competitors."
              },
              {
                title: "Chain Agnostic",
                desc: "Native support for EVM (Ethereum, L2s), SVM (Solana), Move (Sui/Aptos), plus emerging L3s."
              },
              {
                title: "Dev-Centric Tools",
                desc: "One-click VSCode extension audits PRs; GitHub Copilot-like suggestions; serverless CI/CD hooks."
              },
              {
                title: "Multi-Language Intelligence",
                desc: "Parses Solidity, Rust, Vyper; auto-translates findings into plain English or code diffs."
              },
              {
                title: "Predictive Threat Intel",
                desc: "ML models trained on 1M+ historical exploits forecast risks with 92% precision."
              },
              {
                title: "Collaborative Mode",
                desc: "Human-AI loop lets devs override agents, refining models for your project's DNA."
              }
            ].map((capability, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-xl border group hover:-translate-y-1 transition-all duration-300"
                style={{ 
                  backgroundColor: colors.secondaryBg,
                  borderColor: colors.borderDark 
                }}
              >
                <h3 
                  className="text-xl font-semibold mb-3 group-hover:opacity-80 transition-opacity"
                  style={{ color: colors.accent }}
                >
                  {capability.title}
                </h3>
                <p style={{ color: colors.textSecondary }}>
                  {capability.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
