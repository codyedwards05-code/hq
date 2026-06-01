import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createTimelineEvent } from "@/lib/timeline";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const asset = await prisma.asset.findUnique({
    where: { id },
    include: {
      projects: { include: { project: true } },
      ideas: { include: { idea: true } },
      conversations: { include: { conversation: true } },
    },
  });
  if (!asset) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(asset);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const asset = await prisma.asset.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.type !== undefined && { type: body.type }),
      ...(body.url !== undefined && { url: body.url }),
      ...(body.filePath !== undefined && { filePath: body.filePath }),
    },
  });
  await createTimelineEvent("ASSET", asset.id, asset.title, "updated", `Updated asset "${asset.title}"`);
  return NextResponse.json(asset);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.asset.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
