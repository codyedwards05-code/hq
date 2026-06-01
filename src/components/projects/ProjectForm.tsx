"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/shared/Modal";
import { Input, Textarea, Select, TagInput } from "@/components/shared/FormField";
import Btn from "@/components/shared/Btn";
import { PROJECT_STATUSES, formatStatus } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  initial?: {
    id?: string;
    title?: string;
    description?: string;
    status?: string;
    notes?: string;
    tags?: string[];
  };
}

export default function ProjectForm({ open, onClose, initial = {} }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: initial.title || "",
    description: initial.description || "",
    status: initial.status || "ACTIVE",
    notes: initial.notes || "",
    tags: initial.tags || [],
  });

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);

    const url = initial.id ? `/api/projects/${initial.id}` : "/api/projects";
    const method = initial.id ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    onClose();
    router.push(`/projects/${data.id}`);
    router.refresh();
  };

  return (
    <Modal open={open} onClose={onClose} title={initial.id ? "Edit Project" : "New Project"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Title *" value={form.title} onChange={set("title")} placeholder="Project name" autoFocus required />
        <Textarea label="Description" value={form.description} onChange={set("description")} placeholder="What is this project about?" rows={3} />
        <Select
          label="Status"
          value={form.status}
          onChange={set("status")}
          options={PROJECT_STATUSES.map((s) => ({ value: s, label: formatStatus(s) }))}
        />
        <Textarea label="Notes" value={form.notes} onChange={set("notes")} placeholder="Any initial notes…" rows={2} />
        <TagInput label="Tags" value={form.tags} onChange={(tags) => setForm((f) => ({ ...f, tags }))} />
        <div className="flex justify-end gap-2 pt-2">
          <Btn type="button" variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn type="submit" disabled={saving || !form.title.trim()}>
            {saving ? "Saving…" : initial.id ? "Save Changes" : "Create Project"}
          </Btn>
        </div>
      </form>
    </Modal>
  );
}
