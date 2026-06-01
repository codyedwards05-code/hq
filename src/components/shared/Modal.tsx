"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export default function Modal({ open, onClose, title, children, size = "md" }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const sizeClass = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
  }[size];

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        className={cn(
          "w-full bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl",
          sizeClass
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-200 text-xl leading-none transition-colors"
          >
            ×
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}
