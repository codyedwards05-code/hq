"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import TimelineView from "@/components/shared/TimelineView";
import RelationshipPanel from "@/components/shared/RelationshipPanel";
import LinkEntityDialog from "@/components/shared/LinkEntityDialog";
import AssetForm from "@/components/assets/AssetForm";
import Btn from "@/components/shared/Btn";
import { formatDate, formatStatus } from "@/lib/utils";
import { EntityType, TimelineEvent } from "@/lib/types";

interface Asset {
  id: string;
  title: string;
  description: string | null;
  type: string;
  url: string | null;
  filePath: string | null;
  createdAt: string;
  updatedAt: string;
  projects: { project: { id: string; title: string; status: string } }[];
  ideas: { idea: { id: string; title: string; status: string } }[];
  conversations: { conversation: { id: string; title: string; source: string } }[];
}

const TYPE_ICONS: Record<string, string> = {
  DOCUMENT: "📄", SPREADSHEET: "📊", IMAGE: "🖼️", VIDEO: "🎬",
  WEBSITE: "🌐", GITHUB_REPO: "💻", PDF: "📋", OTHER: "📦",
};

const TABS = ["Overview", "Relationships", "Timeline"] as const;
type Tab = typeof TABS[number];

export default function AssetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [tab, setTab] = useState<Tab>("Overview");
  const [editing, setEditing] = useState(false);
  const [linkType, setLinkType] = useState<EntityType | null>(null);

  const load = useCallback(() => {
    fetch(`/api/assets/${id}`).then((r) => r.json()).then(setAsset);
    fetch(`/api/timeline?entityType=ASSET&entityId=${id}`).then((r) => r.json()).then(setTimeline);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    if (!confirm("Delete this asset?")) return;
    await fetch(`/api/assets/${id}`, { method: "DELETE" });
    router.push("/assets");
  };

  if (!asset) return <div className="p-8 text-zinc-500">Loading…</div>;

  const groups = [
    { type: "PROJECT" as EntityType, label: "Projects", items: asset.projects.map((r) => ({ id: r.project.id, title: r.project.title, subtitle: r.project.status })) },
    { type: "IDEA" as EntityType, label: "Ideas", items: asset.ideas.map((r) => ({ id: r.idea.id, title: r.idea.title, subtitle: r.idea.status })) },
    { type: "CONVERSATION" as EntityType, label: "Conversations", items: asset.conversations.map((r) => ({ id: r.conversation.id, title: r.conversation.title, subtitle: r.conversation.source })) },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 text-xs text-zinc-500 mb-5">
        <Link href="/assets" className="hover:text-zinc-300">Assets</Link>
        <span>/</span>
        <span className="text-zinc-300">{asset.title}</span>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{TYPE_ICONS[asset.type] || "📦"}</span>
          <div>
            <h1 className="text-2xl font-semibold text-white">{asset.title}</h1>
            <p className="text-xs text-zinc-500 mt-0.5">{formatStatus(asset.type)} · Added {formatDate(asset.createdAt)}</p>
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
          <div className="lg:col-span-2 space-y-4">
            {asset.url && (
              <div>
                <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Link</h3>
                <a href={asset.url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-400 hover:text-indigo-300 break-all">
                  {asset.url} ↗
                </a>
              </div>
            )}
            {asset.description && (
              <div>
                <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Description</h3>
                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{asset.description}</p>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">Connections</h3>
            <RelationshipPanel groups={groups} onLink={(type) => setLinkType(type)} />
          </div>
        </div>
      )}

      {tab === "Relationships" && <RelationshipPanel groups={groups} onLink={(type) => setLinkType(type)} />}
      {tab === "Timeline" && <TimelineView events={timeline} />}

      <AssetForm
        open={editing}
        onClose={() => { setEditing(false); load(); }}
        initial={{ id: asset.id, title: asset.title, description: asset.description || "", type: asset.type, url: asset.url || "" }}
      />

      {linkType && (
        <LinkEntityDialog open={true} onClose={() => setLinkType(null)} sourceType="ASSET" sourceId={asset.id} targetType={linkType} onLinked={load} />
      )}
    </div>
  );
}
