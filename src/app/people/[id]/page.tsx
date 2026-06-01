"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import TagList from "@/components/shared/TagList";
import TimelineView from "@/components/shared/TimelineView";
import RelationshipPanel from "@/components/shared/RelationshipPanel";
import LinkEntityDialog from "@/components/shared/LinkEntityDialog";
import PersonForm from "@/components/people/PersonForm";
import Btn from "@/components/shared/Btn";
import { parseTags, formatDate } from "@/lib/utils";
import { EntityType, TimelineEvent } from "@/lib/types";

interface Person {
  id: string;
  name: string;
  company: string | null;
  jobTitle: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  linkedin: string | null;
  notes: string | null;
  tags: string;
  createdAt: string;
  updatedAt: string;
  projects: { project: { id: string; title: string; status: string } }[];
  ideas: { idea: { id: string; title: string; status: string } }[];
  conversations: { conversation: { id: string; title: string; source: string } }[];
}

const TABS = ["Overview", "Relationships", "Timeline"] as const;
type Tab = typeof TABS[number];

export default function PersonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [person, setPerson] = useState<Person | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [tab, setTab] = useState<Tab>("Overview");
  const [editing, setEditing] = useState(false);
  const [linkType, setLinkType] = useState<EntityType | null>(null);

  const load = useCallback(() => {
    fetch(`/api/people/${id}`).then((r) => r.json()).then(setPerson);
    fetch(`/api/timeline?entityType=PERSON&entityId=${id}`).then((r) => r.json()).then(setTimeline);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    if (!confirm("Delete this person?")) return;
    await fetch(`/api/people/${id}`, { method: "DELETE" });
    router.push("/people");
  };

  if (!person) return <div className="p-8 text-zinc-500">Loading…</div>;

  const groups = [
    { type: "PROJECT" as EntityType, label: "Projects", items: person.projects.map((r) => ({ id: r.project.id, title: r.project.title, subtitle: r.project.status })) },
    { type: "IDEA" as EntityType, label: "Ideas", items: person.ideas.map((r) => ({ id: r.idea.id, title: r.idea.title, subtitle: r.idea.status })) },
    { type: "CONVERSATION" as EntityType, label: "Conversations", items: person.conversations.map((r) => ({ id: r.conversation.id, title: r.conversation.title, subtitle: r.conversation.source })) },
  ];

  const contactFields = [
    { label: "Email", value: person.email, href: person.email ? `mailto:${person.email}` : undefined },
    { label: "Phone", value: person.phone, href: person.phone ? `tel:${person.phone}` : undefined },
    { label: "Website", value: person.website, href: person.website || undefined },
    { label: "LinkedIn", value: person.linkedin, href: person.linkedin || undefined },
  ].filter((f) => f.value);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 text-xs text-zinc-500 mb-5">
        <Link href="/people" className="hover:text-zinc-300">People</Link>
        <span>/</span>
        <span className="text-zinc-300">{person.name}</span>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-indigo-600/20 border border-indigo-600/30 flex items-center justify-center text-indigo-400 font-semibold text-xl">
            {person.name[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">{person.name}</h1>
            {(person.jobTitle || person.company) && (
              <p className="text-sm text-zinc-400 mt-0.5">
                {[person.jobTitle, person.company].filter(Boolean).join(" @ ")}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-4">
          <Btn variant="secondary" size="sm" onClick={() => setEditing(true)}>Edit</Btn>
          <Btn variant="danger" size="sm" onClick={handleDelete}>Delete</Btn>
        </div>
      </div>

      <div className="flex gap-1 mb-6 border-b border-zinc-800">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${tab === t ? "border-indigo-500 text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {contactFields.length > 0 && (
              <div>
                <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">Contact</h3>
                <div className="space-y-2">
                  {contactFields.map((f) => (
                    <div key={f.label} className="flex items-center gap-3">
                      <span className="text-xs text-zinc-500 w-16">{f.label}</span>
                      {f.href ? (
                        <a href={f.href} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-400 hover:text-indigo-300">
                          {f.value}
                        </a>
                      ) : (
                        <span className="text-sm text-zinc-300">{f.value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {person.notes && (
              <div>
                <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Notes</h3>
                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{person.notes}</p>
              </div>
            )}
            <TagList tags={person.tags} />
            <div className="text-xs text-zinc-500">Added {formatDate(person.createdAt)}</div>
          </div>
          <div>
            <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">Connections</h3>
            <RelationshipPanel groups={groups} onLink={(type) => setLinkType(type)} />
          </div>
        </div>
      )}

      {tab === "Relationships" && <RelationshipPanel groups={groups} onLink={(type) => setLinkType(type)} />}
      {tab === "Timeline" && <TimelineView events={timeline} />}

      <PersonForm
        open={editing}
        onClose={() => { setEditing(false); load(); }}
        initial={{ id: person.id, name: person.name, company: person.company || "", jobTitle: person.jobTitle || "", email: person.email || "", phone: person.phone || "", website: person.website || "", linkedin: person.linkedin || "", notes: person.notes || "", tags: parseTags(person.tags) }}
      />

      {linkType && (
        <LinkEntityDialog open={true} onClose={() => setLinkType(null)} sourceType="PERSON" sourceId={person.id} targetType={linkType} onLinked={load} />
      )}
    </div>
  );
}
