import { Lightbulb, Volume, Volume2 } from "lucide-react";
import React, { act } from "react";

function QuestionsSections({ mockInterviewQuestion,activeQuestionIndex}) {
    // Ensure mockInterviewQuestion is an array
    if (!Array.isArray(mockInterviewQuestion) || mockInterviewQuestion.length === 0) {
        return <div>No questions available.</div>;
    }

    const textToSpeach=(text)=>{
        if('speechSynthesis' in window){
            const speech=new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(speech);
        }
        else{
            alert('Sorry, Your browser does not support text to speech')
        }
    } 

    return (
        <div className="p-5 border rounded-lg my-10 ">
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
                {mockInterviewQuestion.map((item, index) => (
                    <h2
                        key={index} // Add a unique key for each question
                        className={`p-2 bg-secondary rounded-full
                        text-xs md:text-sm text-center cursor-pointer
                        ${activeQuestionIndex==index&&'bg-red-500 text-white'}`}>
                        Question #{index + 1}
                        {/* : {item.question} */}
                    </h2>
                ))}
            </div>

            <h2 className="my-5 text-md md:text-lg">{mockInterviewQuestion[activeQuestionIndex]?.question}</h2>

              <Volume2 className='cursor-pointer' onClick={()=>textToSpeach(mockInterviewQuestion[activeQuestionIndex]?.question)}/>


            <div className="border rounded-lg p-5 bg-red-100 mt-10">
                <h2 className= "flex gap-3 text-red-600 items-center">
                    <Lightbulb/>
                    <strong>Note:</strong>
                </h2>
                <h2 className="text-sm text-red-600 my-2">
                  {process.env.NEXT_PUBLIC_QUESTION_NOTE}  
                </h2>
            </div>
        </div>
        
    );
}

export default QuestionsSections;
