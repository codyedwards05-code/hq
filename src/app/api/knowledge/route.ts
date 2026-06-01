import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createTimelineEvent } from "@/lib/timeline";
import { stringifyTags } from "@/lib/utils";

export async function GET() {
  const knowledge = await prisma.knowledge.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json(knowledge);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, content, category, tags } = body;

  const k = await prisma.knowledge.create({
    data: {
      title,
      content,
      category: category || "OTHER",
      tags: stringifyTags(tags || []),
    },
  });

  await createTimelineEvent("KNOWLEDGE", k.id, k.title, "created", `Added knowledge note "${k.title}"`);
  return NextResponse.json(k, { status: 201 });
}
