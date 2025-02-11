
"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import moment from "moment";

function InterviewItemCard({ interview }) {
    const router = useRouter();

    const handleStartInterview = () => {
        if (interview?.mockId) {
            router.push(`/Dashboard/interview/${interview.mockId}`);
        }
    };

    const handleFeedback = () => {
        if (interview?.mockId) {
            router.push(`/Dashboard/interview/${interview.mockId}/feedback`);
        }
    };

    return (
        <div className="border border-slate-700/50 bg-slate-800/30 backdrop-blur-xl rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="space-y-3">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent">
                    {interview?.jobPosition}
                </h2>
                
                <div className="flex items-center gap-3 text-slate-400">
                    <span className="bg-slate-700/30 px-3 py-1 rounded-full text-sm">
                        {interview?.jobExperience} Years Experience
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-sm text-slate-400">
                        {moment(interview?.createdAt).format('MMM D, YYYY')}
                    </span>
                </div>
            </div>

            <div className="flex gap-4 mt-6  sm:mt-6">
                <Button 
                    onClick={handleFeedback}
                    className="  border-slate-600 hover:bg-slate-700/20 hover:text-slate-200 text-slate-300"
                >
                    View Feedback
                </Button>
                <Button 
                    onClick={handleStartInterview}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white"
                >
                    Restart Session
                </Button>
            </div>
        </div>
    );
}

export default InterviewItemCard;