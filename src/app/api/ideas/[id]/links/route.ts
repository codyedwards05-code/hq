import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createTimelineEvent } from "@/lib/timeline";
import { EntityType } from "@/lib/types";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: ideaId } = await params;
  const { targetType, targetId } = await req.json() as { targetType: EntityType; targetId: string };
  const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
  if (!idea) return NextResponse.json({ error: "Not found" }, { status: 404 });

  switch (targetType) {
    case "PROJECT": {
      const p = await prisma.project.findUnique({ where: { id: targetId } });
      await prisma.projectIdea.upsert({
        where: { projectId_ideaId: { projectId: targetId, ideaId } },
        create: { projectId: targetId, ideaId },
        update: {},
      });
      await createTimelineEvent("IDEA", ideaId, idea.title, "linked_project", `Linked to project "${p?.title}"`);
      break;
    }
    case "PERSON": {
      const p = await prisma.person.findUnique({ where: { id: targetId } });
      await prisma.ideaPerson.upsert({
        where: { ideaId_personId: { ideaId, personId: targetId } },
        create: { ideaId, personId: targetId },
        update: {},
      });
      await createTimelineEvent("IDEA", ideaId, idea.title, "linked_person", `Linked person "${p?.name}"`);
      break;
    }
    case "CONVERSATION": {
      const c = await prisma.conversation.findUnique({ where: { id: targetId } });
      await prisma.ideaConversation.upsert({
        where: { ideaId_conversationId: { ideaId, conversationId: targetId } },
        create: { ideaId, conversationId: targetId },
        update: {},
      });
      await createTimelineEvent("IDEA", ideaId, idea.title, "linked_conversation", `Linked conversation "${c?.title}"`);
      break;
    }
    case "ASSET": {
      const a = await prisma.asset.findUnique({ where: { id: targetId } });
      await prisma.ideaAsset.upsert({
        where: { ideaId_assetId: { ideaId, assetId: targetId } },
        create: { ideaId, assetId: targetId },
        update: {},
      });
      await createTimelineEvent("IDEA", ideaId, idea.title, "linked_asset", `Linked asset "${a?.title}"`);
      break;
    }
    case "KNOWLEDGE": {
      const k = await prisma.knowledge.findUnique({ where: { id: targetId } });
      await prisma.ideaKnowledge.upsert({
        where: { ideaId_knowledgeId: { ideaId, knowledgeId: targetId } },
        create: { ideaId, knowledgeId: targetId },
        update: {},
      });
      await createTimelineEvent("IDEA", ideaId, idea.title, "linked_knowledge", `Linked knowledge "${k?.title}"`);
      break;
    }
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: ideaId } = await params;
  const { targetType, targetId } = await req.json() as { targetType: EntityType; targetId: string };

  switch (targetType) {
    case "PROJECT":
      await prisma.projectIdea.delete({ where: { projectId_ideaId: { projectId: targetId, ideaId } } });
      break;
    case "PERSON":
      await prisma.ideaPerson.delete({ where: { ideaId_personId: { ideaId, personId: targetId } } });
      break;
    case "CONVERSATION":
      await prisma.ideaConversation.delete({ where: { ideaId_conversationId: { ideaId, conversationId: targetId } } });
      break;
    case "ASSET":
      await prisma.ideaAsset.delete({ where: { ideaId_assetId: { ideaId, assetId: targetId } } });
      break;
    case "KNOWLEDGE":
      await prisma.ideaKnowledge.delete({ where: { ideaId_knowledgeId: { ideaId, knowledgeId: targetId } } });
      break;
  }

  return new NextResponse(null, { status: 204 });
}
