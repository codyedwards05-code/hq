"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/components/shared/StatusBadge";
import TagList from "@/components/shared/TagList";
import TimelineView from "@/components/shared/TimelineView";
import RelationshipPanel from "@/components/shared/RelationshipPanel";
import LinkEntityDialog from "@/components/shared/LinkEntityDialog";
import IdeaForm from "@/components/ideas/IdeaForm";
import Btn from "@/components/shared/Btn";
import { parseTags, formatDate } from "@/lib/utils";
import { EntityType, TimelineEvent } from "@/lib/types";

interface Idea {
  id: string;
  title: string;
  description: string | null;
  problemSolved: string | null;
  opportunity: string | null;
  notes: string | null;
  status: string;
  tags: string;
  createdAt: string;
  updatedAt: string;
  projects: { project: { id: string; title: string; status: string } }[];
  people: { person: { id: string; name: string; company: string | null } }[];
  conversations: { conversation: { id: string; title: string; source: string } }[];
  assets: { asset: { id: string; title: string; type: string } }[];
  knowledge: { knowledge: { id: string; title: string; category: string } }[];
}

const TABS = ["Overview", "Relationships", "Timeline"] as const;
type Tab = typeof TABS[number];

export default function IdeaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [tab, setTab] = useState<Tab>("Overview");
  const [editing, setEditing] = useState(false);
  const [linkType, setLinkType] = useState<EntityType | null>(null);

  const load = useCallback(() => {
    fetch(`/api/ideas/${id}`).then((r) => r.json()).then(setIdea);
    fetch(`/api/timeline?entityType=IDEA&entityId=${id}`).then((r) => r.json()).then(setTimeline);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    if (!confirm("Delete this idea?")) return;
    await fetch(`/api/ideas/${id}`, { method: "DELETE" });
    router.push("/ideas");
  };

  if (!idea) return <div className="p-8 text-zinc-500">Loading…</div>;

  const groups = [
    { type: "PROJECT" as EntityType, label: "Projects", items: idea.projects.map((r) => ({ id: r.project.id, title: r.project.title, subtitle: r.project.status })) },
    { type: "PERSON" as EntityType, label: "People", items: idea.people.map((r) => ({ id: r.person.id, title: r.person.name, subtitle: r.person.company || undefined })) },
    { type: "CONVERSATION" as EntityType, label: "Conversations", items: idea.conversations.map((r) => ({ id: r.conversation.id, title: r.conversation.title, subtitle: r.conversation.source })) },
    { type: "ASSET" as EntityType, label: "Assets", items: idea.assets.map((r) => ({ id: r.asset.id, title: r.asset.title, subtitle: r.asset.type })) },
    { type: "KNOWLEDGE" as EntityType, label: "Knowledge", items: idea.knowledge.map((r) => ({ id: r.knowledge.id, title: r.knowledge.title, subtitle: r.knowledge.category })) },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 text-xs text-zinc-500 mb-5">
        <Link href="/ideas" className="hover:text-zinc-300">Ideas</Link>
        <span>/</span>
        <span className="text-zinc-300">{idea.title}</span>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-semibold text-white">{idea.title}</h1>
            <StatusBadge status={idea.status} />
          </div>
          <p className="text-xs text-zinc-500">Created {formatDate(idea.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-4">
          <Btn variant="secondary" size="sm" onClick={() => setEditing(true)}>Edit</Btn>
          <Btn variant="danger" size="sm" onClick={handleDelete}>Delete</Btn>
        </div>
      </div>

      <div className="flex gap-1 mb-6 border-b border-zinc-800">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t ? "border-indigo-500 text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {idea.description && (
              <div>
                <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Description</h3>
                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{idea.description}</p>
              </div>
            )}
            {idea.problemSolved && (
              <div>
                <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Problem Being Solved</h3>
                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{idea.problemSolved}</p>
              </div>
            )}
            {idea.opportunity && (
              <div>
                <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Opportunity</h3>
                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{idea.opportunity}</p>
              </div>
            )}
            {idea.notes && (
              <div>
                <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Notes</h3>
                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{idea.notes}</p>
              </div>
            )}
            <TagList tags={idea.tags} />
          </div>
          <div>
            <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">Connections</h3>
            <RelationshipPanel groups={groups} onLink={(type) => setLinkType(type)} />
          </div>
        </div>
      )}

      {tab === "Relationships" && <RelationshipPanel groups={groups} onLink={(type) => setLinkType(type)} />}
      {tab === "Timeline" && <TimelineView events={timeline} />}

      <IdeaForm
        open={editing}
        onClose={() => { setEditing(false); load(); }}
        initial={{ id: idea.id, title: idea.title, description: idea.description || "", problemSolved: idea.problemSolved || "", opportunity: idea.opportunity || "", notes: idea.notes || "", status: idea.status, tags: parseTags(idea.tags) }}
      />

      {linkType && (
        <LinkEntityDialog
          open={true}
          onClose={() => setLinkType(null)}
          sourceType="IDEA"
          sourceId={idea.id}
          targetType={linkType}
          onLinked={load}
        />
      )}
    </div>
  );
}
