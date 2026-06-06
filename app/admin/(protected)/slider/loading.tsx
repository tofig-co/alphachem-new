export default function Loading() {
  return (
    <div className="px-8 py-8 max-w-3xl animate-pulse">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-8 w-24 bg-slate-200 rounded-lg" />
        <div className="h-5 w-14 bg-slate-100 rounded-full" />
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="h-3 w-20 bg-slate-200 rounded mb-4" />
        <div className="h-10 bg-slate-100 rounded-lg mb-4" />
        <div className="h-9 w-32 bg-slate-200 rounded-lg" />
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b border-slate-100 last:border-0">
            <div className="w-32 h-20 bg-slate-200 rounded-lg shrink-0" />
            <div className="flex-1 flex gap-4">
              <div className="h-9 w-20 bg-slate-100 rounded-lg" />
              <div className="h-5 w-16 bg-slate-100 rounded mt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
