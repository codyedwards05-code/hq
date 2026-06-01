import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createTimelineEvent } from "@/lib/timeline";

export async function GET() {
  const conversations = await prisma.conversation.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json(conversations);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, source, date, url, transcript, notes, summary } = body;

  const conversation = await prisma.conversation.create({
    data: {
      title,
      source: source || "OTHER",
      date: date ? new Date(date) : null,
      url,
      transcript,
      notes,
      summary,
    },
  });

  await createTimelineEvent("CONVERSATION", conversation.id, conversation.title, "created", `Saved conversation "${conversation.title}"`);
  return NextResponse.json(conversation, { status: 201 });
}
