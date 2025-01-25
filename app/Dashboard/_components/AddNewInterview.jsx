"use client"
import { Textarea } from "@/components/ui/textarea"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button"; 
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { chatSession } from "@/utils/GeminiAIModel";
import { LoaderCircle } from "lucide-react";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { useUser } from "@clerk/nextjs";
import {db} from "@/utils/db";
import { useRouter } from "next/router";



function AddNewInterview() {
    const [openDialog,setOpenDialog]=useState(false)
    const [jobPosition,setjobPosition]=useState();
    const [jobDesc,setjobDesc]=useState();
    const [jobExperience,setjobExperience]=useState();
    const [loading,setloading]=useState(false);
    const [jsonResponse,setJsonResponse]=useState([]);
    const {user}=useUser();
    const router=useRouter();

    const onSubmit=async(e)=>{
        setloading(true);
        e.preventDefault();
        console.log(jobPosition,jobDesc,jobExperience) ;

        const InputPrompt="Job position: "+jobPosition+"Job Description:"+jobDesc+ "Years of Experience:"+jobExperience+ "Depends on Job Position,Job Description & Years of Experience give us"+process.env.NEXT_PUBLIC_INTERVIEW_QUESTIONS_COUNT+"  Interview Question along with the answer in JSON format, Give us question and answers feild on JSON";
        const result=await chatSession.sendMessage(InputPrompt);
        const MockJsonResponse=result.response.text().replace('```json','').replace('```','')
        console.log(JSON.parse(MockJsonResponse));
        setJsonResponse(MockJsonResponse);

        if(MockJsonResponse){
            const resp=await db.insert(MockInterview).values({
                mockId:uuidv4(),
                jsonMockResp:MockJsonResponse,
                jobPosition:jobPosition,
                jobDesc:jobDesc,
                jobExperience:jobExperience,
                createdBy:user?.primaryEmailAddress?.emailAddress,
                createdAt:moment().format('YYYY-MM-DD HH:mm:ss')        
            }).returning({mockId:MockInterview.mockId});
            console.log("Inserted ID:",resp);
            if(resp){
                setOpenDialog(false);
                router.push(`/Dashboard/interview/`+resp[0]?.mockId);
            }
        }
        else{
            console.log("Error in response")            
        }


        setloading(false);
    }
    return (
        <div>
            <div className='w-1/3 p-12 border rounded-lg bg-blue-300
        hover:scale-105 hover:shadow-md hover:shadow-red-400 cursor-pointer
        transition-transform transition-shadow duration-300 ease-in-out'
        onClick={()=>setOpenDialog(true)}>
                <h2 className='font-bold text-lg text-center'>+ Add New</h2>
            </div>
            
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>Tell us more about your job Interview</DialogTitle>
                        <DialogDescription>
                            <form onSubmit={onSubmit}>
                            <div>
                                <h2>Add Deatils about your job position/role, Job description and years of experience</h2>
                            </div>
                            <div className='mt-7 my-3'>
                                <label>Job Role/Job Position</label>
                                <Input placeholder="Ex. Full Stack Developer" required
                                onChange={(event)=>setjobPosition(event.target.value)}/>
                            </div>
                            <div className='mt-3 my-3'>
                                <h2>Job Description / Tech Stack(In Short)</h2>
                                <Textarea placeholder="Ex. React, Angular, NodeJs, MySql etc" required
                                onChange={(event)=>setjobDesc(event.target.value)}/>
                            </div>
                            <div className='my-3'>
                                <label>Years of experience</label>
                                <Input placeholder="Ex.5" type="number" required max="40"
                                onChange={(event)=>setjobExperience(event.target.value)}/>
                            </div>
                            <div className='flex gap-5 justify-end'>
                                <Button type="button" variant="ghost" onClick={()=>setOpenDialog(false)}>Cancel</Button>
                                <Button type="Submit" disabled={loading}>
                                    {loading?
                                    <>
                                    <LoaderCircle className='animate-spin'/>Please wait! Generating from AI
                                    </>:'Start Interview'
                                    }
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