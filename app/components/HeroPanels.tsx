import type { Calendar } from "lucide-react";

export function FactCell({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex items-start gap-2.5 px-3 py-3 sm:px-4">
      <Icon className="h-4 w-4 shrink-0 mt-0.5 text-gray-300" />
      <div className="min-w-0">
        <div className="truncate text-[10px] font-semibold uppercase tracking-wide text-gray-300">{label}</div>
        <div className="text-xs sm:text-sm font-bold text-white leading-snug">{value}</div>
        {sub && <div className="text-[11px] font-medium text-gray-300 leading-snug">{sub}</div>}
      </div>
    </div>
  );
}

export function StatPanel({
  title,
  live,
  rows,
}: {
  title: string;
  live?: boolean;
  rows: { label: string; value: string }[];
}) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-4">
      <div className="mb-2 flex items-center gap-2">
        {live && (
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
        )}
        <div className="text-xs font-bold uppercase tracking-wide text-gray-200">{title}</div>
      </div>
      <div className="divide-y divide-white/10">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between py-1.5 text-sm">
            <span className="text-gray-300">{row.label}</span>
            <span className="font-bold tabular-nums text-white">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
