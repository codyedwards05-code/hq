"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PageHeader from "@/components/shared/PageHeader";
import Btn from "@/components/shared/Btn";
import EmptyState from "@/components/shared/EmptyState";
import AssetForm from "@/components/assets/AssetForm";
import { formatDate, formatStatus } from "@/lib/utils";

interface Asset {
  id: string;
  title: string;
  description: string | null;
  type: string;
  url: string | null;
  updatedAt: string;
}

const TYPE_ICONS: Record<string, string> = {
  DOCUMENT: "📄",
  SPREADSHEET: "📊",
  IMAGE: "🖼️",
  VIDEO: "🎬",
  WEBSITE: "🌐",
  GITHUB_REPO: "💻",
  PDF: "📋",
  OTHER: "📦",
};

const TYPE_FILTERS = ["ALL", "DOCUMENT", "SPREADSHEET", "IMAGE", "VIDEO", "WEBSITE", "GITHUB_REPO", "PDF", "OTHER"];

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [showForm, setShowForm] = useState(false);

  const load = () => fetch("/api/assets").then((r) => r.json()).then(setAssets);
  useEffect(() => { load(); }, []);

  const filtered = filter === "ALL" ? assets : assets.filter((a) => a.type === filter);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <PageHeader
        title="Assets"
        subtitle={`${assets.length} total`}
        action={<Btn onClick={() => setShowForm(true)}>+ New Asset</Btn>}
      />

      <div className="flex gap-1.5 mb-6 flex-wrap">
        {TYPE_FILTERS.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filter === t ? "bg-indigo-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {t === "ALL" ? "All" : `${TYPE_ICONS[t]} ${formatStatus(t)}`}
          </button>
        ))}
      </div>

      {filtered.length === 0 && assets.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No assets yet"
          description="Track files, links, repos, and documents connected to your work."
          action={<Btn onClick={() => setShowForm(true)}>+ New Asset</Btn>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((asset) => (
            <Link
              key={asset.id}
              href={`/assets/${asset.id}`}
              className="flex items-start gap-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors group"
            >
              <span className="text-2xl shrink-0">{TYPE_ICONS[asset.type] || "📦"}</span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-zinc-100 group-hover:text-white text-sm truncate">{asset.title}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{formatStatus(asset.type)}</p>
                {asset.description && <p className="text-xs text-zinc-600 mt-1 line-clamp-2">{asset.description}</p>}
                {asset.url && <p className="text-xs text-indigo-400/70 mt-1 truncate">{asset.url}</p>}
                <p className="text-xs text-zinc-600 mt-1">{formatDate(asset.updatedAt)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <AssetForm open={showForm} onClose={() => { setShowForm(false); load(); }} />
    </div>
  );
}
