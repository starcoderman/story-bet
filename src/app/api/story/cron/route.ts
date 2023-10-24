import { NextResponse } from "next/server";
import z from "zod";
import { buildLogout, getUserObject, parseParams } from "@utils/api/apiutil";
import prisma from "@utils/prisma";
import { withSessionRouteNew } from "@utils/session/session";
import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.STROMA_AZURE_KEY,
  baseURL: process.env.AZURE_BASE_URL,
  defaultHeaders: { "api-key": process.env.STROMA_AZURE_KEY },
  defaultQuery: { "api-version": "2023-07-01-preview" },
});

export const GET = withSessionRouteNew(async (req) => {
  // find the last story line that happened by created date

  const lastStory = await prisma.storyLine.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });

  if (lastStory) {
    // check if 15 mins have passed since last story line

    const now = new Date();

    const lastStoryDate = new Date(lastStory.createdAt);

    const diff = now.getTime() - lastStoryDate.getTime();

    const minutes = Math.floor(diff / 1000 / 60);

    if (minutes < 0.5) {
      return NextResponse.json({
        success: true,
      });
    }
  }
  const story = await prisma.story.findFirst({
    where: {
      storyNumber: lastStory ? lastStory.storyNumber : 0,
    },
  });
  const previousStoryLines = await prisma.storyLine.findMany({
    where: {
      storyNumber: lastStory ? lastStory.storyNumber : 0,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // if 15 mins have passed, create a new story line

  const prompt = `

  The story has a title of 
    Story title : ${story?.title}
    and a question of
    Story question : ${story?.storyQuestion}
    

    make sure the story corresponds and EVENTUALLY (not now), the story will answer the question, but only answer the question when asked by the user to directly answer it.
  always say the current status of the story, e.g. if its a game, say the score after every 2 lines. 

    ${previousStoryLines.map((line) => line.text).join("\n")}

    Continue this story, and make it interesting and funny. Only respond with the next 2 lines of the story that you think will make it interesting and funny.
  `;

  function removeLeadingWhitespaces(str: string): string {
    return str.replace(/^\s+/gm, "");
  }

  const response = await openai.chat.completions.create({
    messages: [
      {
        content: removeLeadingWhitespaces(prompt),
        role: "user",
      },
    ] as { content: string; role: "system" | "user" | "assistant" }[],

    model: "gpt-4",
  });

  const newtext = response.choices[0].message.content;

  const newStory = await prisma.storyLine.create({
    data: {
      storyNumber: lastStory ? lastStory.storyNumber : 0,
      storyLine: lastStory ? lastStory.storyLine + 1 : 0,
      text: newtext!,
    },
  });

  // update the config

  return NextResponse.json({
    success: true,
  });
});
