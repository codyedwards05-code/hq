"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/shared/Modal";
import { Input, Textarea, Select } from "@/components/shared/FormField";
import Btn from "@/components/shared/Btn";
import { ASSET_TYPES, formatStatus } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  initial?: {
    id?: string;
    title?: string;
    description?: string;
    type?: string;
    url?: string;
  };
}

export default function AssetForm({ open, onClose, initial = {} }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: initial.title || "",
    description: initial.description || "",
    type: initial.type || "OTHER",
    url: initial.url || "",
  });

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    const url = initial.id ? `/api/assets/${initial.id}` : "/api/assets";
    const res = await fetch(url, {
      method: initial.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    onClose();
    router.push(`/assets/${data.id}`);
    router.refresh();
  };

  return (
    <Modal open={open} onClose={onClose} title={initial.id ? "Edit Asset" : "New Asset"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Title *" value={form.title} onChange={set("title")} placeholder="Asset name" autoFocus required />
        <Select
          label="Type"
          value={form.type}
          onChange={set("type")}
          options={ASSET_TYPES.map((t) => ({ value: t, label: formatStatus(t) }))}
        />
        <Input label="URL / Link" value={form.url} onChange={set("url")} placeholder="https://..." />
        <Textarea label="Description" value={form.description} onChange={set("description")} placeholder="What is this asset?" rows={3} />
        <div className="flex justify-end gap-2 pt-2">
          <Btn type="button" variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn type="submit" disabled={saving || !form.title.trim()}>
            {saving ? "Saving…" : initial.id ? "Save Changes" : "Add Asset"}
          </Btn>
        </div>
      </form>
    </Modal>
  );
}
