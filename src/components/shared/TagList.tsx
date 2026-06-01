import { parseTags } from "@/lib/utils";

export default function TagList({ tags }: { tags: string | string[] }) {
  const list = Array.isArray(tags) ? tags : parseTags(tags);
  if (!list.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {list.map((tag) => (
        <span
          key={tag}
          className="px-2 py-0.5 rounded-full text-xs bg-zinc-800 text-zinc-300 border border-zinc-700"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
