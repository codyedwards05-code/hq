import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createTimelineEvent } from "@/lib/timeline";

export async function GET() {
  const assets = await prisma.asset.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json(assets);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, description, type, url, filePath } = body;

  const asset = await prisma.asset.create({
    data: { title, description, type: type || "OTHER", url, filePath },
  });

  await createTimelineEvent("ASSET", asset.id, asset.title, "created", `Added asset "${asset.title}"`);
  return NextResponse.json(asset, { status: 201 });
}
