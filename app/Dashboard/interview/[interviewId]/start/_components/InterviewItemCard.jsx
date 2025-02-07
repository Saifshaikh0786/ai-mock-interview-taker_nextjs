"use client";  // Ensures it's a Client Component

import { Button } from "@/components/ui/button";
import React from "react";
import { useRouter } from "next/navigation";

function InterviewItemCard({ interview }) {
    const router = useRouter();

    // const onstart = () => {
    //     if (interview?.mockId) {
    //         router.push(`/Dashboard/interview/${interview.mockId}`);
    //     } else {
    //         console.error("Interview mockId is undefined!");
    //     }
    // };
    const onstart = () => {
        console.log("Button Clicked!"); // Check if this logs when clicking the button
        console.log("Mock ID:", interview?.mockId); // Check if mockId is present
    
        if (interview?.mockId) {
            router.push(`/Dashboard/interview/${interview.mockId}`);
        } else {
            console.error("Interview mockId is undefined!");
        }
    };
    

    console.log(interview?.mockId); // Debugging

    return (
        <div className="border shadow-sm rounded-lg p-3">
            <h2 className="font-bold text-white">{interview?.jobPosition}</h2>
            <h2 className="text-sm text-white">{interview?.jobExperience} Years of Experience</h2>
            <h2 className="text-white">Created At: {interview?.createdAt} </h2>
            <div className="flex justify-between mt-4 gap-5">
                <Button size="sm" variant="outline" className="w-full">
                    Feedback
                </Button>
                <Button size="sm" className="w-full" onClick={onstart}>
                    Start Again
                </Button>
            </div>
        </div>
    );
}

export default InterviewItemCard;
