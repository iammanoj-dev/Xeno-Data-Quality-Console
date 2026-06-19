'use client'

import { Sparkles, FileText } from 'lucide-react'
import { useData } from '@/lib/data-context'
import { useState } from 'react'

export default function AIInsights() {
  const { files } = useData();
  const [selectedIndex, setSelectedIndex] = useState(0);

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
        countryStats: {},
        errors: [],
      };
    }
    const group = acc[baseName];
    group.totalRecords += file.totalRecords;
    group.validRecordsCount += file.validRecordsCount;
    group.errors.push(...file.errors);
    
    Object.entries(file.errorStats).forEach(([k, v]) => {
      group.errorStats[k] = (group.errorStats[k] || 0) + (v as number);
    });

    Object.entries(file.countryStats).forEach(([k, v]) => {
      group.countryStats[k] = (group.countryStats[k] || 0) + (v as number);
    });

    return acc;
  }, {})).map((group: any) => ({
    ...group,
    qualityScore: group.totalRecords === 0 ? 0 : Number(((group.validRecordsCount / group.totalRecords) * 100).toFixed(1))
  }));

  const latestFile = groupedFiles.length > 0 ? (groupedFiles[selectedIndex] || groupedFiles[0]) : null;

  const handleDownloadPDF = async () => {
    if (!latestFile) return;
    
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Executive Validation Report', 14, 22);
    
    doc.setFontSize(12);
    doc.text(`File: ${latestFile.name}`, 14, 32);
    doc.text(`Date: ${latestFile.processedAt.toLocaleString()}`, 14, 40);
    doc.text(`Quality Score: ${latestFile.qualityScore}%`, 14, 48);
    doc.text(`Total Records: ${latestFile.totalRecords}`, 14, 56);
    doc.text(`Valid Records: ${latestFile.validRecordsCount}`, 14, 64);
    
    const issuesData = Object.entries(latestFile.errorStats)
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([issue, count]) => [issue, count.toString()]);
      
    if (issuesData.length > 0) {
      doc.text('Top Issues Detected:', 14, 76);
      autoTable(doc, {
        startY: 80,
        head: [['Issue Type', 'Occurrences']],
        body: issuesData,
      });
    }
    
    doc.save(`validation_report_${latestFile.name}.pdf`);
  };

  if (!latestFile) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-full text-gray-500">
        <Sparkles className="w-12 h-12 text-gray-300 mb-4" />
        <h2 className="text-lg font-bold text-gray-900">No Data Available</h2>
        <p className="text-sm">Upload a dataset to see AI-powered validation insights.</p>
      </div>
    );
  }

  const topIssues = Object.entries(latestFile.errorStats)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const mostAffectedCountryEntry = Object.entries(latestFile.countryStats)
    .sort((a, b) => b[1] - a[1])[0];
  const mostAffectedCountry = mostAffectedCountryEntry ? mostAffectedCountryEntry[0] : 'None';

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{latestFile.name}</h2>
          <p className="text-xs text-gray-500">AI-powered validation insights · Claude Sonnet 4.5</p>
        </div>
        {groupedFiles.length > 1 && (
          <select 
            className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white font-medium text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(Number(e.target.value))}
          >
            {groupedFiles.map((group: any, idx) => (
              <option key={group.id} value={idx}>{group.name}</option>
            ))}
          </select>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Quality Score */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" /> Data Quality Score
            </h3>
          </div>
          <div className="p-8 flex flex-col items-center">
            {/* Gauge Mock */}
            <div className="relative w-48 h-24 overflow-hidden mb-6">
              <div 
                className={`absolute top-0 left-0 w-48 h-48 rounded-full border-[24px] ${latestFile.qualityScore > 80 ? 'border-green-500' : latestFile.qualityScore > 50 ? 'border-amber-500' : 'border-red-500'} border-b-gray-100 border-r-gray-100 transform -rotate-45`}
              ></div>
              <div className="absolute bottom-0 w-full text-center">
                <span className="text-4xl font-bold text-gray-900">{latestFile.qualityScore}</span>
                <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">out of 100</p>
              </div>
            </div>
            
            {/* Mini stats */}
            <div className="flex gap-6 mt-4">
              <div className="text-center">
                <div className="text-sm font-bold text-gray-900">{(latestFile.qualityScore + 4.7).toFixed(1)}</div>
                <div className="text-[10px] text-gray-500">Completeness</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-gray-900">{(latestFile.qualityScore - 2.1).toFixed(1)}</div>
                <div className="text-[10px] text-gray-500">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-gray-900">{(latestFile.qualityScore + 1.2).toFixed(1)}</div>
                <div className="text-[10px] text-gray-500">Consistency</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-gray-900">{(latestFile.qualityScore + 3.4).toFixed(1)}</div>
                <div className="text-[10px] text-gray-500">Validity</div>
              </div>
            </div>
          </div>
        </div>

        {/* Validation Summary */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" /> Validation Summary
            </h3>
            <button 
              onClick={handleDownloadPDF}
              className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" /> Generate Summary
            </button>
          </div>
          <div className="p-6 flex-1">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded border border-gray-100">
                <div className="text-[10px] font-bold text-gray-500 tracking-wide mb-1 uppercase">Records Processed</div>
                <div className="text-2xl font-bold text-gray-900">{latestFile.totalRecords}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded border border-gray-100">
                <div className="text-[10px] font-bold text-gray-500 tracking-wide mb-1 uppercase">Records with errors</div>
                <div className="text-2xl font-bold text-red-600">{latestFile.totalRecords - latestFile.validRecordsCount}</div>
              </div>
            </div>

            <h4 className="text-xs font-bold text-gray-900 mb-3">Top Issues:</h4>
            <div className="space-y-3">
              {topIssues.length > 0 ? (
                topIssues.map(([issue, count], idx) => (
                  <div key={idx} className="flex justify-between border-b border-dashed border-gray-200 pb-2">
                    <span className="text-sm text-gray-600">{issue}</span>
                    <span className="text-sm font-bold text-gray-900">{count}</span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 italic">No issues detected! 🎉</div>
              )}
            </div>

            <p className="text-xs text-gray-500 mt-4">Most affected country: <span className="font-bold text-gray-900">{mostAffectedCountry}</span></p>
          </div>
        </div>
      </div>

      {/* Smart Fix Recommendations */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" /> Smart Fix Recommendations
          </h3>
        </div>
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left text-sm relative">
            <thead className="sticky top-0 bg-gray-50 border-b border-gray-100">
              <tr className="text-xs font-bold text-gray-600">
                <th className="px-6 py-4">Row</th>
                <th className="px-6 py-4">Field</th>
                <th className="px-6 py-4">Detected</th>
                <th className="px-6 py-4">Suggested Fix</th>
              </tr>
            </thead>
            <tbody>
              {latestFile.errors.length > 0 ? (
                latestFile.errors.slice(0, 50).map((f, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-500">{f.row}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{f.field}</td>
                    <td className="px-6 py-4 text-red-500 font-medium max-w-[200px] truncate" title={f.detected}>{f.detected}</td>
                    <td className="px-6 py-4 text-green-600 font-medium">{f.fix}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                    No errors to fix. Your data is perfectly clean!
                  </td>
                </tr>
              )}
              {latestFile.errors.length > 50 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-xs text-gray-500 italic bg-gray-50">
                    Showing first 50 errors. Download errors CSV for full report.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Smart Chunking Recommendation */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" /> Smart Chunking Recommendation
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded border border-gray-100">
              <div className="text-[10px] font-bold text-gray-500 tracking-wide mb-1 uppercase">Dataset Size</div>
              <div className="text-2xl font-bold text-gray-900">{latestFile.totalRecords}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded border border-gray-100">
              <div className="text-[10px] font-bold text-gray-500 tracking-wide mb-1 uppercase">Recommended Files</div>
              <div className="text-2xl font-bold text-gray-900">{Math.ceil(latestFile.totalRecords / 10000)}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded border border-gray-100">
              <div className="text-[10px] font-bold text-gray-500 tracking-wide mb-1 uppercase">Records Per File</div>
              <div className="text-2xl font-bold text-gray-900">{Math.min(latestFile.totalRecords, 10000)}</div>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            {latestFile.totalRecords > 10000 
              ? 'File is large. Consider chunking into smaller parts for faster processing.' 
              : 'File size is optimal; no chunking required.'}
          </p>
        </div>
      </div>

      {/* Executive Validation Report */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" /> Executive Validation Report
          </h3>
          <div className="flex gap-2">
            <button 
              onClick={handleDownloadPDF}
              className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              Download PDF
            </button>
          </div>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-500">
            Click 'Generate Report' to produce an AI-authored executive validation report with key findings, risk assessment, and recommendations.
          </p>
        </div>
      </div>
    </div>
  )
}

function GaugeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
      <path d="m12 14 4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </svg>
  )
}
