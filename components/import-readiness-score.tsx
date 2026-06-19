import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react'

export default function ImportReadinessScore() {
  const score = 94
  const readyForImport = true
  const issues = [
    { id: '1', type: 'error', label: '12 Invalid Phone Numbers' },
    { id: '2', type: 'error', label: '3 Duplicate Orders' },
    { id: '3', type: 'warning', label: '5 Missing Payment Modes' },
    { id: '4', type: 'warning', label: '8 Invalid Email Addresses' },
  ]

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success'
    if (score >= 75) return 'text-warning'
    return 'text-error'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-50'
    if (score >= 75) return 'bg-yellow-50'
    return 'bg-red-50'
  }

  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-success'
    if (score >= 75) return 'bg-warning'
    return 'bg-error'
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Import Readiness Score</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Score Section */}
        <div className={`${getScoreBgColor(score)} rounded-lg p-6 flex flex-col items-center justify-center`}>
          <div className="text-center">
            <div className={`text-5xl font-bold ${getScoreColor(score)} mb-2`}>{score}%</div>
            <p className="text-sm font-medium text-foreground">Import Readiness</p>
          </div>

          {/* Progress Ring */}
          <div className="mt-4 w-24 h-24 rounded-full border-4 border-gray-200 flex items-center justify-center relative">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className={getProgressColor(score)}
                strokeDasharray={`${(score / 100) * 282.7} 282.7`}
              />
            </svg>
          </div>
        </div>

        {/* Ready for Import Section */}
        <div className={`${readyForImport ? 'bg-green-50' : 'bg-red-50'} rounded-lg p-6 flex flex-col justify-between`}>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Ready for Import</p>
            <div className="flex items-center gap-2 mb-4">
              {readyForImport ? (
                <>
                  <CheckCircle className="w-6 h-6 text-success" />
                  <span className="text-2xl font-bold text-success">YES</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-6 h-6 text-error" />
                  <span className="text-2xl font-bold text-error">NO</span>
                </>
              )}
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {readyForImport
              ? 'Dataset meets quality standards and is ready for processing'
              : 'Resolve critical errors before import'}
          </div>
        </div>

        {/* Issues Summary Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <p className="text-sm font-medium text-muted-foreground mb-4">Issues Found</p>
          <div className="space-y-2">
            {issues.slice(0, 3).map((issue) => (
              <div key={issue.id} className="flex items-start gap-2">
                {issue.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-error mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                )}
                <span className="text-xs text-foreground">{issue.label}</span>
              </div>
            ))}
            {issues.length > 3 && (
              <p className="text-xs text-muted-foreground mt-2">+{issues.length - 3} more issues</p>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Issues Table */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-4">Detailed Issues</h4>
        <div className="overflow-x-auto border border-border rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary border-b border-border">
                <th className="px-4 py-3 text-left font-semibold text-foreground">Type</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Issue</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Count</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Severity</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue, index) => {
                const count = parseInt(issue.label.match(/\d+/)?.[0] || '0')
                return (
                  <tr key={issue.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3">
                      {issue.type === 'error' ? (
                        <AlertCircle className="w-4 h-4 text-error" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-warning" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-foreground">{issue.label}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{count}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-1 rounded text-xs font-medium ${
                          issue.type === 'error'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-yellow-50 text-yellow-700'
                        }`}
                      >
                        {issue.type === 'error' ? 'Critical' : 'Warning'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-3">
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded font-medium text-sm hover:bg-primary/90 transition-colors">
          Export Validation Report
        </button>
        <button className="px-4 py-2 border border-border text-foreground rounded font-medium text-sm hover:bg-secondary transition-colors">
          View Detailed Analysis
        </button>
        <button className="px-4 py-2 border border-border text-foreground rounded font-medium text-sm hover:bg-secondary transition-colors">
          Download Cleaned Data
        </button>
      </div>
    </div>
  )
}
