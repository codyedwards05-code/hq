"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import TimelineView from "@/components/shared/TimelineView";
import RelationshipPanel from "@/components/shared/RelationshipPanel";
import LinkEntityDialog from "@/components/shared/LinkEntityDialog";
import ConversationForm from "@/components/conversations/ConversationForm";
import Btn from "@/components/shared/Btn";
import { formatDate, formatSource } from "@/lib/utils";
import { EntityType, TimelineEvent } from "@/lib/types";

interface Conversation {
  id: string;
  title: string;
  source: string;
  date: string | null;
  url: string | null;
  transcript: string | null;
  notes: string | null;
  summary: string | null;
  createdAt: string;
  updatedAt: string;
  projects: { project: { id: string; title: string; status: string } }[];
  ideas: { idea: { id: string; title: string; status: string } }[];
  people: { person: { id: string; name: string; company: string | null } }[];
  assets: { asset: { id: string; title: string; type: string } }[];
  knowledge: { knowledge: { id: string; title: string; category: string } }[];
}

const TABS = ["Overview", "Transcript", "Relationships", "Timeline"] as const;
type Tab = typeof TABS[number];

export default function ConversationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [conv, setConv] = useState<Conversation | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [tab, setTab] = useState<Tab>("Overview");
  const [editing, setEditing] = useState(false);
  const [linkType, setLinkType] = useState<EntityType | null>(null);

  const load = useCallback(() => {
    fetch(`/api/conversations/${id}`).then((r) => r.json()).then(setConv);
    fetch(`/api/timeline?entityType=CONVERSATION&entityId=${id}`).then((r) => r.json()).then(setTimeline);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    if (!confirm("Delete this conversation?")) return;
    await fetch(`/api/conversations/${id}`, { method: "DELETE" });
    router.push("/conversations");
  };

  if (!conv) return <div className="p-8 text-zinc-500">Loading…</div>;

  const groups = [
    { type: "PROJECT" as EntityType, label: "Projects", items: conv.projects.map((r) => ({ id: r.project.id, title: r.project.title, subtitle: r.project.status })) },
    { type: "IDEA" as EntityType, label: "Ideas", items: conv.ideas.map((r) => ({ id: r.idea.id, title: r.idea.title, subtitle: r.idea.status })) },
    { type: "PERSON" as EntityType, label: "People", items: conv.people.map((r) => ({ id: r.person.id, title: r.person.name, subtitle: r.person.company || undefined })) },
    { type: "ASSET" as EntityType, label: "Assets", items: conv.assets.map((r) => ({ id: r.asset.id, title: r.asset.title, subtitle: r.asset.type })) },
    { type: "KNOWLEDGE" as EntityType, label: "Knowledge", items: conv.knowledge.map((r) => ({ id: r.knowledge.id, title: r.knowledge.title, subtitle: r.knowledge.category })) },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 text-xs text-zinc-500 mb-5">
        <Link href="/conversations" className="hover:text-zinc-300">Conversations</Link>
        <span>/</span>
        <span className="text-zinc-300">{conv.title}</span>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold text-white mb-1">{conv.title}</h1>
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span>{formatSource(conv.source)}</span>
            {conv.date && <span>·</span>}
            {conv.date && <span>{formatDate(conv.date)}</span>}
            {conv.url && (
              <>
                <span>·</span>
                <a href={conv.url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">
                  Open link ↗
                </a>
              </>
            )}
          </div>
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
          <div className="lg:col-span-2 space-y-6">
            {conv.summary && (
              <div>
                <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Summary</h3>
                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{conv.summary}</p>
              </div>
            )}
            {conv.notes && (
              <div>
                <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Notes</h3>
                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{conv.notes}</p>
              </div>
            )}
            {!conv.summary && !conv.notes && (
              <p className="text-sm text-zinc-500">No summary or notes. Switch to the Transcript tab to see the full content.</p>
            )}
          </div>
          <div>
            <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">Connections</h3>
            <RelationshipPanel groups={groups} onLink={(type) => setLinkType(type)} />
          </div>
        </div>
      )}

      {tab === "Transcript" && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          {conv.transcript ? (
            <pre className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap font-sans">{conv.transcript}</pre>
          ) : (
            <p className="text-sm text-zinc-500 text-center py-4">No transcript saved.</p>
          )}
        </div>
      )}

      {tab === "Relationships" && <RelationshipPanel groups={groups} onLink={(type) => setLinkType(type)} />}
      {tab === "Timeline" && <TimelineView events={timeline} />}

      <ConversationForm
        open={editing}
        onClose={() => { setEditing(false); load(); }}
        initial={{ id: conv.id, title: conv.title, source: conv.source, url: conv.url || "", transcript: conv.transcript || "", notes: conv.notes || "", summary: conv.summary || "" }}
      />

      {linkType && (
        <LinkEntityDialog open={true} onClose={() => setLinkType(null)} sourceType="CONVERSATION" sourceId={conv.id} targetType={linkType} onLinked={load} />
      )}
    </div>
  );
}
