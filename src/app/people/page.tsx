"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PageHeader from "@/components/shared/PageHeader";
import Btn from "@/components/shared/Btn";
import EmptyState from "@/components/shared/EmptyState";
import PersonForm from "@/components/people/PersonForm";
import { formatDate } from "@/lib/utils";

interface Person {
  id: string;
  name: string;
  company: string | null;
  jobTitle: string | null;
  email: string | null;
  updatedAt: string;
}

export default function PeoplePage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [showForm, setShowForm] = useState(false);

  const load = () => fetch("/api/people").then((r) => r.json()).then(setPeople);
  useEffect(() => { load(); }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <PageHeader
        title="People"
        subtitle={`${people.length} total`}
        action={<Btn onClick={() => setShowForm(true)}>+ New Person</Btn>}
      />

      {people.length === 0 ? (
        <EmptyState
          icon="👥"
          title="No people yet"
          description="Add the people you work with, learn from, and build with."
          action={<Btn onClick={() => setShowForm(true)}>+ New Person</Btn>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {people.map((person) => (
            <Link
              key={person.id}
              href={`/people/${person.id}`}
              className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-600/30 flex items-center justify-center text-indigo-400 font-semibold text-sm shrink-0">
                {person.name[0].toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-zinc-100 group-hover:text-white text-sm truncate">{person.name}</p>
                {(person.jobTitle || person.company) && (
                  <p className="text-xs text-zinc-500 truncate">
                    {[person.jobTitle, person.company].filter(Boolean).join(" @ ")}
                  </p>
                )}
                {person.email && <p className="text-xs text-zinc-600 truncate">{person.email}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}

      <PersonForm open={showForm} onClose={() => { setShowForm(false); load(); }} />
    </div>
  );
}
