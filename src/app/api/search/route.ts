import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { SearchResult } from "@/lib/types";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() || "";
  if (q.length < 2) return NextResponse.json([]);

  const like = { contains: q };

  const [projects, ideas, people, conversations, knowledge, assets] = await Promise.all([
    prisma.project.findMany({ where: { OR: [{ title: like }, { description: like }, { notes: like }] }, take: 5 }),
    prisma.idea.findMany({ where: { OR: [{ title: like }, { description: like }, { problemSolved: like }] }, take: 5 }),
    prisma.person.findMany({ where: { OR: [{ name: like }, { company: like }, { notes: like }] }, take: 5 }),
    prisma.conversation.findMany({ where: { OR: [{ title: like }, { notes: like }, { transcript: like }, { summary: like }] }, take: 5 }),
    prisma.knowledge.findMany({ where: { OR: [{ title: like }, { content: like }] }, take: 5 }),
    prisma.asset.findMany({ where: { OR: [{ title: like }, { description: like }] }, take: 5 }),
  ]);

  const results: SearchResult[] = [
    ...projects.map((p) => ({ id: p.id, type: "PROJECT" as const, title: p.title, subtitle: p.status, url: `/projects/${p.id}` })),
    ...ideas.map((i) => ({ id: i.id, type: "IDEA" as const, title: i.title, subtitle: i.status, url: `/ideas/${i.id}` })),
    ...people.map((p) => ({ id: p.id, type: "PERSON" as const, title: p.name, subtitle: p.company || undefined, url: `/people/${p.id}` })),
    ...conversations.map((c) => ({ id: c.id, type: "CONVERSATION" as const, title: c.title, subtitle: c.source, url: `/conversations/${c.id}` })),
    ...knowledge.map((k) => ({ id: k.id, type: "KNOWLEDGE" as const, title: k.title, subtitle: k.category, url: `/knowledge/${k.id}` })),
    ...assets.map((a) => ({ id: a.id, type: "ASSET" as const, title: a.title, subtitle: a.type, url: `/assets/${a.id}` })),
  ];

  return NextResponse.json(results);
}
