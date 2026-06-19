'use client'

import { useState } from 'react'
import Sidebar from '@/components/sidebar'
import TopNav from '@/components/top-nav'
import Dashboard from '@/components/dashboard'
import FileUploadModule from '@/components/file-upload-module'
import ValidationCenter from '@/components/validation-center'
import AIInsights from '@/components/ai-insights'
import ProcessedFiles from '@/components/processed-files'
import Reports from '@/components/reports'
import CountryRules from '@/components/country-rules'
import Settings from '@/components/settings'

export default function RootPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'upload':
        return <FileUploadModule />
      case 'validation-center':
        return <ValidationCenter />
      case 'ai-insights':
        return <AIInsights />
      case 'processed-files':
        return <ProcessedFiles />
      case 'reports':
        return <Reports />
      case 'country-rules':
        return <CountryRules />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        open={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav activeTab={activeTab} />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
