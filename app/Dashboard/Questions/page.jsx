"use client";
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { getUserInterviewData } from '@/utils/userData';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const fadeIn = (direction = 'up', type, delay, duration) => ({
  hidden: {
    y: direction === 'up' ? 40 : -60,
    opacity: 0,
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: type || 'spring',
      delay,
      duration,
      ease: 'easeOut'
    }
  }
});

function Header() {
    const path = usePathname();

    return (
        <div className='w-100%'>
        <header className="w-full border-b my-4 border-slate-800 bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-2xl shadow-2xl shadow-slate-950/50 fixed top-0 z-50 left-0 right-0">
            <div className="w-full mx-auto px-3 py-8  flex items-center justify-between">
                <div className="hover:-translate-y-0.5 transition-transform duration-300">
                    <motion.h1 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-300 to-pink-400 bg-clip-text text-transparent"
                    >
                        Interview PrepPro
                    </motion.h1>
                </div>

                <nav className="hidden md:flex items-center space-x-20">
                    {[
                        { path: '/Dashboard', label: 'Dashboard' },
                        { path: '/Dashboard/Questions', label: 'Questions' },
                        { path: '/Dashboard/About', label: 'About developer' },
                        { path: '/Dashboard/works', label: 'How it works' },
                    ].map((item) => (
                        <a
                            key={item.path}
                            href={item.path}
                            className={`relative px-4 py-2.5 text-slate-300 group transition-all duration-300
                                ${path === item.path ? 'text-white' : 'hover:text-white'}
                            `}
                        >
                            <span className="relative z-10">
                                {item.label}
                                {path === item.path && (
                                    <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full animate-underline-glow" />
                                )}
                            </span>
                            <span className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity" />
                        </a>
                    ))}
                </nav>

                <div className="flex items-center space-x-4">
                    <div className="relative p-[2px] rounded-full bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-300 hover:to-purple-300 transition-all shadow-lg hover:shadow-purple-500/30">
                        <div className="bg-slate-900 rounded-full p-1 border border-slate-800/50">
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "h-10 w-10",
                                        userButtonPopoverCard: "bg-slate-900 border border-slate-800 rounded-xl",
                                        userButtonTrigger: "shadow-lg"
                                    }
                                }}
                            />
                        </div>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 pointer-events-none animate-pulse-slow" />
                    </div>
                </div>
            </div>
        </header>
        </div>
    );
}

function QuestionsPage() {
    const { user } = useUser();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const data = await getUserInterviewData(user.primaryEmailAddress.emailAddress);
            setQuestions(data);
        } catch (error) {
            console.error("Error fetching questions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.primaryEmailAddress?.emailAddress) {
            fetchQuestions();
        }
    }, [user]);

    return (
        <div className="w-full min-h-screen relative overflow-y-auto">
            <Header />
            
            <div className="fixed inset-0 z-0">
                <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover"
                >
                    <source src="/videos/webvdo.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 to-indigo-900/60" />
                <div className="absolute inset-0 noise-overlay" />
            </div>

            <div className="relative z-10 pt-24">
                <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    className="p-8 w-full mx-auto space-y-8"
                >
                    <motion.div variants={fadeIn('down', 'tween', 0.2, 1)} className="space-y-4 pt-8">
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] text-center">
                            Questions
                        </h1>
                        <p className="text-slate-300 text-xl text-center font-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                            All your interview questions in one place
                        </p>
                    </motion.div>

                    <motion.div variants={fadeIn('up', 'tween', 0.3, 1)} className="bg-slate-900/40 rounded-2xl p-6 border border-slate-700/30 backdrop-blur-2xl shadow-2xl mx-4">
                        {loading ? (
                            <div className="text-center text-slate-300">Loading questions...</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {questions.map((question, index) => (
                                    <div key={index} className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/30 backdrop-blur-2xl shadow-lg">
                                        <h3 className="text-lg font-semibold text-slate-200">{question.question}</h3>
                                        <p className="text-slate-300 mt-2">{question.answer}</p>
                                        <div className="mt-4 flex items-center space-x-2">
                                            <span className="text-s text-red-400">Rating: {question.rating}/10</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            </div>

            <div className="fixed top-0 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 opacity-30" />
            <div className="fixed bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 opacity-30" />

            <style jsx global>{`
                .noise-overlay {
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
                    opacity: 0.05;
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
}

export default QuestionsPage;