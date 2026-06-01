import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createTimelineEvent } from "@/lib/timeline";
import { stringifyTags } from "@/lib/utils";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const k = await prisma.knowledge.findUnique({
    where: { id },
    include: {
      projects: { include: { project: true } },
      ideas: { include: { idea: true } },
      conversations: { include: { conversation: true } },
    },
  });
  if (!k) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(k);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const k = await prisma.knowledge.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.content !== undefined && { content: body.content }),
      ...(body.category !== undefined && { category: body.category }),
      ...(body.tags !== undefined && { tags: stringifyTags(body.tags) }),
    },
  });
  await createTimelineEvent("KNOWLEDGE", k.id, k.title, "updated", `Updated knowledge "${k.title}"`);
  return NextResponse.json(k);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.knowledge.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
