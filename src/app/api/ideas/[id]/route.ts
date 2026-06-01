import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createTimelineEvent } from "@/lib/timeline";
import { stringifyTags } from "@/lib/utils";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idea = await prisma.idea.findUnique({
    where: { id },
    include: {
      projects: { include: { project: true } },
      people: { include: { person: true } },
      conversations: { include: { conversation: true } },
      assets: { include: { asset: true } },
      knowledge: { include: { knowledge: true } },
    },
  });
  if (!idea) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(idea);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const idea = await prisma.idea.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.problemSolved !== undefined && { problemSolved: body.problemSolved }),
      ...(body.opportunity !== undefined && { opportunity: body.opportunity }),
      ...(body.notes !== undefined && { notes: body.notes }),
      ...(body.status !== undefined && { status: body.status }),
      ...(body.tags !== undefined && { tags: stringifyTags(body.tags) }),
    },
  });
  await createTimelineEvent("IDEA", idea.id, idea.title, "updated", `Updated idea "${idea.title}"`);
  return NextResponse.json(idea);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.idea.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
