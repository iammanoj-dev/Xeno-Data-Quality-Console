'use client'

import { useState } from 'react'
import { Save, Bell, Lock, Palette, Database } from 'lucide-react'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Settings</h2>
        <p className="text-xs text-gray-500">Configure application preferences and options</p>
      </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-border">
          {[
            { id: 'general', label: 'General', icon: Palette },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'data', label: 'Data & Privacy', icon: Database },
            { id: 'security', label: 'Security', icon: Lock }
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Organization</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Organization Name</label>
                  <input
                    type="text"
                    defaultValue="Acme Corp"
                    className="w-full px-3 py-2 border border-border rounded-lg text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Default Time Zone</label>
                  <select className="w-full px-3 py-2 border border-border rounded-lg text-foreground">
                    <option>UTC</option>
                    <option>America/New_York</option>
                    <option>Europe/London</option>
                    <option>Asia/Kolkata</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Date Format</label>
                  <select className="w-full px-3 py-2 border border-border rounded-lg text-foreground">
                    <option>YYYY-MM-DD</option>
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Validation Defaults</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
                  <span className="text-foreground">Enable strict validation by default</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
                  <span className="text-foreground">Auto-detect country from data</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-primary" />
                  <span className="text-foreground">Allow partial matches in validation</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Email Notifications</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
                  <div>
                    <p className="font-medium text-foreground">Validation Complete</p>
                    <p className="text-sm text-muted-foreground">Notify when validation processing finishes</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
                  <div>
                    <p className="font-medium text-foreground">Critical Issues</p>
                    <p className="text-sm text-muted-foreground">Alert on critical validation failures</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-primary" />
                  <div>
                    <p className="font-medium text-foreground">Daily Summary</p>
                    <p className="text-sm text-muted-foreground">Receive daily processing summary</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Alert Thresholds</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Alert if error rate exceeds (%):
                  </label>
                  <input
                    type="number"
                    defaultValue={10}
                    className="w-full px-3 py-2 border border-border rounded-lg text-foreground"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data & Privacy */}
        {activeTab === 'data' && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Data Retention</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Auto-delete processed files after (days):
                  </label>
                  <input
                    type="number"
                    defaultValue={90}
                    className="w-full px-3 py-2 border border-border rounded-lg text-foreground"
                  />
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-primary" />
                  <span className="text-foreground">Archive instead of delete</span>
                </label>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Privacy</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
                  <span className="text-foreground">Allow analytics tracking</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-primary" />
                  <span className="text-foreground">Share usage data for improvements</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
                  <span className="text-foreground">Enable encryption at rest</span>
                </label>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Danger Zone</h2>
              <button className="px-6 py-2 bg-error text-white rounded-lg hover:opacity-90 transition-opacity">
                Export All Data (GDPR)
              </button>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Session Management</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Session timeout (minutes):
                  </label>
                  <input
                    type="number"
                    defaultValue={30}
                    className="w-full px-3 py-2 border border-border rounded-lg text-foreground"
                  />
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
                  <span className="text-foreground">Require re-authentication for sensitive operations</span>
                </label>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">API Keys</h2>
              <p className="text-muted-foreground mb-4">Manage API keys for programmatic access</p>
              <button className="px-6 py-2 border border-border rounded-lg text-foreground hover:bg-secondary transition-colors">
                Generate New API Key
              </button>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Last login: Today at 2:34 PM</p>
                <p className="text-sm text-muted-foreground">Last password change: 30 days ago</p>
                <p className="text-sm text-muted-foreground">Active sessions: 2</p>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex items-center gap-3 mt-8">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
          {saved && (
            <span className="text-success text-sm font-medium">✓ Changes saved successfully</span>
          )}
        </div>
      </div>
  )
}
