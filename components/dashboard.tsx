'use client'

import { FileIcon, Database, AlertTriangle, Phone, Calendar, Gauge } from 'lucide-react'
import { useData } from '@/lib/data-context'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#EF4444', '#F59E0B', '#06B6D4', '#6366F1'];

export default function Dashboard() {
  const { aggregatedStats, files } = useData();

  const kpis = [
    { title: 'TOTAL FILES', value: aggregatedStats.totalFiles.toString(), icon: FileIcon, iconColor: 'text-blue-500', bgColor: 'bg-blue-50' },
    { title: 'RECORDS PROCESSED', value: aggregatedStats.recordsProcessed.toLocaleString(), icon: Database, iconColor: 'text-blue-500', bgColor: 'bg-blue-50' },
    { title: 'VALIDATION ERRORS', value: aggregatedStats.totalErrors.toLocaleString(), icon: AlertTriangle, iconColor: 'text-red-500', bgColor: 'bg-red-50' },
    { title: 'INVALID PHONES', value: (aggregatedStats.errorStats['Invalid Phone'] || 0).toLocaleString(), icon: Phone, iconColor: 'text-amber-500', bgColor: 'bg-amber-50' },
    { title: 'INVALID DATES', value: (aggregatedStats.errorStats['Invalid Date'] || 0).toLocaleString(), icon: Calendar, iconColor: 'text-blue-500', bgColor: 'bg-blue-50' },
    { title: 'AVG QUALITY SCORE', value: aggregatedStats.avgQualityScore.toString(), icon: Gauge, iconColor: 'text-emerald-500', bgColor: 'bg-emerald-50', sub: 'out of 100' },
  ]

  // Prepare data for charts
  const errorTypeData = Object.entries(aggregatedStats.errorStats)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const countryData = Object.entries(aggregatedStats.countryStats)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const dailyUploadsData = Object.entries(aggregatedStats.dailyUploads)
    .map(([date, uploads]) => ({ date, uploads }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const qualityTrendData = files.slice().reverse().map((f) => ({
    name: f.name.substring(0, 10) + '...',
    quality: f.qualityScore
  }));

  return (
    <div className="p-8 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon
          return (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold text-gray-500 tracking-wider">{kpi.title}</span>
                <div className={`p-1.5 rounded-md ${kpi.bgColor}`}>
                  <Icon className={`w-4 h-4 ${kpi.iconColor}`} />
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{kpi.value}</div>
                {kpi.sub && <div className="text-xs text-gray-500 mt-1">{kpi.sub}</div>}
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Validation Errors by Type */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-sm text-gray-900">Validation Errors by Type</h3>
            <p className="text-xs text-gray-500 mt-1">Aggregated across all uploads</p>
          </div>
          <div className="p-6 h-[320px] w-full">
            {errorTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={errorTypeData} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6B7280' }} angle={-30} textAnchor="end" />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6B7280' }} />
                  <RechartsTooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '12px' }} />
                  <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">No errors detected yet</div>
            )}
          </div>
        </div>

        {/* Country-wise Records */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-sm text-gray-900">Country-wise Records</h3>
            <p className="text-xs text-gray-500 mt-1">Distribution by country</p>
          </div>
          <div className="p-6 h-[320px] w-full">
            {countryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={countryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                    style={{ fontSize: '11px', fontWeight: 'bold' }}
                  >
                    {countryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">No data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Upload Trend */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-sm text-gray-900">Daily Upload Trend</h3>
            <p className="text-xs text-gray-500 mt-1">Number of files uploaded per day</p>
          </div>
          <div className="p-6 h-[320px] w-full">
             {dailyUploadsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyUploadsData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6B7280' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6B7280' }} allowDecimals={false} />
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="uploads" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, fill: '#fff', stroke: '#3B82F6', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">No uploads yet</div>
            )}
          </div>
        </div>

        {/* Data Quality Trend */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-sm text-gray-900">Recent Quality Scores</h3>
            <p className="text-xs text-gray-500 mt-1">Quality score of recently uploaded files</p>
          </div>
          <div className="p-6 h-[320px] w-full">
             {qualityTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={qualityTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6B7280' }} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6B7280' }} />
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="quality" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#fff', stroke: '#10B981', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">No data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
