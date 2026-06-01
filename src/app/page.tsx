import Link from "next/link";
import prisma from "@/lib/prisma";
import { timeAgo, entityIcon, entityPath, formatStatus, formatDate } from "@/lib/utils";
import { EntityType } from "@/lib/types";
import QuickCreate from "@/components/shared/QuickCreate";

async function getHomeData() {
  const [
    projectCount,
    ideaCount,
    personCount,
    conversationCount,
    knowledgeCount,
    assetCount,
    recentTimeline,
    recentProjects,
    recentIdeas,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.idea.count(),
    prisma.person.count(),
    prisma.conversation.count(),
    prisma.knowledge.count(),
    prisma.asset.count(),
    prisma.timelineEvent.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.project.findMany({ orderBy: { updatedAt: "desc" }, take: 4 }),
    prisma.idea.findMany({ orderBy: { updatedAt: "desc" }, take: 4 }),
  ]);

  return {
    counts: { projectCount, ideaCount, personCount, conversationCount, knowledgeCount, assetCount },
    recentTimeline,
    recentProjects,
    recentIdeas,
  };
}

const stats = [
  { label: "Projects", icon: "📁", key: "projectCount", href: "/projects" },
  { label: "Ideas", icon: "💡", key: "ideaCount", href: "/ideas" },
  { label: "People", icon: "👥", key: "personCount", href: "/people" },
  { label: "Conversations", icon: "💬", key: "conversationCount", href: "/conversations" },
  { label: "Knowledge", icon: "📚", key: "knowledgeCount", href: "/knowledge" },
  { label: "Assets", icon: "📦", key: "assetCount", href: "/assets" },
] as const;

export default async function HomePage() {
  const { counts, recentTimeline, recentProjects, recentIdeas } = await getHomeData();

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Good to see you.</h1>
        <p className="text-zinc-400 text-sm mt-1">Here&apos;s what&apos;s happening in your HQ.</p>
      </div>

      {/* Quick Create */}
      <section className="mb-8">
        <QuickCreate />
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-3 mb-8 sm:grid-cols-6">
        {stats.map((s) => (
          <Link
            key={s.key}
            href={s.href}
            className="flex flex-col items-center gap-1.5 p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors text-center"
          >
            <span className="text-2xl">{s.icon}</span>
            <span className="text-xl font-semibold text-white">
              {counts[s.key]}
            </span>
            <span className="text-xs text-zinc-500">{s.label}</span>
          </Link>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <section>
          <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-3">
            Recent Activity
          </h2>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            {recentTimeline.length === 0 ? (
              <p className="text-sm text-zinc-600 text-center py-4">No activity yet. Start by creating something.</p>
            ) : (
              <div className="relative">
                <div className="absolute left-[7px] top-0 bottom-0 w-px bg-zinc-800" />
                <div className="space-y-4">
                  {recentTimeline.map((event) => (
                    <div key={event.id} className="flex gap-3 pl-6 relative">
                      <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-zinc-500">
                          {entityIcon(event.entityType as EntityType)}{" "}
                        </span>
                        <span className="text-sm text-zinc-300">{event.description}</span>
                        <p className="text-xs text-zinc-500 mt-0.5">{timeAgo(event.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Recently Updated */}
        <section>
          <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-3">
            Recent Projects
          </h2>
          <div className="space-y-2 mb-4">
            {recentProjects.length === 0 ? (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <p className="text-sm text-zinc-600 text-center py-2">No projects yet.</p>
              </div>
            ) : recentProjects.map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors group"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-200 group-hover:text-white truncate">{p.title}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{formatDate(p.updatedAt)}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded border shrink-0 ml-2 ${
                  p.status === "ACTIVE" ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" :
                  p.status === "PAUSED" ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" :
                  p.status === "COMPLETED" ? "text-blue-400 bg-blue-400/10 border-blue-400/20" :
                  "text-zinc-400 bg-zinc-400/10 border-zinc-400/20"
                }`}>
                  {formatStatus(p.status)}
                </span>
              </Link>
            ))}
          </div>

          <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-3">
            Recent Ideas
          </h2>
          <div className="space-y-2">
            {recentIdeas.length === 0 ? (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <p className="text-sm text-zinc-600 text-center py-2">No ideas yet.</p>
              </div>
            ) : recentIdeas.map((i) => (
              <Link
                key={i.id}
                href={`/ideas/${i.id}`}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors group"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-200 group-hover:text-white truncate">{i.title}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{formatDate(i.updatedAt)}</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded border text-violet-400 bg-violet-400/10 border-violet-400/20 shrink-0 ml-2">
                  {formatStatus(i.status)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
