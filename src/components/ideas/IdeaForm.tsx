"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/shared/Modal";
import { Input, Textarea, Select, TagInput } from "@/components/shared/FormField";
import Btn from "@/components/shared/Btn";
import { IDEA_STATUSES, formatStatus } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  initial?: {
    id?: string;
    title?: string;
    description?: string;
    problemSolved?: string;
    opportunity?: string;
    notes?: string;
    status?: string;
    tags?: string[];
  };
}

export default function IdeaForm({ open, onClose, initial = {} }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: initial.title || "",
    description: initial.description || "",
    problemSolved: initial.problemSolved || "",
    opportunity: initial.opportunity || "",
    notes: initial.notes || "",
    status: initial.status || "IDEA",
    tags: initial.tags || [],
  });

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    const url = initial.id ? `/api/ideas/${initial.id}` : "/api/ideas";
    const res = await fetch(url, {
      method: initial.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    onClose();
    router.push(`/ideas/${data.id}`);
    router.refresh();
  };

  return (
    <Modal open={open} onClose={onClose} title={initial.id ? "Edit Idea" : "New Idea"} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Title *" value={form.title} onChange={set("title")} placeholder="Idea name" autoFocus required />
        <Textarea label="Description" value={form.description} onChange={set("description")} placeholder="What is this idea?" rows={3} />
        <Textarea label="Problem Being Solved" value={form.problemSolved} onChange={set("problemSolved")} placeholder="What problem does this solve?" rows={2} />
        <Textarea label="Opportunity" value={form.opportunity} onChange={set("opportunity")} placeholder="What is the opportunity here?" rows={2} />
        <Select
          label="Status"
          value={form.status}
          onChange={set("status")}
          options={IDEA_STATUSES.map((s) => ({ value: s, label: formatStatus(s) }))}
        />
        <Textarea label="Notes" value={form.notes} onChange={set("notes")} placeholder="Any additional notes…" rows={2} />
        <TagInput label="Tags" value={form.tags} onChange={(tags) => setForm((f) => ({ ...f, tags }))} />
        <div className="flex justify-end gap-2 pt-2">
          <Btn type="button" variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn type="submit" disabled={saving || !form.title.trim()}>
            {saving ? "Saving…" : initial.id ? "Save Changes" : "Create Idea"}
          </Btn>
        </div>
      </form>
    </Modal>
  );
}
