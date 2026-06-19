'use client'

export default function TopNav({ activeTab }: { activeTab?: string }) {
  const tabLabels: Record<string, string> = {
    'dashboard': 'Dashboard',
    'upload': 'Upload Transactions',
    'validation-center': 'Validation Center',
    'ai-insights': 'AI Insights',
    'processed-files': 'Processed Files',
    'reports': 'Reports',
    'country-rules': 'Country Rules',
    'settings': 'Settings',
  }

  const label = tabLabels[activeTab || 'dashboard']

  return (
    <header className="bg-white border-b border-gray-200 h-16 px-8 flex items-center justify-between shrink-0">
      <div className="flex flex-col justify-center">
        <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Xeno Platform</span>
        <h1 className="text-lg font-bold text-gray-900 leading-tight">{label}</h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-100 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-xs font-medium text-green-700">Connected</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-500">Data Ops Team</span>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            DO
          </div>
        </div>
      </div>
    </header>
  )
}
