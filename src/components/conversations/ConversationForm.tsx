"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/shared/Modal";
import { Input, Textarea, Select } from "@/components/shared/FormField";
import Btn from "@/components/shared/Btn";
import { CONVERSATION_SOURCES, formatSource } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  initial?: {
    id?: string;
    title?: string;
    source?: string;
    url?: string;
    transcript?: string;
    notes?: string;
    summary?: string;
  };
}

export default function ConversationForm({ open, onClose, initial = {} }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: initial.title || "",
    source: initial.source || "OTHER",
    url: initial.url || "",
    transcript: initial.transcript || "",
    notes: initial.notes || "",
    summary: initial.summary || "",
  });

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    const url = initial.id ? `/api/conversations/${initial.id}` : "/api/conversations";
    const res = await fetch(url, {
      method: initial.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    onClose();
    router.push(`/conversations/${data.id}`);
    router.refresh();
  };

  return (
    <Modal open={open} onClose={onClose} title={initial.id ? "Edit Conversation" : "New Conversation"} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Title *" value={form.title} onChange={set("title")} placeholder="What was this conversation about?" autoFocus required />
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Source"
            value={form.source}
            onChange={set("source")}
            options={CONVERSATION_SOURCES.map((s) => ({ value: s, label: formatSource(s) }))}
          />
          <Input label="URL" value={form.url} onChange={set("url")} placeholder="Chat URL or link…" />
        </div>
        <Textarea label="Summary" value={form.summary} onChange={set("summary")} placeholder="Brief summary of key points…" rows={3} />
        <Textarea label="Transcript / Full Content" value={form.transcript} onChange={set("transcript")} placeholder="Paste the full transcript, chat export, or notes here…" rows={8} />
        <Textarea label="Notes" value={form.notes} onChange={set("notes")} placeholder="Personal notes about this conversation…" rows={2} />
        <div className="flex justify-end gap-2 pt-2">
          <Btn type="button" variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn type="submit" disabled={saving || !form.title.trim()}>
            {saving ? "Saving…" : initial.id ? "Save Changes" : "Save Conversation"}
          </Btn>
        </div>
      </form>
    </Modal>
  );
}
