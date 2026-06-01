import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createTimelineEvent } from "@/lib/timeline";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      projects: { include: { project: true } },
      ideas: { include: { idea: true } },
      people: { include: { person: true } },
      assets: { include: { asset: true } },
      knowledge: { include: { knowledge: true } },
    },
  });
  if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(conversation);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const conversation = await prisma.conversation.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.source !== undefined && { source: body.source }),
      ...(body.date !== undefined && { date: body.date ? new Date(body.date) : null }),
      ...(body.url !== undefined && { url: body.url }),
      ...(body.transcript !== undefined && { transcript: body.transcript }),
      ...(body.notes !== undefined && { notes: body.notes }),
      ...(body.summary !== undefined && { summary: body.summary }),
    },
  });
  await createTimelineEvent("CONVERSATION", conversation.id, conversation.title, "updated", `Updated conversation "${conversation.title}"`);
  return NextResponse.json(conversation);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.conversation.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
