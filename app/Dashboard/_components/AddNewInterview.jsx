



"use client";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { chatSession } from "@/utils/GeminiAIModel";
import { LoaderCircle } from "lucide-react";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/db";
import { useRouter } from "next/navigation";

function AddNewInterview() {
    const [openDialog, setOpenDialog] = useState(false);
    const [jobPosition, setJobPosition] = useState('');
    const [jobDesc, setJobDesc] = useState('');
    const [jobExperience, setJobExperience] = useState('');
    const [loading, setLoading] = useState(false);
    const [jsonResponse, setJsonResponse] = useState([]);
    const { user } = useUser();
    const router = useRouter();

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const InputPrompt = `Job position: ${jobPosition} Job Description: ${jobDesc} Years of Experience: ${jobExperience} Depends on Job Position,Job Description & Years of Experience give us ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTIONS_COUNT} Interview Question along with the answer in JSON format, Give us question and answers feild in JSON format only and nothing else extra text added out of JSON format.`;
            
            const result = await chatSession.sendMessage(InputPrompt);


            const MockJsonResponse =await result.response.text().replace('```json','').replace('```','');
            // console.log("Raw Response:", MockJsonResponse);

            const parsedResponse = JSON.parse(MockJsonResponse);
            
            setJsonResponse(parsedResponse);

        

            const resp = await db.insert(MockInterview).values({
                mockId: uuidv4(),
                jsonMockResp: MockJsonResponse,
                jobPosition: jobPosition,
                jobDesc: jobDesc,
                jobExperience: jobExperience,
                createdBy: user?.primaryEmailAddress?.emailAddress,
                createdAt: moment().format('YYYY-MM-DD HH:mm:ss')        
            }).returning({ mockId: MockInterview.mockId });

            if (resp && resp[0]?.mockId) {
                setOpenDialog(false);
                router.push(`/Dashboard/interview/${resp[0].mockId}`);
            }
        } catch (error) {
            // console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                    <div className="w-full md:w-1/3 p-8 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] group">
                        <div className="flex flex-col items-center justify-center space-y-3">
                            <div className="h-16 w-16 bg-white/10 rounded-full flex items-center justify-center transition-all group-hover:bg-white/20">
                                <span className="text-3xl font-bold text-white">+</span>
                            </div>
                            <h2 className="font-semibold text-lg text-center text-white">
                                Create New Interview
                            </h2>
                        </div>
                    </div>
                </DialogTrigger>

                <DialogContent className="max-w-2xl rounded-2xl border-0 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent">
                            New Interview Setup
                        </DialogTitle>

                        <DialogDescription className="text-slate-300">
                            <form onSubmit={onSubmit} className="mt-4 space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-300">
                                            Job Role/Position
                                        </label>
                                        <Input
                                            className="bg-slate-800 border-slate-700 focus:ring-2 focus:ring-purple-500 rounded-lg"
                                            placeholder="Senior Full Stack Developer"
                                            required
                                            onChange={(e) => setJobPosition(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-300">
                                            Technologies you know and key responsibilities
                                        </label>
                                        <Textarea
                                            className="bg-slate-800 border-slate-700 focus:ring-2 focus:ring-purple-500 min-h-[120px] rounded-lg"
                                            placeholder="Technologies, frameworks, and key responsibilities"
                                            required
                                            onChange={(e) => setJobDesc(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-300">
                                            Experience in years
                                        </label>
                                        <Input
                                            className="bg-slate-800 border-slate-700 focus:ring-2 focus:ring-purple-500 rounded-lg"
                                            placeholder="Years of experience required"
                                            type="number"
                                            required
                                            min="0"
                                            max="40"
                                            onChange={(e) => setJobExperience(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 justify-end pt-4">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="text-slate-400 hover:text-slate-200"
                                        onClick={() => setOpenDialog(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg px-6 py-3 transition-all"
                                    >
                                        {loading ? (
                                            <div className="flex items-center gap-2">
                                                <LoaderCircle className="animate-spin h-5 w-5" />
                                                Generating Questions...
                                            </div>
                                        ) : (
                                            "Start Interview"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default AddNewInterview;