"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic, StopCircle } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";
import { chatSession } from "@/utils/GeminiAIModel";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { db } from "@/utils/db";

function RecordAnswerSection({mockInterviewQuestion,activeQuestionIndex,interviewData}) {

  const [userAnswer,setUserAnswer]=useState('');
  const {user}=useUser();

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
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
      stopSpeechToText()
      
      if(userAnswer?.length==0){
        // Existing error handling
      }

      const feedbackPrompt="Question"+mockInterviewQuestion[activeQuestionIndex]?.question+
      ", User Answer:"+userAnswer+"Depends on question and user answer for interview question"+
      "please give us rating and feedback as area of improvement if any"+
      "and also tell strenghts and good things"+
      "in just 3 to 5 lines to improve it in JSON format with rating feild and feedback feild";

      const result=await chatSession.sendMessage(feedbackPrompt);
      const mockJsonResp=(result.response.text()).replace('```json','').replace('```','');
      const JsonFeedbackResp=JSON.parse(mockJsonResp);

      const resp=await db.insert(UserAnswer)
      .values({
        mockIdRef:interviewData?.mockId,
        question:mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAns:mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAns:userAnswer,
        feedback:JsonFeedbackResp?.feedback,
        rating:JsonFeedbackResp?.rating,
        userEmail:user?.primaryEmailAddress?.emailAddress,
        createdAt:moment().format('DD-MM-yyyy')
      })

      if(resp){
        toast({
          title: "Your answer recorded successfully",
          description: "Now You can move to the next question or reattempt this one if needed.",
          variant: "destructive", 
        });
        setUserAnswer('');
        setResults(['']);
      }
      setResults(['']);
    }
    else{
      startSpeechToText();
    }
  }

  return (
    <div className="flex items-center justify-center flex-col">
      {/* Enhanced Webcam Section */}
      <div className="flex flex-col items-center p-5 my-10 w-full">
        <div className="relative w-full h-[400px] rounded-xl overflow-hidden border-1 border-transparent bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-2xl">
          <div className="relative w-full h-full rounded-lg overflow-hidden bg-slate-900">
            <Webcam
              audio={false}
              mirrored={true}
              className="w-full h-full object-cover"
            />
            {isRecording && (
              <div className="absolute inset-0 flex items-end justify-center">
                <div className="animate-pulse text-2xl font-bold text-red-500">
                  ● RECORDING
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Premium Button Design */}
      <Button
        variant="ghost"
        onClick={SavedUserAnswer}
        className={`group relative overflow-hidden transition-all duration-300 ${
          isRecording 
            ? 'bg-red-500/20 hover:bg-red-500/30 border border-red-500/50'
            : 'bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50'
        } rounded-xl px-8 py-6 shadow-lg backdrop-blur-lg`}
      >
        <div className="flex items-center gap-3">
          {isRecording ? (
            <>
              <StopCircle className="h-6 w-6 text-red-400 animate-pulse" />
              <span className="bg-gradient-to-r from-red-400 to-orange-300 bg-clip-text text-transparent font-semibold text-lg">
                Stop Recording
              </span>
            </>
          ) : (
            <>
              <Mic className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent font-semibold text-lg">
                Start Recording
              </span>
            </>
          )}
        </div>
        
        {/* Animated background effect */}
        <div className={`absolute inset-0 -z-10 bg-gradient-to-b ${
          isRecording 
            ? 'from-red-500/10 to-transparent'
            : 'from-blue-500/10 to-transparent'
        } opacity-0 group-hover:opacity-100 transition-opacity`} />
      </Button>
    </div>
  );
}

export default RecordAnswerSection;