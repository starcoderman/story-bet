import { IronSession } from "iron-session";
import { NextRequest, NextResponse } from "next/server";
import { ZodSchema } from "zod";
import prisma from "@utils/prisma";

export async function parseBody<T>(
  req: NextRequest & { session: IronSession },
  schema: ZodSchema<T>
): Promise<{ error: string | null; body: T | null }> {
  const body = await req.json();
  //console.log("REQUEST:", req.url, body);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return { error: parsed.error.message, body: null };
  }
  return { error: null, body: parsed.data };
}

export async function parseParams<T>(
  req: NextRequest & { session: IronSession },
  schema: ZodSchema<T>
): Promise<{ error: string | null; params: T | null }> {
  const params = req.nextUrl.searchParams.keys();

  const allparams = Array.from(params).reduce((acc, key) => {
    acc[key] = req.nextUrl.searchParams.get(key);
    return acc;
  }, {} as { [key: string]: string | null });

  const parsed = schema.safeParse(allparams);

  if (!parsed.success) {
    return { error: parsed.error.message, params: null };
  }

  return { error: null, params: parsed.data };
}

export async function getUser(req: Request & { session: IronSession }) {
  const session = req.session;
  if (!session.user || !session.user.id) {
    return null;
  }

  return session.user;
}

export async function getUserObject(req: Request & { session: IronSession }) {
  const session = req.session;
  if (!session.user || !session.user.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    return null;
  }

  return user;
}

export async function buildLogout(req: Request & { session: IronSession }) {
  await req.session.destroy();
  await req.session.save();

  const destinationUrl = new URL("/", new URL(req.url).origin);
  const response = NextResponse.redirect(destinationUrl, { status: 302 });

  return response;
}
