"use client"
import { UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import React from 'react';

function Header() {
    const path = usePathname();

    return (
        <header className="w-screen border-b border-slate-800 bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-2xl shadow-2xl shadow-slate-950/50">
            <div className="max-w-7xl mx-auto px-6 py-7 flex items-center justify-between">
                {/* Logo with floating effect */}
                <div className="hover:-translate-y-0.5 transition-transform duration-300">
                    <img 
                    // logo ka link
                        src="/logo.svg" 
                        width={180}
                        height={10}
                        alt="InterviewIQ" 
                        className="filter brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
                    />
                </div>

                {/* Navigation with animated indicators */}
                <nav className="hidden md:flex items-center space-x-20">
                    {[
                        { path: '/Dashboard', label: 'Dashboard' },
                        { path: '/Dashboard/Questions', label: 'Questions' },
                        { path: '/Dashboard/Upgrade', label: 'Premium' },
                        { path: '/Dashboard/How', label: 'Guidance' }
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

                {/* User control with premium styling */}
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
    );
}

export default Header;