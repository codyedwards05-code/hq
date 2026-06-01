import prisma from "./prisma";
import { EntityType } from "./types";

export async function createTimelineEvent(
  entityType: EntityType,
  entityId: string,
  entityTitle: string,
  action: string,
  description: string,
  metadata?: Record<string, unknown>
) {
  return prisma.timelineEvent.create({
    data: {
      entityType,
      entityId,
      entityTitle,
      action,
      description,
      metadata: metadata ? JSON.stringify(metadata) : null,
    },
  });
}
