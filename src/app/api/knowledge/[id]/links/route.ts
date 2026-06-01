import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createTimelineEvent } from "@/lib/timeline";
import { EntityType } from "@/lib/types";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: knowledgeId } = await params;
  const { targetType, targetId } = await req.json() as { targetType: EntityType; targetId: string };
  const k = await prisma.knowledge.findUnique({ where: { id: knowledgeId } });
  if (!k) return NextResponse.json({ error: "Not found" }, { status: 404 });

  switch (targetType) {
    case "PROJECT": {
      const p = await prisma.project.findUnique({ where: { id: targetId } });
      await prisma.projectKnowledge.upsert({
        where: { projectId_knowledgeId: { projectId: targetId, knowledgeId } },
        create: { projectId: targetId, knowledgeId },
        update: {},
      });
      await createTimelineEvent("KNOWLEDGE", knowledgeId, k.title, "linked_project", `Linked to project "${p?.title}"`);
      break;
    }
    case "IDEA": {
      const i = await prisma.idea.findUnique({ where: { id: targetId } });
      await prisma.ideaKnowledge.upsert({
        where: { ideaId_knowledgeId: { ideaId: targetId, knowledgeId } },
        create: { ideaId: targetId, knowledgeId },
        update: {},
      });
      await createTimelineEvent("KNOWLEDGE", knowledgeId, k.title, "linked_idea", `Linked to idea "${i?.title}"`);
      break;
    }
    case "CONVERSATION": {
      const c = await prisma.conversation.findUnique({ where: { id: targetId } });
      await prisma.conversationKnowledge.upsert({
        where: { conversationId_knowledgeId: { conversationId: targetId, knowledgeId } },
        create: { conversationId: targetId, knowledgeId },
        update: {},
      });
      await createTimelineEvent("KNOWLEDGE", knowledgeId, k.title, "linked_conversation", `Linked to conversation "${c?.title}"`);
      break;
    }
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: knowledgeId } = await params;
  const { targetType, targetId } = await req.json() as { targetType: EntityType; targetId: string };

  switch (targetType) {
    case "PROJECT":
      await prisma.projectKnowledge.delete({ where: { projectId_knowledgeId: { projectId: targetId, knowledgeId } } });
      break;
    case "IDEA":
      await prisma.ideaKnowledge.delete({ where: { ideaId_knowledgeId: { ideaId: targetId, knowledgeId } } });
      break;
    case "CONVERSATION":
      await prisma.conversationKnowledge.delete({ where: { conversationId_knowledgeId: { conversationId: targetId, knowledgeId } } });
      break;
  }

  return new NextResponse(null, { status: 204 });
}
