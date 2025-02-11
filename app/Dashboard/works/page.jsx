"use client";
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { MonitorPlay, BrainCircuit, TextSearch, BadgeInfo } from 'lucide-react';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100
    }
  },
  hover: {
    y: -10,
    scale: 1.02,
    transition: { duration: 0.3 }
  }
};

function Header() {
    const path = usePathname();

    return (
        <header className="w-full  my-4 border-b border-slate-800/60 bg-slate-950/90 backdrop-blur-3xl fixed top-0 z-50 left-0">
            <div className="w-full mx-auto px-6 py-10 flex items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="hover:-translate-y-0.5 transition-transform duration-300"
                >
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                        Interview PrepPro
                    </h1>
                </motion.div>

                <nav className="hidden md:flex items-center space-x-12">
                    {[
                        { path: '/Dashboard', label: 'Dashboard' },
                        { path: '/Dashboard/Questions', label: 'Questions' },
                        { path: '/Dashboard/About', label: 'About' },
                        { path: '/Dashboard/works', label: 'Process' },
                    ].map((item) => (
                        <a
                            key={item.path}
                            href={item.path}
                            className={`group relative px-4 py-2.5 transition-colors duration-300
                                ${path === item.path ? 'text-white' : 'text-slate-300 hover:text-white'}
                            `}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {item.label}
                                <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-gradient-to-r from-blue-400 to-purple-400 transition-all group-hover:w-full" />
                            </span>
                        </a>
                    ))}
                </nav>

                <div className="flex items-center space-x-4">
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="relative p-[2px] rounded-full bg-gradient-to-r from-blue-400/80 to-purple-400/80 hover:shadow-purple-400/20 transition-all shadow-lg"
                    >
                        <div className="bg-slate-900 rounded-full p-1.5 border border-slate-800/50">
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "h-9 w-9",
                                        userButtonPopoverCard: "bg-slate-900 border border-slate-800 rounded-xl backdrop-blur-xl",
                                        userButtonTrigger: "shadow-lg"
                                    }
                                }}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </header>
    );
}

function HowItWorksPage() {
    const steps = [
        {
            icon: <BrainCircuit className="w-8 h-8 text-purple-400" />,
            title: "AI-Powered Analysis",
            description: "Our system analyzes your profile using advanced NLP to understand your skills and experience."
        },
        {
            icon: <TextSearch className="w-8 h-8 text-blue-400" />,
            title: "Smart Question Generation",
            description: "Leveraging Gemini AI, we generate tailored questions matching your target role and skill level."
        },
        {
            icon: <MonitorPlay className="w-8 h-8 text-pink-400" />,
            title: "Realistic Simulation",
            description: "Experience lifelike video interviews with AI-powered follow-up questions and real-time analysis."
        },
        {
            icon: <BadgeInfo className="w-8 h-8 text-cyan-400" />,
            title: "Detailed Feedback",
            description: "Receive comprehensive performance breakdowns with improvement suggestions and skill ratings."
        }
    ];

    return (
        <div className="w-full min-h-screen relative overflow-y-auto">
            <Header />
            
            <div className="fixed inset-0 z-0">
                <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover opacity-50"
                >
                    <source src="/videos/webvdo.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 to-indigo-950/80" />
                <div className="absolute inset-0 noise-overlay" />
            </div>

            <div className="relative z-10 pt-32 pb-24 px-4">
                <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    className="max-w-7xl mx-auto space-y-16"
                >
                    <motion.div 
                        variants={cardVariants}
                        className="text-center space-y-6"
                    >
                        <motion.h1 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-6xl font-bold bg-gradient-to-r from-blue-300 via-purple-200 to-pink-300 bg-clip-text text-transparent tracking-tight"
                        >
                            Intelligent Interview Prep
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xl text-slate-300/90 max-w-2xl mx-auto font-light leading-relaxed"
                        >
                            Experience the future of interview preparation with our AI-driven platform combining cutting-edge technology with personalized feedback.
                        </motion.p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                variants={cardVariants}
                                whileHover="hover"
                                className="group relative bg-slate-900/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-800/50 hover:border-purple-400/30 transition-colors"
                            >
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative z-10 space-y-6">
                                    <div className="w-14 h-14 rounded-xl bg-slate-800/50 flex items-center justify-center">
                                        {step.icon}
                                    </div>
                                    <h3 className="text-2xl font-semibold text-slate-100">{step.title}</h3>
                                    <p className="text-slate-300/80 leading-relaxed">{step.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div 
                        variants={cardVariants}
                        className="bg-slate-900/40 backdrop-blur-xl rounded-3xl p-12 border border-slate-800/50 mx-8 space-y-8"
                    >
                        <div className="space-y-4">
                            <h2 className="text-3xl font-semibold text-slate-100">Advanced Process Overview</h2>
                            <p className="text-slate-300/80 max-w-3xl leading-relaxed">
                                Our system combines multiple AI models to create a comprehensive preparation experience. 
                                Through natural language processing and machine learning, we analyze your responses in real-time,
                                providing insights comparable to human expert evaluations.
                            </p>
                        </div>
                        
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="p-6 rounded-xl bg-gradient-to-br from-slate-900/50 to-indigo-900/20 border border-slate-800/50">
                                <h4 className="text-lg font-semibold text-slate-100 mb-4">Real-time Analysis</h4>
                                <p className="text-slate-300/80">
                                    Speech pattern analysis, keyword detection, and sentiment evaluation provide immediate feedback on your communication style.
                                </p>
                            </div>
                            <div className="p-6 rounded-xl bg-gradient-to-br from-slate-900/50 to-purple-900/20 border border-slate-800/50">
                                <h4 className="text-lg font-semibold text-slate-100 mb-4">Progress Tracking</h4>
                                <p className="text-slate-300/80">
                                    Detailed analytics dashboard tracks your improvement over time across multiple competency areas.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] opacity-20 animate-float" />
            <div className="fixed bottom-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] opacity-20 animate-float-delayed" />

            <style jsx global>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-20px) scale(1.05); }
                }

                .animate-float {
                    animation: float 8s ease-in-out infinite;
                }

                .animate-float-delayed {
                    animation: float 8s ease-in-out 2s infinite;
                }

                .noise-overlay {
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
                    opacity: 0.08;
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
}

export default HowItWorksPage;