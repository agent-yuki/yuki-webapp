'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, Search, Lock, Code, Terminal, AlertTriangle, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function DemoSection() {
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % 4);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    const steps = [
        {
            icon: Search,
            title: "Deep Scan",
            desc: "Analyzing smart contract architecture...",
            color: "text-blue-400",
            bg: "bg-blue-400/10"
        },
        {
            icon: Code,
            title: "Code Review",
            desc: "Checking for reentrancy & logic flaws...",
            color: "text-yellow-400",
            bg: "bg-yellow-400/10"
        },
        {
            icon: Lock,
            title: "Security Verified",
            desc: "Validating ownership permissions...",
            color: "text-purple-400",
            bg: "bg-purple-400/10"
        },
        {
            icon: Shield,
            title: "Report Generated",
            desc: "Compiling comprehensive risk assessment...",
            color: "text-green-400",
            bg: "bg-green-400/10"
        }
    ];

    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -z-10" />

            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-4">
                            AI-Powered Security Analysis
                        </h2>
                        <p className="text-muted-foreground text-lg md:text-xl max-w-[800px]">
                            Watch our advanced agents dissect smart contracts in real-time to identify vulnerabilities before they happen.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Features List */}
                    <div className="space-y-6">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className={`p-4 rounded-xl border border-white/5 transition-all duration-300 ${activeStep === index
                                        ? 'bg-white/10 border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)]'
                                        : 'bg-transparent hover:bg-white/5'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-lg ${step.bg}`}>
                                        <step.icon className={`w-6 h-6 ${step.color}`} />
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold text-lg ${activeStep === index ? 'text-white' : 'text-gray-400'}`}>
                                            {step.title}
                                        </h3>
                                        <p className="text-sm text-gray-400">{step.desc}</p>
                                    </div>
                                    {activeStep === index && (
                                        <motion.div
                                            layoutId="active-indicator"
                                            className="ml-auto"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Right: Interactive Terminal/Window */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                    >
                        <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#0A0A0A] shadow-2xl">
                            {/* Window Header */}
                            <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/5">
                                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                <div className="ml-2 px-3 py-0.5 rounded-md bg-black/50 text-[10px] text-gray-500 font-mono">
                                    agent-yuki-analyzer — v1.0.4
                                </div>
                            </div>

                            {/* Terminal Content */}
                            <div className="p-6 font-mono text-sm min-h-[400px]">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-green-400">
                                        <span className="text-blue-500">➜</span>
                                        <span>initiating_scan(target_contract)...</span>
                                    </div>

                                    {activeStep >= 0 && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-gray-400 pl-4 py-2"
                                        >
                                            [INFO] Parsing bytecode architecture
                                            <br />
                                            [INFO] Identifying function signatures...
                                        </motion.div>
                                    )}

                                    {activeStep >= 1 && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="pl-4 py-2 border-l-2 border-yellow-500/30 bg-yellow-500/5"
                                        >
                                            <div className="text-yellow-400 mb-1">(!) Analyzing Logic Constraints</div>
                                            <div className="text-gray-500">
                                                &gt; Checking external calls... <span className="text-green-500">SAFE</span>
                                                <br />
                                                &gt; verifying arithmetic ops... <span className="text-green-500">SAFE</span>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeStep >= 2 && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="pl-4 py-2"
                                        >
                                            <div className="flex items-center gap-2 text-purple-400">
                                                <Lock className="w-3 h-3" />
                                                <span>Verifying ownership controls...</span>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeStep >= 3 && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="mt-4 p-3 rounded bg-green-500/10 border border-green-500/20"
                                        >
                                            <div className="flex items-center gap-2 text-green-400 font-bold mb-1">
                                                <CheckCircle className="w-4 h-4" />
                                                <span>SCAN COMPLETE</span>
                                            </div>
                                            <div className="text-gray-400 text-xs">
                                                Risk Score: <span className="text-white">92/100 (LOW RISK)</span>
                                                <br />
                                                Vulnerabilities Found: 0
                                            </div>
                                        </motion.div>
                                    )}

                                    <motion.div
                                        animate={{ opacity: [0, 1, 0] }}
                                        transition={{ repeat: Infinity, duration: 0.8 }}
                                        className="w-2 h-4 bg-blue-500 mt-2"
                                    />
                                </div>
                            </div>

                            {/* Decorative Glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] pointer-events-none" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
