"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/shared/Modal";
import { Input, Textarea, TagInput } from "@/components/shared/FormField";
import Btn from "@/components/shared/Btn";

interface Props {
  open: boolean;
  onClose: () => void;
  initial?: {
    id?: string;
    name?: string;
    company?: string;
    jobTitle?: string;
    email?: string;
    phone?: string;
    website?: string;
    linkedin?: string;
    notes?: string;
    tags?: string[];
  };
}

export default function PersonForm({ open, onClose, initial = {} }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: initial.name || "",
    company: initial.company || "",
    jobTitle: initial.jobTitle || "",
    email: initial.email || "",
    phone: initial.phone || "",
    website: initial.website || "",
    linkedin: initial.linkedin || "",
    notes: initial.notes || "",
    tags: initial.tags || [],
  });

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    const url = initial.id ? `/api/people/${initial.id}` : "/api/people";
    const res = await fetch(url, {
      method: initial.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    onClose();
    router.push(`/people/${data.id}`);
    router.refresh();
  };

  return (
    <Modal open={open} onClose={onClose} title={initial.id ? "Edit Person" : "New Person"} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Name *" value={form.name} onChange={set("name")} placeholder="Full name" autoFocus required />
          <Input label="Company" value={form.company} onChange={set("company")} placeholder="Company name" />
          <Input label="Job Title" value={form.jobTitle} onChange={set("jobTitle")} placeholder="Job title" />
          <Input label="Email" type="email" value={form.email} onChange={set("email")} placeholder="email@example.com" />
          <Input label="Phone" value={form.phone} onChange={set("phone")} placeholder="+1 555 000 0000" />
          <Input label="LinkedIn" value={form.linkedin} onChange={set("linkedin")} placeholder="linkedin.com/in/..." />
        </div>
        <Input label="Website" value={form.website} onChange={set("website")} placeholder="https://..." />
        <Textarea label="Notes" value={form.notes} onChange={set("notes")} placeholder="Notes about this person…" rows={3} />
        <TagInput label="Tags" value={form.tags} onChange={(tags) => setForm((f) => ({ ...f, tags }))} />
        <div className="flex justify-end gap-2 pt-2">
          <Btn type="button" variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn type="submit" disabled={saving || !form.name.trim()}>
            {saving ? "Saving…" : initial.id ? "Save Changes" : "Add Person"}
          </Btn>
        </div>
      </form>
    </Modal>
  );
}
