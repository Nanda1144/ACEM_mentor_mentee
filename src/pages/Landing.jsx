import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Users, ShieldCheck, ArrowRight, Star, CheckCircle2, Globe, Laptop } from 'lucide-react';

export default function Landing() {
    const navigate = useNavigate();

    const features = [
        {
            icon: <Users className="text-blue-500" size={24} />,
            title: "Mentor Connectivity",
            desc: "Direct linkage between students and specialized mentors for personalized guidance."
        },
        {
            icon: <Globe className="text-emerald-500" size={24} />,
            title: "Global Reach",
            desc: "Access academic resources and track multi-disciplinary projects from anywhere."
        },
        {
            icon: <ShieldCheck className="text-purple-500" size={24} />,
            title: "Verified Tracking",
            desc: "Secure submission of weekly reports and automatic attendance monitoring."
        }
    ];

    return (
        <div className="min-h-screen bg-background overflow-x-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
            </div>

            {/* Navigation */}
            <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <GraduationCap size={24} />
                    </div>
                    <span className="text-xl font-black tracking-tighter">EDUCONNECT</span>
                </div>
                <div className="hidden md:flex items-center gap-8">
                    <a href="#features" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest">Features</a>
                    <a href="#about" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest">About</a>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all text-sm"
                    >
                        Sign In
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 pt-20 pb-32 px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest mb-6">
                            <Star size={14} fill="currentColor" />
                            Next Gen Mentorship Platform
                        </div>
                        <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8">
                            Bridge the gap between <span className="text-primary italic">Learning</span> and <span className="text-primary italic">Expertise</span>.
                        </h1>
                        <p className="text-lg text-muted-foreground mb-10 max-w-lg leading-relaxed">
                            Empower your academic journey with EDUCONNECT. Seamlessly connect with mentors, track your weekly progress, and build a professional portfolio that stands out.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => navigate('/login')}
                                className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group"
                            >
                                Get Started Now
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => navigate('/login', { state: { guest: true } })}
                                className="px-8 py-4 bg-muted text-foreground rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-muted/80 transition-all flex items-center justify-center gap-3"
                            >
                                Try Guest Access
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border border-white/20 glass p-4">
                            <div className="bg-background rounded-[2.5rem] p-8 min-h-[400px] flex flex-col justify-center items-center text-center">
                                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-6 animate-pulse">
                                    <Laptop size={40} />
                                </div>
                                <h3 className="text-2xl font-black mb-4">Unified Dashboard</h3>
                                <div className="space-y-3 w-full max-w-xs mx-auto">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-4 bg-muted rounded-full w-full animate-pulse opacity-50" style={{ animationDelay: `${i * 0.2}s` }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* Decorative floating elements */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl animate-bounce" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative z-10 py-32 bg-muted/30">
                <div className="px-8 max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-black tracking-tight mb-4 uppercase">Powerful Features</h2>
                        <p className="text-muted-foreground uppercase text-xs font-bold tracking-[0.2em]">Designed for students, verified by mentors.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 bg-card border border-border rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 py-32 px-8 overflow-hidden">
                <div className="max-w-5xl mx-auto bg-primary rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-primary/40">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-8 leading-tight">
                            Ready to transform your academic journey?
                        </h2>
                        <div className="flex flex-wrap justify-center gap-6">
                            <div className="flex items-center gap-2 text-white/80 text-sm font-bold uppercase tracking-widest">
                                <CheckCircle2 size={18} className="text-white" />
                                Easy Registration
                            </div>
                            <div className="flex items-center gap-2 text-white/80 text-sm font-bold uppercase tracking-widest">
                                <CheckCircle2 size={18} className="text-white" />
                                Mentor Support
                            </div>
                            <div className="flex items-center gap-2 text-white/80 text-sm font-bold uppercase tracking-widest">
                                <CheckCircle2 size={18} className="text-white" />
                                Achievement Logs
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/login')}
                            className="mt-12 px-10 py-5 bg-white text-primary rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-black/10 hover:scale-105 active:scale-95 transition-all"
                        >
                            Get Started for Free
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-border py-12 px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                            <GraduationCap size={18} />
                        </div>
                        <span className="text-lg font-black tracking-tighter">EDUCONNECT</span>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">© 2026 EduConnect Platform. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
