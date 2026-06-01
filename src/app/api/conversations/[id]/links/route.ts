import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createTimelineEvent } from "@/lib/timeline";
import { EntityType } from "@/lib/types";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: conversationId } = await params;
  const { targetType, targetId } = await req.json() as { targetType: EntityType; targetId: string };
  const conv = await prisma.conversation.findUnique({ where: { id: conversationId } });
  if (!conv) return NextResponse.json({ error: "Not found" }, { status: 404 });

  switch (targetType) {
    case "PROJECT": {
      const p = await prisma.project.findUnique({ where: { id: targetId } });
      await prisma.projectConversation.upsert({
        where: { projectId_conversationId: { projectId: targetId, conversationId } },
        create: { projectId: targetId, conversationId },
        update: {},
      });
      await createTimelineEvent("CONVERSATION", conversationId, conv.title, "linked_project", `Linked to project "${p?.title}"`);
      break;
    }
    case "IDEA": {
      const i = await prisma.idea.findUnique({ where: { id: targetId } });
      await prisma.ideaConversation.upsert({
        where: { ideaId_conversationId: { ideaId: targetId, conversationId } },
        create: { ideaId: targetId, conversationId },
        update: {},
      });
      await createTimelineEvent("CONVERSATION", conversationId, conv.title, "linked_idea", `Linked to idea "${i?.title}"`);
      break;
    }
    case "PERSON": {
      const p = await prisma.person.findUnique({ where: { id: targetId } });
      await prisma.personConversation.upsert({
        where: { personId_conversationId: { personId: targetId, conversationId } },
        create: { personId: targetId, conversationId },
        update: {},
      });
      await createTimelineEvent("CONVERSATION", conversationId, conv.title, "linked_person", `Linked person "${p?.name}"`);
      break;
    }
    case "ASSET": {
      const a = await prisma.asset.findUnique({ where: { id: targetId } });
      await prisma.conversationAsset.upsert({
        where: { conversationId_assetId: { conversationId, assetId: targetId } },
        create: { conversationId, assetId: targetId },
        update: {},
      });
      await createTimelineEvent("CONVERSATION", conversationId, conv.title, "linked_asset", `Linked asset "${a?.title}"`);
      break;
    }
    case "KNOWLEDGE": {
      const k = await prisma.knowledge.findUnique({ where: { id: targetId } });
      await prisma.conversationKnowledge.upsert({
        where: { conversationId_knowledgeId: { conversationId, knowledgeId: targetId } },
        create: { conversationId, knowledgeId: targetId },
        update: {},
      });
      await createTimelineEvent("CONVERSATION", conversationId, conv.title, "linked_knowledge", `Linked knowledge "${k?.title}"`);
      break;
    }
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: conversationId } = await params;
  const { targetType, targetId } = await req.json() as { targetType: EntityType; targetId: string };

  switch (targetType) {
    case "PROJECT":
      await prisma.projectConversation.delete({ where: { projectId_conversationId: { projectId: targetId, conversationId } } });
      break;
    case "IDEA":
      await prisma.ideaConversation.delete({ where: { ideaId_conversationId: { ideaId: targetId, conversationId } } });
      break;
    case "PERSON":
      await prisma.personConversation.delete({ where: { personId_conversationId: { personId: targetId, conversationId } } });
      break;
    case "ASSET":
      await prisma.conversationAsset.delete({ where: { conversationId_assetId: { conversationId, assetId: targetId } } });
      break;
    case "KNOWLEDGE":
      await prisma.conversationKnowledge.delete({ where: { conversationId_knowledgeId: { conversationId, knowledgeId: targetId } } });
      break;
  }

  return new NextResponse(null, { status: 204 });
}
