import { NextResponse } from "next/server";
import z from "zod";
import { buildLogout, getUserObject, parseParams } from "@utils/api/apiutil";
import prisma from "@utils/prisma";
import { withSessionRouteNew } from "@utils/session/session";

export const GET = withSessionRouteNew(async (req) => {
  const story = await prisma.story.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!story) {
    return NextResponse.json({
      success: false,
      error: "No story found",
    });
  }

  const lines = await prisma.storyLine.findMany({
    where: {
      storyNumber: story.storyNumber,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({
    stories: lines,
    success: true,
    story: story,
  });
});
