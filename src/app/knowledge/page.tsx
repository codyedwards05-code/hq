"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PageHeader from "@/components/shared/PageHeader";
import Btn from "@/components/shared/Btn";
import EmptyState from "@/components/shared/EmptyState";
import TagList from "@/components/shared/TagList";
import KnowledgeForm from "@/components/knowledge/KnowledgeForm";
import { formatDate, formatStatus } from "@/lib/utils";

interface Knowledge {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string;
  updatedAt: string;
}

const CATEGORIES = ["ALL", "BUSINESS", "AI", "MARKETING", "SALES", "FAITH", "PERSONAL_DEVELOPMENT", "OPERATIONS", "TECHNOLOGY", "OTHER"];

const CATEGORY_ICONS: Record<string, string> = {
  BUSINESS: "💼",
  AI: "🤖",
  MARKETING: "📣",
  SALES: "🤝",
  FAITH: "✨",
  PERSONAL_DEVELOPMENT: "🌱",
  OPERATIONS: "⚙️",
  TECHNOLOGY: "💻",
  OTHER: "📝",
};

export default function KnowledgePage() {
  const [notes, setNotes] = useState<Knowledge[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [showForm, setShowForm] = useState(false);

  const load = () => fetch("/api/knowledge").then((r) => r.json()).then(setNotes);
  useEffect(() => { load(); }, []);

  const filtered = filter === "ALL" ? notes : notes.filter((n) => n.category === filter);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <PageHeader
        title="Knowledge"
        subtitle={`${notes.length} notes`}
        action={<Btn onClick={() => setShowForm(true)}>+ New Note</Btn>}
      />

      <div className="flex gap-1.5 mb-6 flex-wrap">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filter === c ? "bg-indigo-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {c === "ALL" ? "All" : `${CATEGORY_ICONS[c]} ${formatStatus(c)}`}
          </button>
        ))}
      </div>

      {filtered.length === 0 && notes.length === 0 ? (
        <EmptyState
          icon="📚"
          title="No knowledge notes yet"
          description="Capture lessons, insights, and things you've learned."
          action={<Btn onClick={() => setShowForm(true)}>+ New Note</Btn>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((note) => (
            <Link
              key={note.id}
              href={`/knowledge/${note.id}`}
              className="flex flex-col p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors group"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-zinc-100 group-hover:text-white text-sm leading-snug flex-1 mr-2">{note.title}</h3>
                <span className="text-xs text-zinc-500 shrink-0">{CATEGORY_ICONS[note.category] || "📝"}</span>
              </div>
              <p className="text-xs text-zinc-500 line-clamp-3 flex-1 mb-3">{note.content}</p>
              <div className="mt-auto flex items-center justify-between">
                <TagList tags={note.tags} />
                <span className="text-xs text-zinc-600 shrink-0 ml-2">{formatDate(note.updatedAt)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <KnowledgeForm open={showForm} onClose={() => { setShowForm(false); load(); }} />
    </div>
  );
}
