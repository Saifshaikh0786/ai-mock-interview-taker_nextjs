"use client";
import { useUser } from '@clerk/nextjs'
import { desc } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm'
import InterviewItemCard from './InterviewItemCard';

function InterviewList() {
    const { user } = useUser();
    const [InterviewList, setInterviewList] = useState([]);

    useEffect(() => {
        user && GetInterviewList()
    }, [user]);

    const GetInterviewList = async () => {
        const result = await db.select()
            .from(MockInterview)
            .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
            .orderBy(desc(MockInterview.createdAt));

        setInterviewList(result);
    };

    return (
        <div className="bg-slate-800/20 rounded-xl p-6 border border-slate-700/30 backdrop-blur-xl mt-8">
            <div className="space-y-2 mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent">
                    Previous Mock Interviews
                </h2>
                <p className="text-slate-400 text-sm">
                    {InterviewList.length} recorded sessions
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {InterviewList && InterviewList.map((interview, index) => (
                    <InterviewItemCard 
                        key={index}
                        interview={interview}
                    />
                ))}
            </div>

            {InterviewList.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                    No interviews recorded yet
                </div>
            )}
        </div>
    );
}

export default InterviewList;