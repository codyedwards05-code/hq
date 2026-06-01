import { cn, statusColor, formatStatus } from "@/lib/utils";

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
        statusColor(status)
      )}
    >
      {formatStatus(status)}
    </span>
  );
}
