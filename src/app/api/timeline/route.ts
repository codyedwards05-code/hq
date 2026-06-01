import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const entityType = req.nextUrl.searchParams.get("entityType");
  const entityId = req.nextUrl.searchParams.get("entityId");
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "50");

  const events = await prisma.timelineEvent.findMany({
    where: {
      ...(entityType && entityId ? { entityType, entityId } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return NextResponse.json(events);
}
