"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/components/shared/StatusBadge";
import TagList from "@/components/shared/TagList";
import TimelineView from "@/components/shared/TimelineView";
import RelationshipPanel from "@/components/shared/RelationshipPanel";
import LinkEntityDialog from "@/components/shared/LinkEntityDialog";
import ProjectForm from "@/components/projects/ProjectForm";
import Btn from "@/components/shared/Btn";
import { parseTags, formatDate, formatStatus } from "@/lib/utils";
import { EntityType, TimelineEvent } from "@/lib/types";

interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string;
  startDate: string | null;
  notes: string | null;
  tags: string;
  createdAt: string;
  updatedAt: string;
  ideas: { idea: { id: string; title: string; status: string } }[];
  people: { person: { id: string; name: string; company: string | null } }[];
  conversations: { conversation: { id: string; title: string; source: string } }[];
  assets: { asset: { id: string; title: string; type: string } }[];
  knowledge: { knowledge: { id: string; title: string; category: string } }[];
}

const TABS = ["Overview", "Relationships", "Timeline"] as const;
type Tab = typeof TABS[number];

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [tab, setTab] = useState<Tab>("Overview");
  const [editing, setEditing] = useState(false);
  const [linkType, setLinkType] = useState<EntityType | null>(null);

  const load = useCallback(() => {
    fetch(`/api/projects/${id}`).then((r) => r.json()).then(setProject);
    fetch(`/api/timeline?entityType=PROJECT&entityId=${id}`).then((r) => r.json()).then(setTimeline);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    router.push("/projects");
  };

  if (!project) {
    return <div className="p-8 text-zinc-500">Loading…</div>;
  }

  const relationshipGroups = [
    { type: "IDEA" as EntityType, label: "Ideas", items: project.ideas.map((r) => ({ id: r.idea.id, title: r.idea.title, subtitle: r.idea.status })) },
    { type: "PERSON" as EntityType, label: "People", items: project.people.map((r) => ({ id: r.person.id, title: r.person.name, subtitle: r.person.company || undefined })) },
    { type: "CONVERSATION" as EntityType, label: "Conversations", items: project.conversations.map((r) => ({ id: r.conversation.id, title: r.conversation.title, subtitle: r.conversation.source })) },
    { type: "ASSET" as EntityType, label: "Assets", items: project.assets.map((r) => ({ id: r.asset.id, title: r.asset.title, subtitle: r.asset.type })) },
    { type: "KNOWLEDGE" as EntityType, label: "Knowledge", items: project.knowledge.map((r) => ({ id: r.knowledge.id, title: r.knowledge.title, subtitle: r.knowledge.category })) },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-zinc-500 mb-5">
        <Link href="/projects" className="hover:text-zinc-300">Projects</Link>
        <span>/</span>
        <span className="text-zinc-300">{project.title}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-semibold text-white">{project.title}</h1>
            <StatusBadge status={project.status} />
          </div>
          {project.startDate && (
            <p className="text-xs text-zinc-500">Started {formatDate(project.startDate)}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-4">
          <Btn variant="secondary" size="sm" onClick={() => setEditing(true)}>Edit</Btn>
          <Btn variant="danger" size="sm" onClick={handleDelete}>Delete</Btn>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-zinc-800">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t
                ? "border-indigo-500 text-white"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {project.description && (
              <div>
                <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Description</h3>
                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{project.description}</p>
              </div>
            )}
            {project.notes && (
              <div>
                <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Notes</h3>
                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{project.notes}</p>
              </div>
            )}
            <div>
              <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Tags</h3>
              <TagList tags={project.tags} />
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs text-zinc-500">
              <div>
                <span className="block text-zinc-400 font-medium mb-0.5">Status</span>
                {formatStatus(project.status)}
              </div>
              <div>
                <span className="block text-zinc-400 font-medium mb-0.5">Last updated</span>
                {formatDate(project.updatedAt)}
              </div>
              <div>
                <span className="block text-zinc-400 font-medium mb-0.5">Created</span>
                {formatDate(project.createdAt)}
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">Connections</h3>
            <RelationshipPanel
              groups={relationshipGroups}
              onLink={(type) => setLinkType(type)}
            />
          </div>
        </div>
      )}

      {tab === "Relationships" && (
        <RelationshipPanel
          groups={relationshipGroups}
          onLink={(type) => setLinkType(type)}
        />
      )}

      {tab === "Timeline" && (
        <TimelineView events={timeline} />
      )}

      <ProjectForm
        open={editing}
        onClose={() => { setEditing(false); load(); }}
        initial={{
          id: project.id,
          title: project.title,
          description: project.description || "",
          status: project.status,
          notes: project.notes || "",
          tags: parseTags(project.tags),
        }}
      />

      {linkType && (
        <LinkEntityDialog
          open={true}
          onClose={() => setLinkType(null)}
          sourceType="PROJECT"
          sourceId={project.id}
          targetType={linkType}
          onLinked={load}
        />
      )}
    </div>
  );
}
