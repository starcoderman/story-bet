import { NextResponse } from "next/server";
import z from "zod";
import { buildLogout, getUserObject, parseBody } from "@utils/api/apiutil";
import { withSessionRouteNew } from "@utils/session/session";

const schema = z.object({
  variable: z.string(),
});

export const POST = withSessionRouteNew(async (req) => {
  const { body, error } = await parseBody(req, schema);

  if (!body) {
    return NextResponse.json({ error: error }, { status: 400 });
  }

  const user = await getUserObject(req);

  if (!user) {
    return buildLogout(req);
  }

  return NextResponse.json({
    success: true,
  });
});
