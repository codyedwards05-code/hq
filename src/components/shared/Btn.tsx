import { cn } from "@/lib/utils";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
}

export default function Btn({
  variant = "primary",
  size = "md",
  className,
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
        variant === "primary" &&
          "bg-indigo-600 hover:bg-indigo-500 text-white",
        variant === "secondary" &&
          "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700",
        variant === "ghost" &&
          "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800",
        variant === "danger" &&
          "bg-red-900/50 hover:bg-red-900 text-red-400 border border-red-800",
        className
      )}
    />
  );
}
