import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
}

const inputClass =
  "w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors";

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-zinc-400">{label}</label>
      <input {...props} className={cn(inputClass, error && "border-red-500", className)} />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function Textarea({ label, error, className, ...props }: TextareaProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-zinc-400">{label}</label>
      <textarea
        {...props}
        rows={props.rows || 4}
        className={cn(inputClass, "resize-none", error && "border-red-500", className)}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function Select({ label, options, error, className, ...props }: SelectProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-zinc-400">{label}</label>
      <select
        {...props}
        className={cn(inputClass, "cursor-pointer", error && "border-red-500", className)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-zinc-800">
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function TagInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (tags: string[]) => void;
}) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const v = (e.target as HTMLInputElement).value.trim();
      if (v && !value.includes(v)) {
        onChange([...value, v]);
        (e.target as HTMLInputElement).value = "";
      }
    }
    if (e.key === "Backspace" && !(e.target as HTMLInputElement).value && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-zinc-400">{label}</label>
      <div className="flex flex-wrap gap-1.5 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus-within:border-indigo-500 transition-colors min-h-[40px]">
        {value.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-zinc-700 text-zinc-200"
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((t) => t !== tag))}
              className="text-zinc-400 hover:text-zinc-200"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          placeholder={value.length ? "" : "Add tags…"}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-[80px] bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
        />
      </div>
      <p className="text-xs text-zinc-600">Press Enter or comma to add</p>
    </div>
  );
}
