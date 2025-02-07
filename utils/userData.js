// utils/userData.js
import { UserAnswer } from "@/utils/schema";
import { db } from "@/utils/db";
import { eq } from "drizzle-orm";

export const getUserInterviewData = async (userEmail) => {
    return await db.select({
        id: UserAnswer.id,
        question: UserAnswer.question,
        rating: UserAnswer.rating,
        createdAt: UserAnswer.createdAt,
        feedback: UserAnswer.feedback
    })
    .from(UserAnswer)
    .where(eq(UserAnswer.userEmail, userEmail))
    .orderBy(UserAnswer.createdAt);
};