"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
import { MockInterview } from "@/utils/schema";
import QuestionsSections from "./_components/QuestionsSections";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function StartInterview({ params }) {
  // No need for `use` from React, params are already passed in
  const { interviewId } = params;

  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (interviewId) {
      GetInterviewDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewId]);

  const GetInterviewDetails = async () => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, interviewId));

      if (!result || result.length === 0) {
        console.warn("No data found for the given interview ID:", interviewId);
        return;
      }

      const row = result[0];

      let jsonMockResp;
      try {
        jsonMockResp =
          typeof row.jsonMockResp === "string"
            ? JSON.parse(row.jsonMockResp) // your DB string like: { "questions": [ ... ] }
            : row.jsonMockResp;
      } catch (error) {
        console.error("Error parsing JSON response:", error);
        return;
      }

      // 🔴 BUG WAS HERE:
      // You used `jsonMockResp?.interview_questions`
      // but in your DB JSON the key is `questions`
      //
      // DB example you showed:
      // {
      //   "questions": [
      //     { "question": "Describe your experience using Figma...", "answer": "..." },
      //     ...
      //   ]
      // }
      const questions = Array.isArray(jsonMockResp)
        ? jsonMockResp
        : jsonMockResp?.questions || jsonMockResp?.interview_questions || [];

      if (Array.isArray(questions) && questions.length > 0) {
        setMockInterviewQuestion(questions);
        setActiveQuestionIndex(0); // reset to first question
      } else {
        console.warn("Invalid or empty questions array:", questions);
      }

      setInterviewData(row);
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };

  const feedbackClick = () => {
    if (!interviewData?.mockId) return;
    router.push(`/Dashboard/interview/${interviewData.mockId}/feedback`);
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

      <div className="flex justify-between gap-6 my-5">
        {activeQuestionIndex !== mockInterviewQuestion.length - 1 && (
          <Button
            onClick={() =>
              setActiveQuestionIndex((prev) =>
                Math.min(prev + 1, mockInterviewQuestion.length - 1)
              )
            }
          >
            Next Question
          </Button>
        )}

        {activeQuestionIndex > 0 && (
          <Button
            onClick={() =>
              setActiveQuestionIndex((prev) => Math.max(prev - 1, 0))
            }
          >
            Previous Question
          </Button>
        )}

        {mockInterviewQuestion.length > 0 &&
          activeQuestionIndex === mockInterviewQuestion.length - 1 && (
            <Button onClick={feedbackClick}>End Question</Button>
          )}
      </div>
    </div>
  );
}

export default StartInterview;


// "use client";

// "use client";

// import React, { useEffect, useState } from "react";
// import { db } from "@/utils/db";
// import { eq } from "drizzle-orm";
// import { MockInterview } from "@/utils/schema";
// import QuestionsSections from "./_components/QuestionsSections";
// import RecordAnswerSection from "./_components/RecordAnswerSection";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
// import { use } from "react";

// function StartInterview({ params }) {
//   const interviewId = use(params).interviewId; // Extracting interview ID
//   const [interviewData, setInterviewData] = useState(null);
//   const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
//   const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
//   const router = useRouter();

//   useEffect(() => {
//     if (interviewId) {
//       GetInterviewDetails();
//     }
//   }, [interviewId]);

//   const GetInterviewDetails = async () => {
//     try {
//       const result = await db
//         .select()
//         .from(MockInterview)
//         .where(eq(MockInterview.mockId, interviewId));

//       // console.log("Database result:", result); // Debugging log

//       if (result && result.length > 0) {
//         let jsonMockResp;

//         try {
//           jsonMockResp =
//             typeof result[0].jsonMockResp === "string"
//               ? JSON.parse(result[0].jsonMockResp) // Parse if it's a string
//               : result[0].jsonMockResp;
//         } catch (error) {
//           // console.error("❌ Error parsing JSON response:", error);
//           return;
//         }

//         // console.log("✅ Parsed interview details:", jsonMockResp);

//         // ✅ Handle case where jsonMockResp is already an array
//         const questions = Array.isArray(jsonMockResp)
//           ? jsonMockResp
//           : jsonMockResp?.interview_questions;

//         if (Array.isArray(questions) && questions.length > 0) {
//           setMockInterviewQuestion(questions);
//         } else {
//           // console.error("⚠️ Invalid interview_questions format:", questions);
//         }

//         setInterviewData(result[0]);
//       } else {
//         // console.error("⚠️ No data found for the given interview ID.");
//       }
//     } catch (error) {
//       // console.error("❌ Error fetching interview details:", error);
//     }
//   };

//   const feedbackClick = () => {
//     router.push(`/Dashboard/interview/${interviewData?.mockId}/feedback`);
//   };

//   return (
//     <div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start ">
//         {/* Questions Section */}
//         <QuestionsSections
//           mockInterviewQuestion={mockInterviewQuestion}
//           activeQuestionIndex={activeQuestionIndex}
//         />

//         {/* Video/Audio Recording Section */}
//         <RecordAnswerSection
//           mockInterviewQuestion={mockInterviewQuestion}
//           activeQuestionIndex={activeQuestionIndex}
//           interviewData={interviewData}
//         />
//       </div>
//       <div className="flex justify-between gap-6 my-5">
//         {activeQuestionIndex !== mockInterviewQuestion?.length - 1 && (
//           <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>
//             Next Question
//           </Button>
//         )}
//         {activeQuestionIndex > 0 && (
//           <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>
//             Previous Question
//           </Button>
//         )}
//         {activeQuestionIndex === mockInterviewQuestion?.length - 1 && (
//           <Button onClick={feedbackClick}>End Question</Button>
//         )}
//       </div>
//     </div>
//   );
// }

// export default StartInterview;














