'use client'

import { FileText, Download } from 'lucide-react'
import { useData } from '@/lib/data-context'

export default function Reports() {
  const { files, downloadCSV, aggregatedStats } = useData();

  const groupedFiles = Object.values(files.reduce((acc: Record<string, any>, file) => {
    const baseName = file.name.replace(/_part\d+\.csv$/, '.csv');
    if (!acc[baseName]) {
      acc[baseName] = {
        id: file.id,
        name: baseName,
        processedAt: file.processedAt,
        totalRecords: 0,
        validRecordsCount: 0,
        qualityScore: 0,
        errorStats: {},
        errors: [],
        chunkCount: 0
      };
    }
    const group = acc[baseName];
    group.totalRecords += file.totalRecords;
    group.validRecordsCount += file.validRecordsCount;
    group.errors.push(...file.errors);
    group.chunkCount += 1;
    
    Object.entries(file.errorStats).forEach(([k, v]) => {
      group.errorStats[k] = (group.errorStats[k] || 0) + (v as number);
    });

    return acc;
  }, {})).map((group: any) => ({
    ...group,
    qualityScore: group.totalRecords === 0 ? 0 : Number(((group.validRecordsCount / group.totalRecords) * 100).toFixed(1))
  }));

  const handleExportValidation = () => {
    const data = Object.entries(aggregatedStats.errorStats).map(([type, count]) => ({
      'Error Type': type,
      'Total Occurrences': count
    }));
    downloadCSV(data, 'validation_report.csv');
  };

  const handleExportQuality = () => {
    const data = groupedFiles.map((f: any) => ({
      'File Name': f.name,
      'Quality Score': `${f.qualityScore}%`,
      'Valid Records': f.validRecordsCount,
      'Invalid Records': f.totalRecords - f.validRecordsCount
    }));
    downloadCSV(data, 'quality_report.csv');
  };

  const handleExportCountry = () => {
    const data = Object.entries(aggregatedStats.countryStats).map(([country, count]) => ({
      'Country': country,
      'Total Records': count
    }));
    downloadCSV(data, 'country_report.csv');
  };

  const handleExportProcessing = () => {
    const data = Object.entries(aggregatedStats.dailyUploads).map(([date, count]) => ({
      'Date': date,
      'Files Processed': count
    }));
    downloadCSV(data, 'processing_report.csv');
  };

  const handleExportAll = () => {
    // Export a list of all files and their stats
    const fileStats = groupedFiles.map((f: any) => ({
      'File Name': f.name,
      'Processed At': f.processedAt.toLocaleString(),
      'Total Records': f.totalRecords,
      'Valid Records': f.validRecordsCount,
      'Errors': f.totalRecords - f.validRecordsCount,
      'Quality Score': `${f.qualityScore}%`
    }));
    downloadCSV(fileStats, 'all_files_report.csv');
  };

  const cards = [
    { title: 'Validation Report', desc: 'Errors, breakdown by type, suggested fixes', onExport: handleExportValidation },
    { title: 'Data Quality Report', desc: 'Quality score breakdown across dimensions', onExport: handleExportQuality },
    { title: 'Country Validation Report', desc: 'Per-country record counts and error rates', onExport: handleExportCountry },
    { title: 'Processing Report', desc: 'Pipeline runs, status, throughput', onExport: handleExportProcessing },
  ]

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-lg font-bold text-gray-900">Reports</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded flex items-center justify-center mb-4">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-gray-900">{card.title}</h3>
              <p className="text-[11px] text-gray-500 mt-1 mb-6">{card.desc}</p>
            </div>
            <button 
              onClick={card.onExport}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 text-left flex items-center gap-1 w-max"
            >
              Export Summary CSV <span className="text-[10px]">→</span>
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-gray-900">Available Per-File Reports</h3>
            <p className="text-[11px] text-gray-500 mt-1">Generate CSV reports per uploaded file</p>
          </div>
          <button 
            onClick={handleExportAll}
            disabled={files.length === 0}
            className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-3.5 h-3.5" /> Export All to CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs text-gray-600 font-bold">
                <th className="px-6 py-4">File</th>
                <th className="px-6 py-4">Records</th>
                <th className="px-6 py-4">Quality</th>
                <th className="px-6 py-4 text-right">Reports</th>
              </tr>
            </thead>
            <tbody>
              {groupedFiles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500 border-b border-gray-100">
                    No files available for reporting.
                  </td>
                </tr>
              ) : (
                groupedFiles.map((file: any) => (
                  <tr key={file.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {file.name} {file.chunkCount > 1 && <span className="text-xs font-normal text-gray-500 ml-2">({file.chunkCount} chunks joined)</span>}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-600">{file.totalRecords}</td>
                    <td className="px-6 py-4 font-medium text-gray-600">{file.qualityScore}%</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => downloadCSV(file.errors, `errors_report_${file.name}`)}
                        disabled={file.errors.length === 0}
                        className="px-3 py-1 bg-white border border-gray-200 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Errors CSV
                      </button>
                      <button 
                        onClick={() => {
                          const statsData = Object.entries(file.errorStats).map(([type, count]) => ({ 'Error Type': type, 'Total Occurrences': count }));
                          downloadCSV(statsData, `stats_report_${file.name}`);
                        }}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700"
                      >
                        Stats CSV
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
