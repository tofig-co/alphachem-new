export default function Loading() {
  return (
    <div className="px-8 py-8 max-w-3xl animate-pulse">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-8 w-40 bg-slate-200 rounded-lg" />
        <div className="h-5 w-14 bg-slate-100 rounded-full" />
      </div>
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="h-3 w-24 bg-slate-200 rounded mb-5" />
            <div className="space-y-4">
              {['AZ', 'EN', 'RU'].map((l) => (
                <div key={l}>
                  <div className="h-3 w-6 bg-slate-200 rounded mb-2" />
                  <div className="h-28 bg-slate-100 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
