'use client'

import { useState } from 'react'
import { Filter, Download, Eye } from 'lucide-react'

interface ValidationRow {
  id: string
  rowNumber: number
  fieldName: string
  errorType: 'error' | 'warning' | 'valid'
  errorDescription: string
  suggestedFix: string
}

export default function ValidationResults() {
  const [filterType, setFilterType] = useState<'all' | 'errors' | 'warnings' | 'valid'>('all')

  const validationData: ValidationRow[] = [
    {
      id: '1',
      rowNumber: 2451,
      fieldName: 'phone_number',
      errorType: 'error',
      errorDescription: 'Invalid phone format for India',
      suggestedFix: 'Phone must be 10 digits',
    },
    {
      id: '2',
      rowNumber: 3102,
      fieldName: 'order_id',
      errorType: 'error',
      errorDescription: 'Duplicate order found',
      suggestedFix: 'Remove duplicate entry or update order ID',
    },
    {
      id: '3',
      rowNumber: 3567,
      fieldName: 'payment_mode',
      errorType: 'warning',
      errorDescription: 'Missing payment mode',
      suggestedFix: 'Specify payment mode (Credit Card, Bank Transfer, etc.)',
    },
    {
      id: '4',
      rowNumber: 4201,
      fieldName: 'email',
      errorType: 'warning',
      errorDescription: 'Invalid email format',
      suggestedFix: 'Ensure email follows standard format (user@domain.com)',
    },
    {
      id: '5',
      rowNumber: 4856,
      fieldName: 'transaction_date',
      errorType: 'error',
      errorDescription: 'Invalid date format',
      suggestedFix: 'Date must be in YYYY-MM-DD format',
    },
    {
      id: '6',
      rowNumber: 5123,
      fieldName: 'amount',
      errorType: 'valid',
      errorDescription: 'Valid transaction amount',
      suggestedFix: 'No action required',
    },
  ]

  const filteredData = validationData.filter((item) => {
    if (filterType === 'all') return true
    if (filterType === 'errors') return item.errorType === 'error'
    if (filterType === 'warnings') return item.errorType === 'warning'
    if (filterType === 'valid') return item.errorType === 'valid'
    return true
  })

  const stats = {
    total: validationData.length,
    valid: validationData.filter((d) => d.errorType === 'valid').length,
    invalid: validationData.filter((d) => d.errorType === 'error').length,
    warnings: validationData.filter((d) => d.errorType === 'warning').length,
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total Rows</p>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Valid Rows</p>
          <p className="text-2xl font-bold text-success">{stats.valid}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Invalid Rows</p>
          <p className="text-2xl font-bold text-error">{stats.invalid}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Warnings</p>
          <p className="text-2xl font-bold text-warning">{stats.warnings}</p>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground hover:bg-gray-300'
              }`}
            >
              All Records
            </button>
            <button
              onClick={() => setFilterType('errors')}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                filterType === 'errors'
                  ? 'bg-error text-white'
                  : 'bg-red-50 text-error hover:bg-red-100'
              }`}
            >
              Errors Only ({stats.invalid})
            </button>
            <button
              onClick={() => setFilterType('warnings')}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                filterType === 'warnings'
                  ? 'bg-warning text-white'
                  : 'bg-yellow-50 text-warning hover:bg-yellow-100'
              }`}
            >
              Warnings Only ({stats.warnings})
            </button>
            <button
              onClick={() => setFilterType('valid')}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                filterType === 'valid'
                  ? 'bg-success text-white'
                  : 'bg-green-50 text-success hover:bg-green-100'
              }`}
            >
              Valid Only ({stats.valid})
            </button>
          </div>

          <div className="flex gap-2">
            <button className="px-3 py-2 border border-border rounded text-sm font-medium hover:bg-secondary transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
            <button className="px-3 py-2 border border-border rounded text-sm font-medium hover:bg-secondary transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary border-b border-border">
                <th className="px-4 py-3 text-left font-semibold text-foreground">Row Number</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Field Name</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Error Type</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Error Description</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Suggested Fix</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`border-b border-border hover:bg-secondary transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-foreground">{row.rowNumber}</td>
                    <td className="px-4 py-3 text-foreground">{row.fieldName}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap ${
                          row.errorType === 'error'
                            ? 'bg-red-50 text-red-700'
                            : row.errorType === 'warning'
                              ? 'bg-yellow-50 text-yellow-700'
                              : 'bg-green-50 text-green-700'
                        }`}
                      >
                        {row.errorType === 'error'
                          ? 'Error'
                          : row.errorType === 'warning'
                            ? 'Warning'
                            : 'Valid'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground max-w-xs">{row.errorDescription}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs max-w-xs">{row.suggestedFix}</td>
                    <td className="px-4 py-3">
                      <button className="p-1 hover:bg-secondary rounded transition-colors" aria-label="View details">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredData.length} of {stats.total} records
        </p>
        <div className="flex gap-2">
          <button className="px-3 py-2 border border-border rounded text-sm font-medium hover:bg-secondary transition-colors">
            Previous
          </button>
          <button className="px-3 py-2 bg-primary text-primary-foreground rounded text-sm font-medium">
            1
          </button>
          <button className="px-3 py-2 border border-border rounded text-sm font-medium hover:bg-secondary transition-colors">
            2
          </button>
          <button className="px-3 py-2 border border-border rounded text-sm font-medium hover:bg-secondary transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
