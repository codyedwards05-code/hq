import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createTimelineEvent } from "@/lib/timeline";
import { EntityType } from "@/lib/types";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: personId } = await params;
  const { targetType, targetId } = await req.json() as { targetType: EntityType; targetId: string };
  const person = await prisma.person.findUnique({ where: { id: personId } });
  if (!person) return NextResponse.json({ error: "Not found" }, { status: 404 });

  switch (targetType) {
    case "PROJECT": {
      const p = await prisma.project.findUnique({ where: { id: targetId } });
      await prisma.projectPerson.upsert({
        where: { projectId_personId: { projectId: targetId, personId } },
        create: { projectId: targetId, personId },
        update: {},
      });
      await createTimelineEvent("PERSON", personId, person.name, "linked_project", `Linked to project "${p?.title}"`);
      break;
    }
    case "IDEA": {
      const i = await prisma.idea.findUnique({ where: { id: targetId } });
      await prisma.ideaPerson.upsert({
        where: { ideaId_personId: { ideaId: targetId, personId } },
        create: { ideaId: targetId, personId },
        update: {},
      });
      await createTimelineEvent("PERSON", personId, person.name, "linked_idea", `Linked to idea "${i?.title}"`);
      break;
    }
    case "CONVERSATION": {
      const c = await prisma.conversation.findUnique({ where: { id: targetId } });
      await prisma.personConversation.upsert({
        where: { personId_conversationId: { personId, conversationId: targetId } },
        create: { personId, conversationId: targetId },
        update: {},
      });
      await createTimelineEvent("PERSON", personId, person.name, "linked_conversation", `Linked conversation "${c?.title}"`);
      break;
    }
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: personId } = await params;
  const { targetType, targetId } = await req.json() as { targetType: EntityType; targetId: string };

  switch (targetType) {
    case "PROJECT":
      await prisma.projectPerson.delete({ where: { projectId_personId: { projectId: targetId, personId } } });
      break;
    case "IDEA":
      await prisma.ideaPerson.delete({ where: { ideaId_personId: { ideaId: targetId, personId } } });
      break;
    case "CONVERSATION":
      await prisma.personConversation.delete({ where: { personId_conversationId: { personId, conversationId: targetId } } });
      break;
  }

  return new NextResponse(null, { status: 204 });
}
