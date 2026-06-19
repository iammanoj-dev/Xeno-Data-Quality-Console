'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle, Zap, Filter } from 'lucide-react'
import { useData } from '@/lib/data-context'

export default function ValidationCenter() {
  const [activeFilter, setActiveFilter] = useState('all')
  const { validationRules, toggleValidationRule } = useData();

  const filteredRules = validationRules.filter(rule => 
    activeFilter === 'all' ? true : rule.type === activeFilter
  );

  const stats = {
    total: validationRules.length,
    enabled: validationRules.filter(r => r.enabled).length,
    format: validationRules.filter(r => r.type === 'format' && r.enabled).length,
    data: validationRules.filter(r => r.type === 'date' && r.enabled).length,
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Validation Center</h2>
        <p className="text-xs text-gray-500">Configure validation rules for your transaction data. Changes apply to future uploads.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <p className="text-[10px] font-bold text-gray-500 tracking-wide uppercase mb-1">Total Rules</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <p className="text-[10px] font-bold text-gray-500 tracking-wide uppercase mb-1">Active Rules</p>
          <p className="text-3xl font-bold text-green-600">{stats.enabled}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <p className="text-[10px] font-bold text-gray-500 tracking-wide uppercase mb-1">Format Validators</p>
          <p className="text-3xl font-bold text-blue-600">{stats.format}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <p className="text-[10px] font-bold text-gray-500 tracking-wide uppercase mb-1">Data Validators</p>
          <p className="text-3xl font-bold text-blue-600">{stats.data}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <div className="flex gap-2">
              {['all', 'format', 'enum', 'unique', 'required', 'date', 'numeric'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                    activeFilter === filter
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-200 rounded text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors">
              Reset to Defaults
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700 transition-colors">
              Apply Validation Rules
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-600">
                <th className="px-6 py-4">Field</th>
                <th className="px-6 py-4">Validation Rule</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Enabled</th>
              </tr>
            </thead>
            <tbody>
              {filteredRules.map((rule) => (
                <tr key={rule.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{rule.field}</td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{rule.rule}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                      <Zap className="w-3 h-3" />
                      {rule.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {rule.enabled ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs font-bold">Active</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-400">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-xs font-bold">Inactive</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={rule.enabled}
                      onChange={() => toggleValidationRule(rule.id)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
              {filteredRules.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                    No rules found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
