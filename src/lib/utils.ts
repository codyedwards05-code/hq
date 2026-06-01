import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { EntityType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseTags(tags: string): string[] {
  try {
    return JSON.parse(tags);
  } catch {
    return [];
  }
}

export function stringifyTags(tags: string[]): string {
  return JSON.stringify(tags);
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function timeAgo(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diff = now.getTime() - then.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

export function entityIcon(type: EntityType): string {
  const icons: Record<EntityType, string> = {
    PROJECT: "📁",
    IDEA: "💡",
    PERSON: "👤",
    CONVERSATION: "💬",
    KNOWLEDGE: "📚",
    ASSET: "📦",
  };
  return icons[type];
}

export function entityPath(type: EntityType, id: string): string {
  const paths: Record<EntityType, string> = {
    PROJECT: `/projects/${id}`,
    IDEA: `/ideas/${id}`,
    PERSON: `/people/${id}`,
    CONVERSATION: `/conversations/${id}`,
    KNOWLEDGE: `/knowledge/${id}`,
    ASSET: `/assets/${id}`,
  };
  return paths[type];
}

export function entityLabel(type: EntityType): string {
  const labels: Record<EntityType, string> = {
    PROJECT: "Project",
    IDEA: "Idea",
    PERSON: "Person",
    CONVERSATION: "Conversation",
    KNOWLEDGE: "Knowledge",
    ASSET: "Asset",
  };
  return labels[type];
}

export const PROJECT_STATUSES = ["ACTIVE", "PAUSED", "COMPLETED", "ARCHIVED"] as const;
export const IDEA_STATUSES = ["IDEA", "RESEARCHING", "VALIDATING", "BUILDING", "ARCHIVED"] as const;
export const CONVERSATION_SOURCES = [
  "CHATGPT",
  "CLAUDE",
  "MEETING",
  "PHONE_CALL",
  "VOICE_MEMO",
  "TEXT_MESSAGE",
  "EMAIL",
  "OTHER",
] as const;
export const KNOWLEDGE_CATEGORIES = [
  "BUSINESS",
  "AI",
  "MARKETING",
  "SALES",
  "FAITH",
  "PERSONAL_DEVELOPMENT",
  "OPERATIONS",
  "TECHNOLOGY",
  "OTHER",
] as const;
export const ASSET_TYPES = [
  "DOCUMENT",
  "SPREADSHEET",
  "IMAGE",
  "VIDEO",
  "WEBSITE",
  "GITHUB_REPO",
  "PDF",
  "OTHER",
] as const;

export function statusColor(status: string): string {
  const colors: Record<string, string> = {
    ACTIVE: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    PAUSED: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    COMPLETED: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    ARCHIVED: "text-zinc-400 bg-zinc-400/10 border-zinc-400/20",
    IDEA: "text-violet-400 bg-violet-400/10 border-violet-400/20",
    RESEARCHING: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    VALIDATING: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    BUILDING: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  };
  return colors[status] || "text-zinc-400 bg-zinc-400/10 border-zinc-400/20";
}

export function formatStatus(status: string): string {
  return status
    .split("_")
    .map((w) => w[0] + w.slice(1).toLowerCase())
    .join(" ");
}

export function formatSource(source: string): string {
  const labels: Record<string, string> = {
    CHATGPT: "ChatGPT",
    CLAUDE: "Claude",
    MEETING: "Meeting",
    PHONE_CALL: "Phone Call",
    VOICE_MEMO: "Voice Memo",
    TEXT_MESSAGE: "Text Message",
    EMAIL: "Email",
    OTHER: "Other",
  };
  return labels[source] || source;
}
