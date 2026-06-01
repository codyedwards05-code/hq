"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PageHeader from "@/components/shared/PageHeader";
import Btn from "@/components/shared/Btn";
import EmptyState from "@/components/shared/EmptyState";
import ConversationForm from "@/components/conversations/ConversationForm";
import { formatDate, formatSource } from "@/lib/utils";

interface Conversation {
  id: string;
  title: string;
  source: string;
  summary: string | null;
  updatedAt: string;
}

const SOURCE_ICONS: Record<string, string> = {
  CHATGPT: "🤖",
  CLAUDE: "🤖",
  MEETING: "🤝",
  PHONE_CALL: "📞",
  VOICE_MEMO: "🎙️",
  TEXT_MESSAGE: "💬",
  EMAIL: "📧",
  OTHER: "💭",
};

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showForm, setShowForm] = useState(false);

  const load = () => fetch("/api/conversations").then((r) => r.json()).then(setConversations);
  useEffect(() => { load(); }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <PageHeader
        title="Conversations"
        subtitle={`${conversations.length} saved`}
        action={<Btn onClick={() => setShowForm(true)}>+ New Conversation</Btn>}
      />

      {conversations.length === 0 ? (
        <EmptyState
          icon="💬"
          title="No conversations saved"
          description="Save important conversations to preserve context you can reference later."
          action={<Btn onClick={() => setShowForm(true)}>+ Save Conversation</Btn>}
        />
      ) : (
        <div className="space-y-2">
          {conversations.map((conv) => (
            <Link
              key={conv.id}
              href={`/conversations/${conv.id}`}
              className="flex items-center gap-4 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors group"
            >
              <span className="text-xl shrink-0">{SOURCE_ICONS[conv.source] || "💭"}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-zinc-100 group-hover:text-white text-sm truncate">{conv.title}</p>
                {conv.summary && <p className="text-xs text-zinc-500 truncate mt-0.5">{conv.summary}</p>}
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs text-zinc-400">{formatSource(conv.source)}</p>
                <p className="text-xs text-zinc-600 mt-0.5">{formatDate(conv.updatedAt)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <ConversationForm open={showForm} onClose={() => { setShowForm(false); load(); }} />
    </div>
  );
}
