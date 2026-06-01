import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createTimelineEvent } from "@/lib/timeline";
import { EntityType } from "@/lib/types";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = await params;
  const { targetType, targetId } = await req.json() as { targetType: EntityType; targetId: string };

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  switch (targetType) {
    case "IDEA": {
      const idea = await prisma.idea.findUnique({ where: { id: targetId } });
      await prisma.projectIdea.upsert({
        where: { projectId_ideaId: { projectId, ideaId: targetId } },
        create: { projectId, ideaId: targetId },
        update: {},
      });
      await createTimelineEvent("PROJECT", projectId, project.title, "linked_idea", `Linked idea "${idea?.title}" to project`);
      break;
    }
    case "PERSON": {
      const person = await prisma.person.findUnique({ where: { id: targetId } });
      await prisma.projectPerson.upsert({
        where: { projectId_personId: { projectId, personId: targetId } },
        create: { projectId, personId: targetId },
        update: {},
      });
      await createTimelineEvent("PROJECT", projectId, project.title, "linked_person", `Linked person "${person?.name}" to project`);
      break;
    }
    case "CONVERSATION": {
      const conv = await prisma.conversation.findUnique({ where: { id: targetId } });
      await prisma.projectConversation.upsert({
        where: { projectId_conversationId: { projectId, conversationId: targetId } },
        create: { projectId, conversationId: targetId },
        update: {},
      });
      await createTimelineEvent("PROJECT", projectId, project.title, "linked_conversation", `Linked conversation "${conv?.title}" to project`);
      break;
    }
    case "ASSET": {
      const asset = await prisma.asset.findUnique({ where: { id: targetId } });
      await prisma.projectAsset.upsert({
        where: { projectId_assetId: { projectId, assetId: targetId } },
        create: { projectId, assetId: targetId },
        update: {},
      });
      await createTimelineEvent("PROJECT", projectId, project.title, "linked_asset", `Linked asset "${asset?.title}" to project`);
      break;
    }
    case "KNOWLEDGE": {
      const k = await prisma.knowledge.findUnique({ where: { id: targetId } });
      await prisma.projectKnowledge.upsert({
        where: { projectId_knowledgeId: { projectId, knowledgeId: targetId } },
        create: { projectId, knowledgeId: targetId },
        update: {},
      });
      await createTimelineEvent("PROJECT", projectId, project.title, "linked_knowledge", `Linked knowledge "${k?.title}" to project`);
      break;
    }
    default:
      return NextResponse.json({ error: "Unsupported link type" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = await params;
  const { targetType, targetId } = await req.json() as { targetType: EntityType; targetId: string };

  switch (targetType) {
    case "IDEA":
      await prisma.projectIdea.delete({ where: { projectId_ideaId: { projectId, ideaId: targetId } } });
      break;
    case "PERSON":
      await prisma.projectPerson.delete({ where: { projectId_personId: { projectId, personId: targetId } } });
      break;
    case "CONVERSATION":
      await prisma.projectConversation.delete({ where: { projectId_conversationId: { projectId, conversationId: targetId } } });
      break;
    case "ASSET":
      await prisma.projectAsset.delete({ where: { projectId_assetId: { projectId, assetId: targetId } } });
      break;
    case "KNOWLEDGE":
      await prisma.projectKnowledge.delete({ where: { projectId_knowledgeId: { projectId, knowledgeId: targetId } } });
      break;
  }

  return new NextResponse(null, { status: 204 });
}
