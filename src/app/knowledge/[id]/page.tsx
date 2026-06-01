"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import TagList from "@/components/shared/TagList";
import TimelineView from "@/components/shared/TimelineView";
import RelationshipPanel from "@/components/shared/RelationshipPanel";
import LinkEntityDialog from "@/components/shared/LinkEntityDialog";
import KnowledgeForm from "@/components/knowledge/KnowledgeForm";
import Btn from "@/components/shared/Btn";
import { parseTags, formatDate, formatStatus } from "@/lib/utils";
import { EntityType, TimelineEvent } from "@/lib/types";

interface Knowledge {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string;
  createdAt: string;
  updatedAt: string;
  projects: { project: { id: string; title: string; status: string } }[];
  ideas: { idea: { id: string; title: string; status: string } }[];
  conversations: { conversation: { id: string; title: string; source: string } }[];
}

const TABS = ["Overview", "Relationships", "Timeline"] as const;
type Tab = typeof TABS[number];

export default function KnowledgeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [note, setNote] = useState<Knowledge | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [tab, setTab] = useState<Tab>("Overview");
  const [editing, setEditing] = useState(false);
  const [linkType, setLinkType] = useState<EntityType | null>(null);

  const load = useCallback(() => {
    fetch(`/api/knowledge/${id}`).then((r) => r.json()).then(setNote);
    fetch(`/api/timeline?entityType=KNOWLEDGE&entityId=${id}`).then((r) => r.json()).then(setTimeline);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    if (!confirm("Delete this knowledge note?")) return;
    await fetch(`/api/knowledge/${id}`, { method: "DELETE" });
    router.push("/knowledge");
  };

  if (!note) return <div className="p-8 text-zinc-500">Loading…</div>;

  const groups = [
    { type: "PROJECT" as EntityType, label: "Projects", items: note.projects.map((r) => ({ id: r.project.id, title: r.project.title, subtitle: r.project.status })) },
    { type: "IDEA" as EntityType, label: "Ideas", items: note.ideas.map((r) => ({ id: r.idea.id, title: r.idea.title, subtitle: r.idea.status })) },
    { type: "CONVERSATION" as EntityType, label: "Conversations", items: note.conversations.map((r) => ({ id: r.conversation.id, title: r.conversation.title, subtitle: r.conversation.source })) },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 text-xs text-zinc-500 mb-5">
        <Link href="/knowledge" className="hover:text-zinc-300">Knowledge</Link>
        <span>/</span>
        <span className="text-zinc-300">{note.title}</span>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold text-white mb-1">{note.title}</h1>
          <p className="text-xs text-zinc-500">{formatStatus(note.category)} · {formatDate(note.updatedAt)}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-4">
          <Btn variant="secondary" size="sm" onClick={() => setEditing(true)}>Edit</Btn>
          <Btn variant="danger" size="sm" onClick={handleDelete}>Delete</Btn>
        </div>
      </div>

      <div className="flex gap-1 mb-6 border-b border-zinc-800">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${tab === t ? "border-indigo-500 text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
              <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{note.content}</p>
            </div>
            <TagList tags={note.tags} />
          </div>
          <div>
            <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">Connections</h3>
            <RelationshipPanel groups={groups} onLink={(type) => setLinkType(type)} />
          </div>
        </div>
      )}

      {tab === "Relationships" && <RelationshipPanel groups={groups} onLink={(type) => setLinkType(type)} />}
      {tab === "Timeline" && <TimelineView events={timeline} />}

      <KnowledgeForm
        open={editing}
        onClose={() => { setEditing(false); load(); }}
        initial={{ id: note.id, title: note.title, content: note.content, category: note.category, tags: parseTags(note.tags) }}
      />

      {linkType && (
        <LinkEntityDialog open={true} onClose={() => setLinkType(null)} sourceType="KNOWLEDGE" sourceId={note.id} targetType={linkType} onLinked={load} />
      )}
    </div>
  );
}
