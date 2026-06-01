"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { entityIcon, entityLabel, formatStatus } from "@/lib/utils";
import { SearchResult } from "@/lib/types";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (query.length < 2) { setResults([]); return; }

    setLoading(true);
    timerRef.current = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);
      setLoading(false);
    }, 200);
  }, [query]);

  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    if (!acc[r.type]) acc[r.type] = [];
    acc[r.type].push(r);
    return acc;
  }, {});

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white mb-4">Search</h1>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search everything…"
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 text-sm placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors text-base"
          />
          {loading && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-500">Searching…</span>
          )}
        </div>
      </div>

      {query.length < 2 && (
        <div className="text-center py-10">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-sm text-zinc-500">Type at least 2 characters to search across all your projects, ideas, people, conversations, knowledge, and assets.</p>
        </div>
      )}

      {query.length >= 2 && results.length === 0 && !loading && (
        <div className="text-center py-10">
          <p className="text-4xl mb-3">🤷</p>
          <p className="text-sm text-zinc-500">No results for &quot;{query}&quot;</p>
        </div>
      )}

      {Object.entries(grouped).map(([type, items]) => (
        <div key={type} className="mb-6">
          <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
            {entityIcon(type as never)} {entityLabel(type as never)}
          </h3>
          <div className="space-y-1">
            {items.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors group"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-200 group-hover:text-white truncate">{item.title}</p>
                  {item.subtitle && (
                    <p className="text-xs text-zinc-500 truncate mt-0.5">{formatStatus(item.subtitle)}</p>
                  )}
                </div>
                <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0 ml-2">→</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
