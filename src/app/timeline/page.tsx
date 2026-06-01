"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PageHeader from "@/components/shared/PageHeader";
import { timeAgo, entityIcon, entityPath, entityLabel } from "@/lib/utils";
import { EntityType, TimelineEvent } from "@/lib/types";

const ENTITY_FILTERS: { label: string; value: string }[] = [
  { label: "All", value: "ALL" },
  { label: "📁 Projects", value: "PROJECT" },
  { label: "💡 Ideas", value: "IDEA" },
  { label: "👥 People", value: "PERSON" },
  { label: "💬 Conversations", value: "CONVERSATION" },
  { label: "📚 Knowledge", value: "KNOWLEDGE" },
  { label: "📦 Assets", value: "ASSET" },
];

export default function TimelinePage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetch("/api/timeline?limit=200")
      .then((r) => r.json())
      .then(setEvents);
  }, []);

  const filtered = filter === "ALL" ? events : events.filter((e) => e.entityType === filter);

  const grouped: { date: string; events: TimelineEvent[] }[] = [];
  for (const event of filtered) {
    const date = new Date(event.createdAt).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    const existing = grouped.find((g) => g.date === date);
    if (existing) {
      existing.events.push(event);
    } else {
      grouped.push({ date, events: [event] });
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <PageHeader title="Timeline" subtitle="Chronological history of everything" />

      <div className="flex gap-1.5 mb-8 flex-wrap">
        {ENTITY_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filter === f.value ? "bg-indigo-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-zinc-500 text-center py-10">No activity recorded yet.</p>
      ) : (
        <div className="space-y-8">
          {grouped.map((group) => (
            <div key={group.date}>
              <h3 className="text-xs font-medium text-zinc-500 mb-3 uppercase tracking-wider">{group.date}</h3>
              <div className="relative">
                <div className="absolute left-[7px] top-0 bottom-0 w-px bg-zinc-800" />
                <div className="space-y-4">
                  {group.events.map((event) => (
                    <div key={event.id} className="flex gap-3 pl-6 relative">
                      <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs text-zinc-500">
                            {entityIcon(event.entityType as EntityType)} {entityLabel(event.entityType as EntityType)}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-300">
                          {event.entityTitle && event.entityId ? (
                            <>
                              {event.description.split(event.entityTitle)[0]}
                              <Link
                                href={entityPath(event.entityType as EntityType, event.entityId)}
                                className="text-indigo-400 hover:text-indigo-300"
                              >
                                {event.entityTitle}
                              </Link>
                              {event.description.split(event.entityTitle)[1]}
                            </>
                          ) : (
                            event.description
                          )}
                        </p>
                        <p className="text-xs text-zinc-600 mt-0.5">{timeAgo(event.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
