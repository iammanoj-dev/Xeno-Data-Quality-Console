'use client'

import { Edit2, Trash2 } from 'lucide-react'

export default function CountryRules() {
  const rules = [
    { country: 'India', code: 'IN', phone: 10, format: 'YYYY-MM-DD' },
    { country: 'Singapore', code: 'SG', phone: 8, format: 'YYYY-MM-DD' },
    { country: 'UAE', code: 'AE', phone: 9, format: 'DD/MM/YYYY' },
    { country: 'USA', code: 'US', phone: 10, format: 'MM-DD-YYYY' },
    { country: 'UK', code: 'GB', phone: 10, format: 'DD/MM/YYYY' },
  ]

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-lg font-bold text-gray-900">Country Rules</h2>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-gray-900">Country Validation Rules</h3>
            <p className="text-[11px] text-gray-500 mt-1">Configure phone length and date format per country</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded flex items-center gap-2 transition-colors">
            + Add Rule
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs text-gray-600 font-bold">
                <th className="px-6 py-4">Country</th>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Phone Length</th>
                <th className="px-6 py-4">Date Format</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="px-6 py-4 font-bold text-gray-900">{rule.country}</td>
                  <td className="px-6 py-4 font-medium text-gray-600">{rule.code}</td>
                  <td className="px-6 py-4 font-medium text-gray-600">{rule.phone}</td>
                  <td className="px-6 py-4 font-medium text-gray-600">{rule.format}</td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button className="text-gray-400 hover:text-gray-600">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
