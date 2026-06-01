"use client";

import Link from "next/link";
import { entityIcon, entityPath } from "@/lib/utils";
import { EntityType } from "@/lib/types";

interface RelatedItem {
  id: string;
  title: string;
  subtitle?: string;
}

interface RelationshipGroup {
  type: EntityType;
  label: string;
  items: RelatedItem[];
}

interface Props {
  groups: RelationshipGroup[];
  onLink?: (type: EntityType) => void;
}

export default function RelationshipPanel({ groups, onLink }: Props) {
  const nonEmpty = groups.filter((g) => g.items.length > 0);

  if (!nonEmpty.length && !onLink) {
    return (
      <p className="text-sm text-zinc-500">No connections yet.</p>
    );
  }

  return (
    <div className="space-y-5">
      {groups.map((group) => (
        <div key={group.type}>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              {entityIcon(group.type)} {group.label}
            </h4>
            {onLink && (
              <button
                onClick={() => onLink(group.type)}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                + Link
              </button>
            )}
          </div>
          {group.items.length === 0 ? (
            <p className="text-xs text-zinc-600 italic">None linked</p>
          ) : (
            <div className="space-y-1">
              {group.items.map((item) => (
                <Link
                  key={item.id}
                  href={entityPath(group.type, item.id)}
                  className="block px-2.5 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors"
                >
                  <p className="text-sm text-zinc-200 truncate">{item.title}</p>
                  {item.subtitle && (
                    <p className="text-xs text-zinc-500 truncate">{item.subtitle}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
