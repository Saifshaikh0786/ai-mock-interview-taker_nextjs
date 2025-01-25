"use client";

import React, { useEffect, useState } from "react";
import { use } from "react";
import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
import { MockInterview } from "@/utils/schema";
import QuestionsSections from "./_components/QuestionsSections";
import RecordAnswerSection from "./_components/RecordAnswerSection";

function StartInterview({ params }) {
  const { interviewId } = use(params); // Extract `interviewId` from params
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const [activeQuestionIndex, setQuestionIndex] = useState(0);

  useEffect(() => {
    if (interviewId) {
      GetInterviewDetails();
    }
  }, [interviewId]);

  const GetInterviewDetails = async () => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, interviewId));

      if (result && result.length > 0) {
        const jsonMockResp = JSON.parse(result[0].jsonMockResp);

        if (
          jsonMockResp.interview_questions &&
          Array.isArray(jsonMockResp.interview_questions)
        ) {
          setMockInterviewQuestion(jsonMockResp.interview_questions);
        } else {
          console.error("interview_questions is not an array:", jsonMockResp);
        }

        setInterviewData(result[0]);
      } else {
        console.error("No data found for the given interview ID.");
      }
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };



  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Questions Section */}
        <QuestionsSections
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
        />

        {/* Video/Audio Recording Section */}
        <RecordAnswerSection 
        mockInterviewQuestion={mockInterviewQuestion}
        activeQuestionIndex={activeQuestionIndex}
        interviewData={interviewData}
        
        />
      </div>
    </div>
  );
}

export default StartInterview;
