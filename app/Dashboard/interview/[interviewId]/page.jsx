"use client";
import { MockInterview } from '@/utils/schema';
import React, { useEffect, useState } from 'react';
import { db } from '@/utils/db';
import { eq } from 'drizzle-orm';
import { Lightbulb, WebcamIcon, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { use } from 'react';
import { useRouter } from 'next/navigation';

const DynamicWebcam = dynamic(() => import('react-webcam'), { ssr: false });

function Interview({ params }) {
    const { interviewId } = use(params);
    const router = useRouter();
    const [interviewData, setInterviewData] = useState();
    const [webcamEnabled, setWebcamEnabled] = useState(false);

    useEffect(() => {
        GetInterviewDetails();
    }, [interviewId]);

    const GetInterviewDetails = async () => {
        const result = await db.select().from(MockInterview)
            .where(eq(MockInterview.mockId, interviewId));
        setInterviewData(result[0]);
    };

    const handleStartInterview = () => {
        router.push(`/Dashboard/interview/${interviewId}/start`);
    };

    return (
        <div className='my-10 p-8 rounded-3xl bg-gradient-to-br from-slate-50 to-white shadow-2xl'>
            <h2 className='font-bold text-4xl text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                Let's Get Started
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                {/* Job description section - Logic remains same */}
                <div className='flex flex-col gap-6'>
                    <div className='p-6 rounded-xl bg-white border border-slate-200 shadow-lg'>
                        <div className='space-y-4'>
                            <h2 className='text-lg font-semibold text-slate-800'>
                                <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                                    Job Role/Position:
                                </span> 
                                <span className='ml-2 text-slate-700'>{interviewData?.jobPosition}</span>
                            </h2>
                            <h2 className='text-lg font-semibold text-slate-800'>
                                <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                                    Tech Stack:
                                </span> 
                                <span className='ml-2 text-slate-700'>{interviewData?.jobDesc}</span>
                            </h2>
                            <h2 className='text-lg font-semibold text-slate-800'>
                                <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                                    Experience:
                                </span> 
                                <span className='ml-2 text-slate-700'>{interviewData?.jobExperience} years</span>
                            </h2>
                        </div>
                    </div>

                    {/* Information section - Same logic */}
                    <div className='p-6 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 shadow-lg'>
                        <div className='flex items-start gap-3'>
                            <div className='p-2 bg-amber-500/20 rounded-full'>
                                <Lightbulb className='h-5 w-5 text-amber-600' />
                            </div>
                            <div>
                                <h2 className='text-lg font-semibold text-amber-800 mb-2'>Information</h2>
                                <p className='text-slate-700'>{process.env.NEXT_PUBLIC_INFORMATION}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Camera section - Same conditional logic */}
                <div className='flex flex-col items-center justify-center gap-6'>
                    {webcamEnabled ? (
                        <div className="relative w-full h-[400px] rounded-xl overflow-hidden border-4 border-white shadow-2xl">
                            <DynamicWebcam
                                onUserMedia={() => setWebcamEnabled(true)}
                                onUserMediaError={() => setWebcamEnabled(false)}
                                mirrored={true}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 px-3 py-1 rounded-full">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm text-slate-800">Camera Active</span>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-[400px] rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-6 p-8">
                            <WebcamIcon className="h-20 w-20 text-slate-400" />
                            <Button 
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-8 py-6 shadow-lg hover:shadow-blue-500/30 transition-all"
                                onClick={() => setWebcamEnabled(true)}
                            >
                                Enable Webcam & Microphone
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Start Interview Button - Same handler */}
            <div className='flex justify-end mt-8'>
                <Button 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-8 py-6 shadow-lg hover:shadow-blue-500/30 transition-all group"
                    onClick={handleStartInterview}
                >
                    <span className="flex items-center gap-2">
                        Start Interview
                        <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </span>
                </Button>
            </div>
        </div>
    );
}

export default Interview;