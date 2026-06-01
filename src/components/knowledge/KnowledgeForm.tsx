"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/shared/Modal";
import { Input, Textarea, Select, TagInput } from "@/components/shared/FormField";
import Btn from "@/components/shared/Btn";
import { KNOWLEDGE_CATEGORIES, formatStatus } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  initial?: {
    id?: string;
    title?: string;
    content?: string;
    category?: string;
    tags?: string[];
  };
}

export default function KnowledgeForm({ open, onClose, initial = {} }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: initial.title || "",
    content: initial.content || "",
    category: initial.category || "OTHER",
    tags: initial.tags || [],
  });

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    const url = initial.id ? `/api/knowledge/${initial.id}` : "/api/knowledge";
    const res = await fetch(url, {
      method: initial.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    onClose();
    router.push(`/knowledge/${data.id}`);
    router.refresh();
  };

  return (
    <Modal open={open} onClose={onClose} title={initial.id ? "Edit Knowledge" : "New Knowledge Note"} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Title *" value={form.title} onChange={set("title")} placeholder="What did you learn?" autoFocus required />
        <Select
          label="Category"
          value={form.category}
          onChange={set("category")}
          options={KNOWLEDGE_CATEGORIES.map((c) => ({ value: c, label: formatStatus(c) }))}
        />
        <Textarea label="Content *" value={form.content} onChange={set("content")} placeholder="Write out your knowledge, lesson, or insight…" rows={8} required />
        <TagInput label="Tags" value={form.tags} onChange={(tags) => setForm((f) => ({ ...f, tags }))} />
        <div className="flex justify-end gap-2 pt-2">
          <Btn type="button" variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn type="submit" disabled={saving || !form.title.trim()}>
            {saving ? "Saving…" : initial.id ? "Save Changes" : "Save Note"}
          </Btn>
        </div>
      </form>
    </Modal>
  );
}
