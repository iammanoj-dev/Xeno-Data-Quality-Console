'use client'

import { FileText, Download } from 'lucide-react'
import { useData } from '@/lib/data-context'

export default function ProcessedFiles() {
  const { files, downloadCSV } = useData();

  const groupedFiles = Object.values(files.reduce((acc: Record<string, any>, file) => {
    const baseName = file.name.replace(/_part\d+\.csv$/, '.csv');
    if (!acc[baseName]) {
      acc[baseName] = {
        id: file.id,
        name: baseName,
        processedAt: file.processedAt,
        totalRecords: 0,
        validRecordsCount: 0,
        validData: [],
        errorData: [],
        chunkCount: 0
      };
    }
    const group = acc[baseName];
    group.totalRecords += file.totalRecords;
    group.validRecordsCount += file.validRecordsCount;
    group.validData.push(...file.validData);
    group.errorData.push(...file.errorData);
    group.chunkCount += 1;
    return acc;
  }, {})).map((group: any) => ({
    ...group,
    qualityScore: group.totalRecords === 0 ? 0 : Number(((group.validRecordsCount / group.totalRecords) * 100).toFixed(1))
  }));

  return (
    <div className="p-8">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-sm text-gray-900">Processed Files</h3>
          <p className="text-xs text-gray-500">Download cleaned data or error reports</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs text-gray-600">
                <th className="px-6 py-4 font-bold">Source File</th>
                <th className="px-6 py-4 font-bold">Processed</th>
                <th className="px-6 py-4 font-bold">Valid Records</th>
                <th className="px-6 py-4 font-bold">Quality</th>
                <th className="px-6 py-4 font-bold text-right">Outputs</th>
              </tr>
            </thead>
            <tbody>
              {groupedFiles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500 border-b border-gray-100">
                    No files processed yet.
                  </td>
                </tr>
              ) : (
                groupedFiles.map((file: any) => (
                  <tr key={file.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {file.name} {file.chunkCount > 1 && <span className="text-xs font-normal text-gray-500 ml-2">({file.chunkCount} chunks joined)</span>}
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">{file.processedAt.toLocaleString()}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{file.validRecordsCount} / {file.totalRecords}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{file.qualityScore}%</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => {
                          const hasInvalid = file.validData.some((row: any) => !row.customer_id || String(row.customer_id).trim() === '');
                          if (hasInvalid) {
                            throw new Error("Validation breach: cleaned dataset contains invalid records");
                          }
                          downloadCSV(file.validData, `cleaned_${file.name}`);
                        }}
                        disabled={file.validRecordsCount === 0}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Cleaned
                      </button>
                      <button 
                        onClick={() => downloadCSV(file.errorData, `errors_${file.name}`)}
                        disabled={file.errorData.length === 0}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Errors
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
