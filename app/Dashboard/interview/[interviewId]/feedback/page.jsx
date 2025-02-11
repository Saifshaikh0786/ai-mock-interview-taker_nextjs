"use client";

import { UserAnswer } from "@/utils/schema";
import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
import { use } from "react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from 'framer-motion';
import moment from 'moment';

function Feedback({ params }) {
    const unwrappedParams = use(params);
    const { interviewId } = unwrappedParams;
    const [feedbackList, setFeedbackList] = useState([]);
    const route = useRouter();
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        GetFeedback();
    }, []);

    const GetFeedback = async () => {
        const cleanedInterviewId = decodeURIComponent(interviewId).replace(/\+/g, '');
        const result = await db
            .select()
            .from(UserAnswer)
            .where(eq(UserAnswer.mockIdRef, cleanedInterviewId))
            .orderBy(UserAnswer.id);
        
        setFeedbackList(result);
        calculateAverage(result);
    };

    const calculateAverage = (data) => {
        if (data.length === 0) return 0;
        const total = data.reduce((acc, item) => acc + Number(item.rating), 0);
        setAverageRating(total / data.length);
    };

    const getRatingColor = (rating) => {
        if (rating >= 8) return 'from-teal-400 to-cyan-400';
        if (rating >= 5) return 'from-amber-400 to-orange-400';
        return 'from-rose-400 to-pink-400';
    };


    
    return (

        <div className="w-full min-h-screen relative overflow-y-auto">
    
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 0.85, y: 0 }}
                    className="my-6 p-10 rounded-2xl max-w-80xl mx-auto shadow-2xl shadow-slate-900/30 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50"
                >
                    <div className="mb-10 text-center space-y-6">
                        <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 font-bold text-2xl mb-4">
                            🚀 Interview Successfully Completed!
                        </h2>
                        
                        <div className="relative inline-block">
                            <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
                            <h2 className="relative text-5xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                Congratulations!
                            </h2>
                        </div>
                        
                        <div className="h-px bg-gradient-to-r from-transparent via-slate-600/50 to-transparent my-6" />
                    </div>

                    <div className="space-y-10">
                        <div className="p-6 bg-slate-800/30 rounded-xl border border-slate-700/50 backdrop-blur-lg transition-all hover:border-slate-600/">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-slate-400"> Your Overall Performance</h3>
                                <div className={`bg-gradient-to-r ${getRatingColor(averageRating)} text-transparent bg-clip-text text-3xl font-bold`}>
                                    {averageRating.toFixed(1)}/10
                                </div>
                            </div>
                            <div className="mt-4 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-1000 ease-out" 
                                    style={{ width: `${(averageRating / 10) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-slate-300 bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                                📋 Detailed Question Analysis
                            </h3>
                            
                            <div className="space-y-4">
                                {feedbackList.map((item, index) => (
                                    <Collapsible key={index} className="group">
                                        <CollapsibleTrigger className="w-full p-5 bg-slate-800/20 hover:bg-slate-800/40 rounded-xl flex justify-between items-center transition-all duration-300 border border-slate-700/50 hover:border-slate-500/50 shadow-lg hover:shadow-slate-700/20">
                                        <span className="text-left font-medium text-slate-300 pr-4">
                                            {item.question}
                                        </span>
                                        <div className="flex items-center space-x-3">
                                            <div className={`text-sm font-bold px-3 py-1 rounded-full bg-gradient-to-r ${getRatingColor(item.rating)}`}>
                                                {item.rating}/10
                                            </div>
                                            <ChevronsUpDown className="h-5 w-5 text-slate-400 transition-transform group-data-[state=open]:rotate-180 duration-300" />
                                        </div>
                                        </CollapsibleTrigger>
                                        
                                        <CollapsibleContent className="mt-3 pl-5">
                                            <div className="p-4 bg-slate-800/20 rounded-xl border border-slate-700/30 backdrop-blur-lg">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                                                        <h4 className="text-sm font-semibold text-slate-400 mb-2">Your Answer Rating</h4>
                                                        <div className={`text-2xl text-red-600 font-bold  ${getRatingColor(item.rating).replace('from-', 'text-').replace('to-', ' ')}`}>
                                                            {item.rating}/10
                                                        </div>
                                                    </div>
                                                    <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                                                        <h4 className="text-sm font-semibold text-slate-400 mb-2">Key Feedback</h4>
                                                        <p className="text-slate-300 text-sm leading-relaxed">
                                                            {item.feedback || "Detailed feedback not available"}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                                                        <h4 className="text-sm font-semibold text-slate-400 mb-2">Correct Answer</h4>
                                                        <p className="text-slate-300 text-sm leading-relaxed">
                                                            {item.correctAns || "Detailed feedback not available"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CollapsibleContent>
                                    </Collapsible>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-700/50 text-center">
                        <p className="text-sm text-slate-500 font-medium">
                            🏅 Continue your journey to excellence! 
                            <span className="ml-2 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                                Next goal awaits!
                            </span>
                        </p>
                        <Button 
                            onClick={() => route.replace('/Dashboard')}
                            className="mt-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                        >
                            View Dashboard Analytics/Home
                        </Button>
                    </div>
                </motion.div>
            </div>

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

export default Feedback;


// "use client";

// import { UserAnswer } from "@/utils/schema";
// import React, { useEffect } from "react";
// import { db } from "@/utils/db";
// import { eq } from "drizzle-orm";
// import { use } from "react";
// import {
//     Collapsible,
//     CollapsibleContent,
//     CollapsibleTrigger,
// } from "@/components/ui/collapsible";
// import { useState } from "react";
// import { ChevronsUpDown } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";

// function Feedback({ params }) {

    
//     const unwrappedParams = use(params);
//     const { interviewId } = unwrappedParams;
//     const [feedbackList, setFeedbackList] = useState([]);
//     const route=useRouter();

//     useEffect(() => {
//         GetFeedback();
//     }, []);

//     const GetFeedback = async () => {
//         const cleanedInterviewId = decodeURIComponent(interviewId).replace(/\+/g, '');
//         const result = await db
//             .select()
//             .from(UserAnswer)
//             .where(eq(UserAnswer.mockIdRef, cleanedInterviewId))
//             .orderBy(UserAnswer.id);
//         setFeedbackList(result);
//     };

//     // Dynamic color based on rating
//     const getRatingColor = (rating) => {
//         if (rating >= 8) return 'from-teal-400 to-cyan-400';
//         if (rating >= 5) return 'from-amber-400 to-orange-400';
//         return 'from-rose-400 to-pink-400';
//     };

//     return (
//         <div className="my-6 p-10 rounded-2xl max-w-80xl mx-auto shadow-2xl shadow-slate-900/30 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 animate-float">
//             {/* Header Section */}
//             <div className="mb-10 text-center space-y-6">
//                 <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 font-bold text-2xl mb-4 animate-text-shine">
//                     🚀 Interview Successfully Completed!
//                 </h2>
                
//                 <div className="relative inline-block">
//                     <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
//                     <h2 className="relative mb- text-5xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent ">
//                         Congratulations!
//                     </h2>
//                     <div className="">

//                     </div>
//                 </div>
                
//                 <div className="h-px bg-gradient-to-r from-transparent via-slate-600/50 to-transparent my-6" />
//             </div>

//             {/* Main Content */}
//             <div className="space-y-10">
//                 {/* Rating Section */}
//                 <div className="p-6 bg-slate-800/30 rounded-xl border border-slate-700/50 backdrop-blur-lg transition-all hover:border-slate-600/70">
//                     <div className="flex items-center justify-between">
//                         <h3 className="text-lg font-semibold text-slate-400">Your Overall Performance</h3>
//                         <div className={`bg-gradient-to-r ${getRatingColor()} text-transparent bg-clip-text text-3xl font-bold`}>
//                             7/10
//                         </div>
//                     </div>
//                     <div className="mt-4 h-2 bg-slate-700/50 rounded-full overflow-hidden">
//                         <div 
//                             className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-1000 ease-out" 
//                             style={{ width: `${(7/10)*100}%` }}
//                         />
//                     </div>
//                 </div>

//                 {/* Questions Section */}
//                 <div className="space-y-6">
//                     <h3 className="text-xl font-semibold text-slate-300 bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
//                         📋 Detailed Question Analysis
//                     </h3>
                    
//                     <div className="space-y-4">
//                         {feedbackList && feedbackList.map((item, index) => (
//                             <Collapsible key={index} className="group">
//                                 <CollapsibleTrigger className="w-full p-5 bg-slate-800/20 hover:bg-slate-800/40 rounded-xl flex justify-between items-center transition-all duration-300 border border-slate-700/50 hover:border-slate-500/50 shadow-lg hover:shadow-slate-700/20">
//                                     <span className="text-left font-medium text-slate-300 pr-4">
//                                         {item.question}
//                                     </span>
//                                     <div className="flex items-center space-x-3">
//                                         <div className={`text-sm font-bold px-3 py-1 rounded-full bg-gradient-to-r ${getRatingColor(item.rating)}`}>
//                                             {item.rating}/10
//                                         </div>
//                                         <ChevronsUpDown className="h-5 w-5 text-slate-400 transform transition-transform group-data-[state=open]:rotate-180 duration-300" />
//                                     </div>
//                                 </CollapsibleTrigger>
                                
//                                 <CollapsibleContent className="mt-3 pl-5 animate-collapsible-open">
//                                     <div className="p-4 bg-slate-800/20 rounded-xl border border-slate-700/30 backdrop-blur-lg">
//                                         <div className="grid grid-cols-2 gap-4">
//                                             <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
//                                                 <h4 className="text-sm font-semibold text-slate-400 mb-2">Your Answer Rating</h4>
//                                                 <div className={`text-2xl font-bold text-red-600 ${getRatingColor(item.rating).replace('from-', 'text-').replace('to-', ' ')}`}>
//                                                     {item.rating}/10
//                                                 </div>
//                                             </div>
//                                             <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
//                                                 <h4 className="text-sm font-semibold text-slate-400 mb-2">Key Feedback</h4>
//                                                 <p className="text-slate-300 text-sm leading-relaxed">
//                                                     {item.feedback || "Detailed feedback not available"}
//                                                 </p>
//                                             </div>
//                                             <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
//                                                 <h4 className="text-sm font-semibold text-slate-400 mb-2">Correct Answer</h4>
//                                                 <p className="text-slate-300 text-sm leading-relaxed">
//                                                     {item.correctAns || "Detailed feedback not available"}
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </CollapsibleContent>
//                             </Collapsible>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* Footer */}
//             <div className="mt-12 pt-8 border-t border-slate-700/50 text-center">
//                 <p className="text-sm text-slate-500 font-medium">
//                     🏅 Continue your journey to excellence! 
//                     <span className="ml-2 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
//                         Next goal awaits!
//                     </span>
                    
//                 </p>
//             </div>
//             <div className="mt-2 text-center">
//                 <p className="text-sm text-slate-500 font-medium">
//                     🏅This website is owned and developed by   
//                     <span className="ml-2 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
//                         Saif Siddique
                        
//                     </span>
                    
//                 </p>
//             </div>
//             <Button onClick={()=>route.replace('/Dashboard')}>Go Home to see your progress</Button>
//         </div>
//     );
// }

// export default Feedback;