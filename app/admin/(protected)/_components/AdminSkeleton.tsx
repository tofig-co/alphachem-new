interface Props {
  rows?: number
  showButton?: boolean
}

export function AdminSkeleton({ rows = 5, showButton = true }: Props) {
  return (
    <div className="px-8 py-8 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-40 bg-slate-200 rounded-lg" />
          <div className="h-5 w-10 bg-slate-100 rounded-full" />
        </div>
        {showButton && <div className="h-9 w-32 bg-slate-200 rounded-lg" />}
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-10 bg-slate-50 border-b border-slate-200" />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3.5 border-b border-slate-100 last:border-0">
            <div className="h-4 bg-slate-200 rounded flex-1" />
            <div className="h-4 w-24 bg-slate-100 rounded" />
            <div className="h-5 w-14 bg-slate-100 rounded-full" />
            <div className="h-4 w-8 bg-slate-100 rounded" />
            <div className="h-4 w-16 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
