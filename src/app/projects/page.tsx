"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PageHeader from "@/components/shared/PageHeader";
import Btn from "@/components/shared/Btn";
import EmptyState from "@/components/shared/EmptyState";
import StatusBadge from "@/components/shared/StatusBadge";
import TagList from "@/components/shared/TagList";
import ProjectForm from "@/components/projects/ProjectForm";
import { formatDate } from "@/lib/utils";

interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string;
  tags: string;
  updatedAt: string;
}

const STATUS_FILTERS = ["ALL", "ACTIVE", "PAUSED", "COMPLETED", "ARCHIVED"];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [showForm, setShowForm] = useState(false);

  const load = () =>
    fetch("/api/projects")
      .then((r) => r.json())
      .then(setProjects);

  useEffect(() => { load(); }, []);

  const filtered = filter === "ALL" ? projects : projects.filter((p) => p.status === filter);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <PageHeader
        title="Projects"
        subtitle={`${projects.length} total`}
        action={<Btn onClick={() => setShowForm(true)}>+ New Project</Btn>}
      />

      {/* Status filter */}
      <div className="flex gap-1.5 mb-6 flex-wrap">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filter === s
                ? "bg-indigo-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {s === "ALL" ? "All" : s[0] + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {filtered.length === 0 && projects.length === 0 ? (
        <EmptyState
          icon="📁"
          title="No projects yet"
          description="Create your first project to start organizing your work."
          action={<Btn onClick={() => setShowForm(true)}>+ New Project</Btn>}
        />
      ) : filtered.length === 0 ? (
        <p className="text-zinc-500 text-sm">No projects with status &quot;{filter}&quot;.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="flex flex-col p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors group"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-zinc-100 group-hover:text-white text-sm leading-snug">{project.title}</h3>
                <StatusBadge status={project.status} />
              </div>
              {project.description && (
                <p className="text-xs text-zinc-500 mb-3 line-clamp-2 flex-1">{project.description}</p>
              )}
              <div className="mt-auto pt-2 flex items-center justify-between">
                <TagList tags={project.tags} />
                <span className="text-xs text-zinc-600 shrink-0 ml-2">{formatDate(project.updatedAt)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <ProjectForm open={showForm} onClose={() => { setShowForm(false); load(); }} />
    </div>
  );
}
