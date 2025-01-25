"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic, StopCircle } from "lucide-react";
import { Toaster } from "@/components/ui/toaster" 
import { toast } from "@/hooks/use-toast";
import { chatSession } from "@/utils/GeminiAIModel";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { db } from "@/utils/db";

function RecordAnswerSection({mockInterviewQuestion,activeQuestionIndex,interviewData}) {

  const [userAnswer,setUserAnswer]=useState('');
  const {user}=useUser();
  // const {loading,setloading}=useState(true);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  if (error) {
    return <p>Error: {error.message}</p>;
  }

    useEffect(()=>{
      results.map((result)=>(
        setUserAnswer(prevAns=>prevAns+result?.transcript) 
      ))

    },[results]);


    const SavedUserAnswer=async()=>{
      if(isRecording){
        // setloading(true);
        stopSpeechToText()

          if(userAnswer?.length==0){
            // setloading(false);
            // toast({
            //   title: "Error",
            //   description: "Please record again or make sure your answer is at least 10 words long.",
            //   variant: "destructive", 
            // });
            // toast('error while saving your answer, Please record again or answer must be greater than 10 words')
          }

          const feedbackPrompt="Question"+mockInterviewQuestion[activeQuestionIndex]?.question+
          ", User Answer:"+userAnswer+"Depends on question and user answer for interview question"+
          "please give us rating and feedback as area of improvement if any"+
          "and also tell strenghts and good things"+
          "in just 3 to 5 lines to improve it in JSON format with rating feild and feedback feild";

          const result=await chatSession.sendMessage(feedbackPrompt);

          const mockJsonResp=(result.response.text()).replace('```json','').replace('```','');

          console.log(mockJsonResp);

          const JsonFeedbackResp=JSON.parse(mockJsonResp);

          const resp=await db.insert(UserAnswer)
          .values({
            mockIdRef:interviewData?.mockId,
            question:mockInterviewQuestion[activeQuestionIndex]?.question,
            correctAns:mockInterviewQuestion[activeQuestionIndex]?.question,
            userAns:userAnswer,
            feedback:JsonFeedbackResp?.feedback,
            rating:JsonFeedbackResp?.rating,
            userEmail:user?.primaryEmailAddress?.emailAddress,
            createdAt:moment().format('DD-MM-yyyy')
          })

          if(resp){
            toast({
              title: "User Answer recorded successfully",
              description: "Please record again or make sure your answer is at least 10 words long.",
              variant: "destructive", 
            });
            setUserAnswer('')
            // setloading(false);

          }

      }
      else{
        startSpeechToText();
      }
    }


  return (
    <div className="flex items-center justify-center flex-col">
      {/* Webcam Section */}
      <div className="flex flex-col items-center p-5 my-10">
        <div
          className="relative w-full h-[400px] rounded-lg overflow-hidden"
          style={{
            border: "3px solid black", // Optional: Add a border around the webcam
            maxWidth: "600px", // Optional: Limit the container width
          }}
        >
          <Webcam
            audio={false}
            mirrored={true}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      </div>

      {/* Buttons Section */}
      <Button
      // disabled={loading}
       variant="outline" className='text-red-500' 
       onClick={SavedUserAnswer}
       >
        {isRecording ? 
        <h2 className="flex items-center justify-center space-x-4 text-red-500 gap-2">
          <StopCircle/>Stop Recording....
        </h2>
        : 

        <h2 className="flex items-center gap-2 text-blue-600" ><Mic/>Record your Answer</h2>}
       
        
      </Button>

      <Button onClick={()=>console.log(userAnswer)} className='mt-6'>Show User Answer</Button>
    </div>
  );
}

export default RecordAnswerSection;
