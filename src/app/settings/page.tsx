export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold text-white mb-2">Settings</h1>
      <p className="text-sm text-zinc-400 mb-8">Manage your HQ configuration.</p>

      <div className="space-y-6">
        <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <h2 className="text-sm font-medium text-zinc-200 mb-1">About HQ</h2>
          <p className="text-sm text-zinc-500 mb-4">Your personal second brain. Organize every project, idea, conversation, and asset in your life.</p>
          <div className="text-xs text-zinc-600 space-y-1">
            <p>Version: 1.0.0</p>
            <p>Database: SQLite (local)</p>
            <p>Built with Next.js + Prisma</p>
          </div>
        </section>

        <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <h2 className="text-sm font-medium text-zinc-200 mb-1">Data</h2>
          <p className="text-sm text-zinc-500 mb-4">Your data is stored locally in a SQLite database at <code className="text-indigo-400 text-xs">prisma/dev.db</code>.</p>
          <div className="text-xs text-zinc-600">
            <p>Back up by copying the dev.db file.</p>
          </div>
        </section>

        <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <h2 className="text-sm font-medium text-zinc-200 mb-3">Coming Soon</h2>
          <ul className="space-y-2 text-sm text-zinc-500">
            {[
              "AI summaries and smart search",
              "Relationship graph visualization",
              "Voice notes",
              "Chrome extension",
              "Mobile app",
              "Calendar integration",
              "Claude / ChatGPT integration",
              "OCR document scanning",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <span className="text-zinc-700">·</span>
                {feature}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
