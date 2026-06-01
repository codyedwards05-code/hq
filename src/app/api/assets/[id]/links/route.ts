import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createTimelineEvent } from "@/lib/timeline";
import { EntityType } from "@/lib/types";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: assetId } = await params;
  const { targetType, targetId } = await req.json() as { targetType: EntityType; targetId: string };
  const asset = await prisma.asset.findUnique({ where: { id: assetId } });
  if (!asset) return NextResponse.json({ error: "Not found" }, { status: 404 });

  switch (targetType) {
    case "PROJECT": {
      const p = await prisma.project.findUnique({ where: { id: targetId } });
      await prisma.projectAsset.upsert({
        where: { projectId_assetId: { projectId: targetId, assetId } },
        create: { projectId: targetId, assetId },
        update: {},
      });
      await createTimelineEvent("ASSET", assetId, asset.title, "linked_project", `Linked to project "${p?.title}"`);
      break;
    }
    case "IDEA": {
      const i = await prisma.idea.findUnique({ where: { id: targetId } });
      await prisma.ideaAsset.upsert({
        where: { ideaId_assetId: { ideaId: targetId, assetId } },
        create: { ideaId: targetId, assetId },
        update: {},
      });
      await createTimelineEvent("ASSET", assetId, asset.title, "linked_idea", `Linked to idea "${i?.title}"`);
      break;
    }
    case "CONVERSATION": {
      const c = await prisma.conversation.findUnique({ where: { id: targetId } });
      await prisma.conversationAsset.upsert({
        where: { conversationId_assetId: { conversationId: targetId, assetId } },
        create: { conversationId: targetId, assetId },
        update: {},
      });
      await createTimelineEvent("ASSET", assetId, asset.title, "linked_conversation", `Linked to conversation "${c?.title}"`);
      break;
    }
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: assetId } = await params;
  const { targetType, targetId } = await req.json() as { targetType: EntityType; targetId: string };

  switch (targetType) {
    case "PROJECT":
      await prisma.projectAsset.delete({ where: { projectId_assetId: { projectId: targetId, assetId } } });
      break;
    case "IDEA":
      await prisma.ideaAsset.delete({ where: { ideaId_assetId: { ideaId: targetId, assetId } } });
      break;
    case "CONVERSATION":
      await prisma.conversationAsset.delete({ where: { conversationId_assetId: { conversationId: targetId, assetId } } });
      break;
  }

  return new NextResponse(null, { status: 204 });
}
