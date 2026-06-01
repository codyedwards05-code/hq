"use client";

import { useState } from "react";
import ProjectForm from "@/components/projects/ProjectForm";
import IdeaForm from "@/components/ideas/IdeaForm";
import PersonForm from "@/components/people/PersonForm";
import ConversationForm from "@/components/conversations/ConversationForm";
import KnowledgeForm from "@/components/knowledge/KnowledgeForm";
import AssetForm from "@/components/assets/AssetForm";

type FormType = "project" | "idea" | "person" | "conversation" | "knowledge" | "asset" | null;

const items: { type: FormType; label: string; icon: string }[] = [
  { type: "project", label: "New Project", icon: "📁" },
  { type: "idea", label: "New Idea", icon: "💡" },
  { type: "person", label: "New Person", icon: "👤" },
  { type: "conversation", label: "New Conversation", icon: "💬" },
  { type: "knowledge", label: "New Note", icon: "📚" },
  { type: "asset", label: "New Asset", icon: "📦" },
];

export default function QuickCreate() {
  const [open, setOpen] = useState<FormType>(null);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item.type}
            onClick={() => setOpen(item.type)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-sm text-zinc-300 transition-colors"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <ProjectForm open={open === "project"} onClose={() => setOpen(null)} />
      <IdeaForm open={open === "idea"} onClose={() => setOpen(null)} />
      <PersonForm open={open === "person"} onClose={() => setOpen(null)} />
      <ConversationForm open={open === "conversation"} onClose={() => setOpen(null)} />
      <KnowledgeForm open={open === "knowledge"} onClose={() => setOpen(null)} />
      <AssetForm open={open === "asset"} onClose={() => setOpen(null)} />
    </>
  );
}
