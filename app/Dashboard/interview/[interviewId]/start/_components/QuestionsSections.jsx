
"use client";
import { Lightbulb, Volume2 } from "lucide-react";
import React, { useEffect, useState } from "react";

function QuestionsSections({ mockInterviewQuestion = [], activeQuestionIndex = 0 }) {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        console.log("Received questions:", mockInterviewQuestion); // Debugging log

        // Ensure `mockInterviewQuestion` is an array
        setQuestions(
            Array.isArray(mockInterviewQuestion) 
                ? mockInterviewQuestion 
                : Object.values(mockInterviewQuestion) // Convert object to array
        );
    }, [mockInterviewQuestion]);

    const textToSpeech = (text) => {
        if (!text) return;
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = "en-US";
        window.speechSynthesis.speak(speech);
    };

    const currentQuestion = questions.length > 0 ? questions[activeQuestionIndex]?.question : "";

    return (
        <div className="p-8 my-10 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700/60 shadow-2xl backdrop-blur-xl">
            {/* Question Navigation */}
            <div className="mb-10">
                <h3 className="text-slate-400 text-sm font-medium mb-4">Question Progress</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {questions.length > 0 ? (
                        questions.map((_, index) => (
                            <div
                                key={index}
                                className={`group p-2.5 rounded-xl transition-all duration-300 cursor-pointer
                                    ${activeQuestionIndex === index 
                                        ? 'bg-gradient-to-r from-emerald-400/40 to-cyan-400/40 border-2 border-emerald-400/60 shadow-lg shadow-emerald-400/10'
                                        : 'bg-slate-700/30 hover:bg-slate-700/50 border-2 border-slate-700/60 hover:border-slate-600/60'}`}
                            >
                                <div className="flex items-center justify-center space-x-2">
                                    <span className={`text-sm font-semibold ${
                                        activeQuestionIndex === index 
                                            ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400'
                                            : 'text-slate-400 group-hover:text-slate-200'
                                    }`}>
                                        Q{index + 1}
                                    </span>
                                    {activeQuestionIndex === index && (
                                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 col-span-full text-center">Loading questions...</p>
                    )}
                </div>
            </div>

            {/* Current Question Section */}
            <div className="mb-8 p-6 bg-slate-700/20 rounded-xl border-2 border-slate-700/60 backdrop-blur-sm">
                <div className="flex justify-between items-start gap-4">
                    <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-400 leading-relaxed">
                        {currentQuestion || "No question available"}
                    </h2>
                    <button 
                        onClick={() => textToSpeech(currentQuestion)}
                        className="p-2 hover:bg-slate-700/30 rounded-full transition-colors duration-200"
                        disabled={!currentQuestion}
                    >
                        <Volume2 className="h-6 w-6 text-slate-400 hover:text-cyan-400 transition-colors" />
                    </button>
                </div>
            </div>

            {/* Enhanced Note Section */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-amber-500/15 to-amber-600/10 border-2 border-amber-500/30">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-amber-500/20 rounded-full">
                        <Lightbulb className="h-5 w-5 text-amber-400 animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-amber-300 mb-2">Expert Tip</h3>
                        <p className="text-sm text-amber-200/90 leading-relaxed">
                            {process.env.NEXT_PUBLIC_QUESTION_NOTE || "Stay confident and keep practicing!"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QuestionsSections;









// "use client";
// import { Lightbulb, Volume2 } from "lucide-react";
// import React from "react";

// function QuestionsSections({ mockInterviewQuestion, activeQuestionIndex }) {
//     const textToSpeach = (text) => {
//         // Existing functionality remains unchanged
//     };

//     return (
//         <div className="p-8 my-10 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700/60 shadow-2xl backdrop-blur-xl">
//             {/* Question Navigation */}
//             <div className="mb-10">
//                 <h3 className="text-slate-400 text-sm font-medium mb-4">Question Progress</h3>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                     {mockInterviewQuestion.map((item, index) => (
//                         <div
//                             key={index}
//                             className={`group p-2.5 rounded-xl transition-all duration-300 cursor-pointer
//                                 ${activeQuestionIndex === index 
//                                     ? 'bg-gradient-to-r from-emerald-400/40 to-cyan-400/40 border-2 border-emerald-400/60 shadow-lg shadow-emerald-400/10'
//                                     : 'bg-slate-700/30 hover:bg-slate-700/50 border-2 border-slate-700/60 hover:border-slate-600/60'}`}
//                         >
//                             <div className="flex items-center justify-center space-x-2">
//                                 <span className={`text-sm font-semibold ${
//                                     activeQuestionIndex === index 
//                                         ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400'
//                                         : 'text-slate-400 group-hover:text-slate-200'
//                                 }`}>
//                                     Q{index + 1}
//                                 </span>
//                                 {activeQuestionIndex === index && (
//                                     <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
//                                 )}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* Current Question Section */}
//             <div className="mb-8 p-6 bg-slate-700/20 rounded-xl border-2 border-slate-700/60 backdrop-blur-sm">
//                 <div className="flex justify-between items-start gap-4">
//                     <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-400 leading-relaxed">
//                         {mockInterviewQuestion[activeQuestionIndex]?.question}
//                     </h2>
//                     <button 
//                         onClick={() => textToSpeach(mockInterviewQuestion[activeQuestionIndex]?.question)}
//                         className="p-2 hover:bg-slate-700/30 rounded-full transition-colors duration-200"
//                     >
//                         <Volume2 className="h-6 w-6 text-slate-400 hover:text-cyan-400 transition-colors" />
//                     </button>
//                 </div>
//             </div>

//             {/* Enhanced Note Section */}
//             <div className="p-6 rounded-xl bg-gradient-to-br from-amber-500/15 to-amber-600/10 border-2 border-amber-500/30">
//                 <div className="flex items-start gap-4">
//                     <div className="p-2 bg-amber-500/20 rounded-full">
//                         <Lightbulb className="h-5 w-5 text-amber-400 animate-pulse" />
//                     </div>
//                     <div>
//                         <h3 className="text-sm font-semibold text-amber-300 mb-2">Expert Tip</h3>
//                         <p className="text-sm text-amber-200/90 leading-relaxed">
//                             {process.env.NEXT_PUBLIC_QUESTION_NOTE}  
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default QuestionsSections;