"use client";
import { useUser } from '@clerk/nextjs'
import { desc} from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import {eq} from 'drizzle-orm'
import { index } from 'drizzle-orm/mysql-core';
import InterviewItemCard from './InterviewItemCard';

function InterviewList() {

    const {user}=useUser();
    const [InterviewList,setInterviewList]=useState([])

    useEffect(()=>{
        user && GetInterviewList()
    },[user])

    const GetInterviewList=async()=>{
        const result=await db.select()
        .from(MockInterview)
        .where(eq(MockInterview.createdBy,user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(MockInterview.createdAt));

        console.log(result);
        setInterviewList(result);
    }

  return (
    <div>
        <h2 className='font-med text-xl'>Previous Mock Interview</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-4'>
            {InterviewList&&InterviewList.map((interview,index)=>(
                <InterviewItemCard key={index}
                interview={interview}
                >

                </InterviewItemCard>
               

            ))}
        </div>
 
    </div>

  )
}

export default InterviewList