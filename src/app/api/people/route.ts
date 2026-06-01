import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createTimelineEvent } from "@/lib/timeline";
import { stringifyTags } from "@/lib/utils";

export async function GET() {
  const people = await prisma.person.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json(people);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, company, jobTitle, email, phone, website, linkedin, notes, tags } = body;

  const person = await prisma.person.create({
    data: { name, company, jobTitle, email, phone, website, linkedin, notes, tags: stringifyTags(tags || []) },
  });

  await createTimelineEvent("PERSON", person.id, person.name, "created", `Added person "${person.name}"`);
  return NextResponse.json(person, { status: 201 });
}
