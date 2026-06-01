"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/projects", label: "Projects", icon: "📁" },
  { href: "/ideas", label: "Ideas", icon: "💡" },
  { href: "/people", label: "People", icon: "👥" },
  { href: "/conversations", label: "Conversations", icon: "💬" },
  { href: "/knowledge", label: "Knowledge", icon: "📚" },
  { href: "/assets", label: "Assets", icon: "📦" },
  { href: "/timeline", label: "Timeline", icon: "🗓" },
  { href: "/search", label: "Search", icon: "🔍" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] shrink-0 h-full flex flex-col border-r border-zinc-800 bg-zinc-950">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-zinc-800">
        <span className="text-lg font-semibold tracking-tight text-white">HQ</span>
        <p className="text-xs text-zinc-500 mt-0.5">Personal Headquarters</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {nav.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors",
                active
                  ? "bg-zinc-800 text-white font-medium"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
              )}
            >
              <span className="text-base leading-none">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-zinc-800">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors",
            pathname === "/settings"
              ? "bg-zinc-800 text-white font-medium"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
          )}
        >
          <span className="text-base leading-none">⚙</span>
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
