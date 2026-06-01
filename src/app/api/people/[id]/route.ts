import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createTimelineEvent } from "@/lib/timeline";
import { stringifyTags } from "@/lib/utils";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const person = await prisma.person.findUnique({
    where: { id },
    include: {
      projects: { include: { project: true } },
      ideas: { include: { idea: true } },
      conversations: { include: { conversation: true } },
    },
  });
  if (!person) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(person);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const person = await prisma.person.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.company !== undefined && { company: body.company }),
      ...(body.jobTitle !== undefined && { jobTitle: body.jobTitle }),
      ...(body.email !== undefined && { email: body.email }),
      ...(body.phone !== undefined && { phone: body.phone }),
      ...(body.website !== undefined && { website: body.website }),
      ...(body.linkedin !== undefined && { linkedin: body.linkedin }),
      ...(body.notes !== undefined && { notes: body.notes }),
      ...(body.tags !== undefined && { tags: stringifyTags(body.tags) }),
    },
  });
  await createTimelineEvent("PERSON", person.id, person.name, "updated", `Updated "${person.name}"`);
  return NextResponse.json(person);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.person.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
