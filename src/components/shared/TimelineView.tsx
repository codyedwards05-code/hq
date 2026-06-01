import { timeAgo, entityIcon, entityLabel } from "@/lib/utils";
import { TimelineEvent, EntityType } from "@/lib/types";

interface Props {
  events: TimelineEvent[];
  showEntity?: boolean;
}

export default function TimelineView({ events, showEntity = false }: Props) {
  if (!events.length) {
    return (
      <p className="text-sm text-zinc-500 py-4">No activity yet.</p>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-[7px] top-0 bottom-0 w-px bg-zinc-800" />
      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="flex gap-3 pl-6 relative">
            <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            </div>
            <div className="flex-1 min-w-0">
              {showEntity && (
                <span className="text-xs text-zinc-500 mb-0.5 block">
                  {entityIcon(event.entityType as EntityType)}{" "}
                  {entityLabel(event.entityType as EntityType)}
                  {event.entityTitle ? ` — ${event.entityTitle}` : ""}
                </span>
              )}
              <p className="text-sm text-zinc-300">{event.description}</p>
              <p className="text-xs text-zinc-500 mt-0.5">
                {timeAgo(event.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
