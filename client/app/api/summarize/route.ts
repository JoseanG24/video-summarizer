import { NextResponse, NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const POST = async (request: NextRequest) => {
  try {
    const { transcription } = await request.json();

    if (!transcription) {   
      return NextResponse.json(
        { error: "No transcription provided" },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Summarize the following YouTube video transcript. Extract the most important ideas and key details. 
            
         
            - Ensure clarity and logical flow.
  
            
            Here is the transcript: ${transcription}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
      top_p: 1,
      frequency_penalty: 0.3,
      presence_penalty: 0,
    });

    const summary = response.choices[0].message.content;
    console.log(summary)

    return NextResponse.json({ summary });
  } catch (error) {
    return NextResponse.json({
      message: "There was an error summarizing",
      error: error,
    });
  }
};
