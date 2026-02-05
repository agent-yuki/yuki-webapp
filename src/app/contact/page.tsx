'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Mail, MapPin, MessageSquare, Send, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
            <Navbar />

            {/* Background Effects removed (now global) */}

            <main className="relative z-10 container mx-auto px-4 py-32 max-w-6xl">
                <div className="text-center mb-20 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="px-3 py-1 rounded-full border border-accent/20 bg-accent/10 text-xs font-mono text-accent uppercase tracking-wider">
                            Contact Us
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight text-foreground"
                    >
                        Let's build secure <br />
                        <span className="text-accent">future together</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl text-muted-foreground max-w-2xl mx-auto"
                    >
                        Have questions about our enterprise security solutions? ready to integrate Yuki into your workflow?
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Contact Cards */}
                    <div className="space-y-6">
                        {[
                            {
                                icon: Mail,
                                title: "Email Support",
                                desc: "For general inquiries and support",
                                link: "support@yuki.ai",
                                color: "text-accent",
                                bg: "bg-accent/10",
                                border: "border-accent/20"
                            },
                            {
                                icon: MessageSquare,
                                title: "Join Community",
                                desc: "Get real-time help on our Discord",
                                link: "discord.gg/yuki-ai",
                                color: "text-foreground", // Less emphasis
                                bg: "bg-secondary/50",
                                border: "border-border"
                            },
                            {
                                icon: MapPin,
                                title: "Global Office",
                                desc: "Crypto Valley, CA 94043",
                                link: "View on Map",
                                color: "text-foreground",
                                bg: "bg-secondary/50",
                                border: "border-border"
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 + (i * 0.1) }}
                                className="group relative p-6 rounded-2xl border border-border bg-card hover:bg-accent/5 hover:border-accent/30 transition-all duration-300 overflow-hidden"
                            >
                                <div className="flex items-start gap-5 relative z-10">
                                    <div className={`p-4 rounded-xl ${item.bg} border ${item.border} ${item.color}`}>
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-foreground mb-1">
                                            {item.title}
                                        </h3>
                                        <p className="text-muted-foreground mb-2">{item.desc}</p>
                                        <div className={`flex items-center gap-2 text-sm font-medium ${item.color === 'text-accent' ? 'text-accent' : 'text-foreground/80'} group-hover:text-accent cursor-pointer transition-colors`}>
                                            {item.link}
                                            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="relative p-8 rounded-3xl border border-border bg-card/50 backdrop-blur-xl shadow-2xl"
                    >
                        {/* Glow Effect */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/10 rounded-full blur-[80px] pointer-events-none" />

                        <h3 className="text-2xl font-bold text-foreground mb-6">Send us a message</h3>

                        <form className="space-y-5 relative z-10">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-muted-foreground ml-1">First Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-input text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:bg-accent/5 focus:outline-none transition-all"
                                        placeholder="John"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-muted-foreground ml-1">Last Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-input text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:bg-accent/5 focus:outline-none transition-all"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-muted-foreground ml-1">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-input text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:bg-accent/5 focus:outline-none transition-all"
                                    placeholder="john@company.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-muted-foreground ml-1">Your Message</label>
                                <textarea
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-input text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:bg-accent/5 focus:outline-none transition-all resize-none"
                                    placeholder="How can we help you secure your smart contracts?"
                                />
                            </div>

                            <button
                                type="button"
                                className="group w-full py-4 px-6 bg-accent text-accent-foreground font-bold rounded-xl transition-all shadow-lg hover:shadow-accent/25 flex items-center justify-center gap-2 hover:bg-accent/90"
                            >
                                <Send className="w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                                Send Message
                            </button>
                        </form>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
