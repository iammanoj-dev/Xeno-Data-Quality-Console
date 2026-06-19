'use client'

import {
  LayoutDashboard,
  Upload,
  CheckCircle,
  Zap,
  FileText,
  BarChart3,
  Globe,
  Settings,
} from 'lucide-react'

interface SidebarProps {
  open?: boolean
  onToggle?: () => void
  activeTab?: string
  onTabChange?: (tab: string) => void
}

export default function Sidebar({ 
  open = true, 
  activeTab = 'dashboard',
  onTabChange = () => {}
}: SidebarProps) {
  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
    { label: 'Upload Transactions', icon: Upload, id: 'upload' },
    { label: 'Validation Center', icon: CheckCircle, id: 'validation-center' },
    { label: 'AI Insights', icon: Zap, id: 'ai-insights' },
    { label: 'Processed Files', icon: FileText, id: 'processed-files' },
    { label: 'Reports', icon: BarChart3, id: 'reports' },
    { label: 'Country Rules', icon: Globe, id: 'country-rules' },
    { label: 'Settings', icon: Settings, id: 'settings' },
  ]

  return (
    <aside
      className={`${
        open ? 'w-64' : 'w-20'
      } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col h-screen`}
    >
      {/* Header */}
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        {open && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">
              X
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm tracking-wide">XENO</div>
              <div className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase">Data Operations</div>
            </div>
          </div>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                active
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'
              }`}
              title={open ? '' : item.label}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-blue-600' : 'text-gray-500'}`} />
              {open && <span>{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      {open && (
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="text-[10px] text-gray-400 font-medium">Build 2026.02<br/>Internal Operations Console</div>
          </div>
        </div>
      )}
    </aside>
  )
}
