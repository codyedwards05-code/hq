import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createTimelineEvent } from "@/lib/timeline";
import { stringifyTags } from "@/lib/utils";

export async function GET() {
  const ideas = await prisma.idea.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json(ideas);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, description, problemSolved, opportunity, notes, status, tags } = body;

  const idea = await prisma.idea.create({
    data: {
      title,
      description,
      problemSolved,
      opportunity,
      notes,
      status: status || "IDEA",
      tags: stringifyTags(tags || []),
    },
  });

  await createTimelineEvent("IDEA", idea.id, idea.title, "created", `Created idea "${idea.title}"`);
  return NextResponse.json(idea, { status: 201 });
}
