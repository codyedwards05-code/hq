import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const [projects, ideas, people, conversations, knowledge, assets] = await Promise.all([
    prisma.project.count(),
    prisma.idea.count(),
    prisma.person.count(),
    prisma.conversation.count(),
    prisma.knowledge.count(),
    prisma.asset.count(),
  ]);

  return NextResponse.json({ projects, ideas, people, conversations, knowledge, assets });
}
