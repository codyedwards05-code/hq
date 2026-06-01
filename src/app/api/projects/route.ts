import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createTimelineEvent } from "@/lib/timeline";
import { stringifyTags } from "@/lib/utils";

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, description, status, startDate, notes, tags } = body;

  const project = await prisma.project.create({
    data: {
      title,
      description,
      status: status || "ACTIVE",
      startDate: startDate ? new Date(startDate) : null,
      notes,
      tags: stringifyTags(tags || []),
    },
  });

  await createTimelineEvent("PROJECT", project.id, project.title, "created", `Created project "${project.title}"`);

  return NextResponse.json(project, { status: 201 });
}
