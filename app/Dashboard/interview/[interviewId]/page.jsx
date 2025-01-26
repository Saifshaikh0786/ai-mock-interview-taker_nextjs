"use client"

import { MockInterview } from '@/utils/schema';
import React, { useEffect, useState } from 'react';
import { db } from '@/utils/db';
import { eq } from 'drizzle-orm';
import { Lightbulb, WebcamIcon } from 'lucide-react';
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
        <div className='my-10'>
            <h2 className='font-bold text-2xl'>Let's Get Started</h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                {/* Job description section */}
                <div className='flex flex-col my-8 gap-5'>
                    <div className='flex flex-col p-5 rounded-lg border gap-4'>
                        <h2 className='text-lg'><strong>Job Role/Job Position: </strong>{interviewData?.jobPosition}</h2>
                        <h2 className='text-lg'><strong>Job Description/Tech Stack: </strong>{interviewData?.jobDesc}</h2>
                        <h2 className='text-lg'><strong>Years of Experience: </strong>{interviewData?.jobExperience}</h2>
                    </div>

                    <div className='p-5 border rounded-lg border-yellow-400 bg-yellow-100'>
                        <h2 className='flex gap-2 items-center text-red-600'><Lightbulb /><strong>Information</strong></h2>
                        <h2 className='mt-3'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
                    </div>
                </div>

                {/* Camera section */}
                <div className='justify-center flex flex-col items-center'>
                    
                    {webcamEnabled ? (
                        <div
                        className="relative w-full h-[400px] rounded-lg overflow-hidden"
                        style={{
                          border: "3px solid black", // Optional: Add a border around the webcam
                          maxWidth: "500px", // Optional: Limit the container width
                        }}>

                            <DynamicWebcam
                                onUserMedia={() => setWebcamEnabled(true)}
                                onUserMediaError={() => setWebcamEnabled(false)}
                                mirrored={true}
                                style={{
                                    height: "100%",
                                    width: "100%",
                                    objectFit:"cover"
                                }}
                                />
                        </div>
                    ) : (
                        <>
                            <WebcamIcon className='h-72 w-full p-20 my-7 bg-secondary rounded-lg border' />
                            <Button 
                                className='transition-all ease-out hover:shadow-lg hover:shadow-red-500' 
                                onClick={() => setWebcamEnabled(true)}
                            >
                                Enable Web Cam and Microphone
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <div className='flex justify-end items-end mt-4'>
                <Button 
                    className='transition-all ease-out hover:shadow-lg hover:shadow-blue-500'
                    onClick={handleStartInterview}
                >
                    Start Interview
                </Button>
            </div>
        </div>
    );
}

export default Interview;