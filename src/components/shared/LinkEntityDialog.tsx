"use client";

import { useEffect, useState } from "react";
import Modal from "./Modal";
import { entityLabel, entityIcon } from "@/lib/utils";
import { EntityType } from "@/lib/types";

interface EntityItem {
  id: string;
  title: string;
  subtitle?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  sourceType: EntityType;
  sourceId: string;
  targetType: EntityType;
  onLinked: () => void;
}

const FETCH_PATHS: Record<EntityType, string> = {
  PROJECT: "/api/projects",
  IDEA: "/api/ideas",
  PERSON: "/api/people",
  CONVERSATION: "/api/conversations",
  KNOWLEDGE: "/api/knowledge",
  ASSET: "/api/assets",
};

export default function LinkEntityDialog({
  open,
  onClose,
  sourceType,
  sourceId,
  targetType,
  onLinked,
}: Props) {
  const [items, setItems] = useState<EntityItem[]>([]);
  const [query, setQuery] = useState("");
  const [linking, setLinking] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    fetch(FETCH_PATHS[targetType])
      .then((r) => r.json())
      .then((data) => {
        setItems(
          data.map((d: Record<string, string>) => ({
            id: d.id,
            title: d.title || d.name || "",
            subtitle: d.description || d.company || d.category || "",
          }))
        );
      });
  }, [open, targetType]);

  const filtered = items.filter(
    (i) =>
      i.title.toLowerCase().includes(query.toLowerCase()) ||
      (i.subtitle || "").toLowerCase().includes(query.toLowerCase())
  );

  const handleLink = async (targetId: string) => {
    setLinking(targetId);
    await fetch(`/api/${FETCH_PATHS[sourceType].split("/api/")[1]}/${sourceId}/links`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetType, targetId }),
    });
    setLinking(null);
    onLinked();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Link ${entityIcon(targetType)} ${entityLabel(targetType)}`}
    >
      <input
        type="text"
        placeholder={`Search ${entityLabel(targetType).toLowerCase()}s…`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 mb-3"
        autoFocus
      />
      <div className="space-y-1 max-h-72 overflow-y-auto">
        {filtered.length === 0 && (
          <p className="text-sm text-zinc-500 text-center py-4">No results</p>
        )}
        {filtered.map((item) => (
          <button
            key={item.id}
            onClick={() => handleLink(item.id)}
            disabled={linking === item.id}
            className="w-full text-left px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-colors"
          >
            <p className="text-sm text-zinc-200">{item.title}</p>
            {item.subtitle && (
              <p className="text-xs text-zinc-500 truncate">{item.subtitle}</p>
            )}
          </button>
        ))}
      </div>
    </Modal>
  );
}
