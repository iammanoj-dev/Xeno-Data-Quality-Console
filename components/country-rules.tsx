'use client'

import { useState } from 'react'
import { Edit2, Trash2, Plus, X, Save } from 'lucide-react'
import { useData } from '@/lib/data-context'
import { CountryRule } from '@/lib/processor'

export default function CountryRules() {
  const { countryRules, addCountryRule, updateCountryRule, deleteCountryRule } = useData()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const [formState, setFormState] = useState<Omit<CountryRule, 'id'>>({
    country: '',
    code: '',
    phone: 10,
    format: 'YYYY-MM-DD'
  })

  const handleSave = () => {
    if (!formState.country || !formState.code) return;
    
    if (editingId) {
      updateCountryRule(editingId, formState);
    } else {
      addCountryRule(formState);
    }
    
    setIsAdding(false);
    setEditingId(null);
    setFormState({ country: '', code: '', phone: 10, format: 'YYYY-MM-DD' });
  }

  const handleEdit = (rule: CountryRule) => {
    setFormState({
      country: rule.country,
      code: rule.code,
      phone: rule.phone,
      format: rule.format
    });
    setEditingId(rule.id);
    setIsAdding(true);
  }

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-lg font-bold text-gray-900">Country Rules</h2>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-gray-900">Country Validation Rules</h3>
            <p className="text-[11px] text-gray-500 mt-1">Configure phone length and date format per country</p>
          </div>
          <button 
            onClick={() => {
              setFormState({ country: '', code: '', phone: 10, format: 'YYYY-MM-DD' });
              setIsAdding(true);
              setEditingId(null);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Rule
          </button>
        </div>

        {isAdding && (
          <div className="p-5 border-b border-gray-100 bg-blue-50/50 flex items-center gap-4">
            <input 
              type="text" 
              placeholder="Country Name" 
              value={formState.country}
              onChange={(e) => setFormState({...formState, country: e.target.value})}
              className="px-3 py-1.5 border border-gray-300 rounded text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input 
              type="text" 
              placeholder="Code (e.g. US)" 
              value={formState.code}
              onChange={(e) => setFormState({...formState, code: e.target.value})}
              className="px-3 py-1.5 border border-gray-300 rounded text-sm w-24 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input 
              type="number" 
              placeholder="Phone Length" 
              value={formState.phone}
              onChange={(e) => setFormState({...formState, phone: parseInt(e.target.value) || 10})}
              className="px-3 py-1.5 border border-gray-300 rounded text-sm w-32 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input 
              type="text" 
              placeholder="Format (YYYY-MM-DD)" 
              value={formState.format}
              onChange={(e) => setFormState({...formState, format: e.target.value})}
              className="px-3 py-1.5 border border-gray-300 rounded text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={handleSave} className="bg-blue-600 text-white p-1.5 rounded hover:bg-blue-700 ml-auto">
              <Save className="w-4 h-4" />
            </button>
            <button onClick={() => setIsAdding(false)} className="bg-gray-200 text-gray-700 p-1.5 rounded hover:bg-gray-300">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        
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
              {countryRules.map((rule) => (
                <tr key={rule.id} className="border-b border-gray-100">
                  <td className="px-6 py-4 font-bold text-gray-900">{rule.country}</td>
                  <td className="px-6 py-4 font-medium text-gray-600">{rule.code}</td>
                  <td className="px-6 py-4 font-medium text-gray-600">{rule.phone}</td>
                  <td className="px-6 py-4 font-medium text-gray-600">{rule.format}</td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button onClick={() => handleEdit(rule)} className="text-gray-400 hover:text-blue-600">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteCountryRule(rule.id)} className="text-gray-400 hover:text-red-600">
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
