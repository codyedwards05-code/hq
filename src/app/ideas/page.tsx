"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PageHeader from "@/components/shared/PageHeader";
import Btn from "@/components/shared/Btn";
import EmptyState from "@/components/shared/EmptyState";
import StatusBadge from "@/components/shared/StatusBadge";
import TagList from "@/components/shared/TagList";
import IdeaForm from "@/components/ideas/IdeaForm";
import { formatDate } from "@/lib/utils";

interface Idea {
  id: string;
  title: string;
  description: string | null;
  status: string;
  tags: string;
  updatedAt: string;
}

const STATUS_FILTERS = ["ALL", "IDEA", "RESEARCHING", "VALIDATING", "BUILDING", "ARCHIVED"];

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [showForm, setShowForm] = useState(false);

  const load = () => fetch("/api/ideas").then((r) => r.json()).then(setIdeas);
  useEffect(() => { load(); }, []);

  const filtered = filter === "ALL" ? ideas : ideas.filter((i) => i.status === filter);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <PageHeader
        title="Ideas"
        subtitle={`${ideas.length} total`}
        action={<Btn onClick={() => setShowForm(true)}>+ New Idea</Btn>}
      />

      <div className="flex gap-1.5 mb-6 flex-wrap">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filter === s ? "bg-indigo-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {s === "ALL" ? "All" : s[0] + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {filtered.length === 0 && ideas.length === 0 ? (
        <EmptyState
          icon="💡"
          title="No ideas yet"
          description="Capture your first idea before it disappears."
          action={<Btn onClick={() => setShowForm(true)}>+ New Idea</Btn>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((idea) => (
            <Link
              key={idea.id}
              href={`/ideas/${idea.id}`}
              className="flex flex-col p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors group"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-zinc-100 group-hover:text-white text-sm leading-snug">{idea.title}</h3>
                <StatusBadge status={idea.status} />
              </div>
              {idea.description && (
                <p className="text-xs text-zinc-500 mb-3 line-clamp-2 flex-1">{idea.description}</p>
              )}
              <div className="mt-auto pt-2 flex items-center justify-between">
                <TagList tags={idea.tags} />
                <span className="text-xs text-zinc-600 shrink-0 ml-2">{formatDate(idea.updatedAt)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <IdeaForm open={showForm} onClose={() => { setShowForm(false); load(); }} />
    </div>
  );
}
