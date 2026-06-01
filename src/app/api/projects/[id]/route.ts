import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createTimelineEvent } from "@/lib/timeline";
import { stringifyTags } from "@/lib/utils";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      ideas: { include: { idea: true } },
      people: { include: { person: true } },
      conversations: { include: { conversation: true } },
      assets: { include: { asset: true } },
      knowledge: { include: { knowledge: true } },
    },
  });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { title, description, status, startDate, notes, tags } = body;

  const project = await prisma.project.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(status !== undefined && { status }),
      ...(startDate !== undefined && { startDate: startDate ? new Date(startDate) : null }),
      ...(notes !== undefined && { notes }),
      ...(tags !== undefined && { tags: stringifyTags(tags) }),
    },
  });

  await createTimelineEvent("PROJECT", project.id, project.title, "updated", `Updated project "${project.title}"`);

  return NextResponse.json(project);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.project.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
