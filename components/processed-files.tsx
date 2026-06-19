'use client'

import React, { useState } from 'react'
import { FileText, Download, ChevronDown, ChevronRight } from 'lucide-react'
import { useData } from '@/lib/data-context'

export default function ProcessedFiles() {
  const { files, downloadCSV } = useData();
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

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
        errors: [],
        chunkCount: 0,
        chunks: []
      };
    }
    const group = acc[baseName];
    group.totalRecords += file.totalRecords;
    group.validRecordsCount += file.validRecordsCount;
    group.validData.push(...file.validData);
    group.errorData.push(...file.errorData);
    group.errors.push(...file.errors);
    group.chunkCount += 1;
    group.chunks.push(file);
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
                  <React.Fragment key={file.id}>
                    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900 flex items-center gap-2">
                        {file.chunkCount > 1 && (
                          <button onClick={() => toggleRow(file.id)} className="text-gray-400 hover:text-gray-600">
                            {expandedRows[file.id] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </button>
                        )}
                        {file.name} {file.chunkCount > 1 && <span className="text-xs font-normal text-gray-500 ml-2">({file.chunkCount} chunks)</span>}
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium">{file.processedAt.toLocaleString()}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">{file.validRecordsCount} / {file.totalRecords}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">{file.qualityScore}%</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button 
                          onClick={() => downloadCSV(file.errors, `validation_log_${file.name}`)}
                          disabled={file.errors.length === 0}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 border border-gray-200 rounded text-xs font-semibold text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Log
                        </button>
                        <button 
                          onClick={() => {
                            const hasInvalid = file.validData.some((row: any) => !row.customer_id || String(row.customer_id).trim() === '');
                            if (hasInvalid) throw new Error("Validation breach");
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
                    {expandedRows[file.id] && file.chunks.map((chunk: any) => (
                      <tr key={chunk.id} className="bg-gray-50/30 border-b border-gray-100/50">
                        <td className="px-6 py-3 pl-12 text-sm text-gray-600 flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-gray-400" />
                          {chunk.name}
                        </td>
                        <td className="px-6 py-3 text-gray-500 text-xs">{chunk.processedAt.toLocaleString()}</td>
                        <td className="px-6 py-3 text-gray-600 text-sm">{chunk.validRecordsCount} / {chunk.totalRecords}</td>
                        <td className="px-6 py-3 text-gray-600 text-sm">{chunk.qualityScore}%</td>
                        <td className="px-6 py-3 text-right space-x-2">
                          <button 
                            onClick={() => downloadCSV(chunk.validData, `cleaned_${chunk.name}`)}
                            disabled={chunk.validRecordsCount === 0}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded text-[10px] font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                          >
                            <Download className="w-3 h-3" /> Cleaned
                          </button>
                          <button 
                            onClick={() => downloadCSV(chunk.errorData, `errors_${chunk.name}`)}
                            disabled={chunk.errorData.length === 0}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded text-[10px] font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                          >
                            <Download className="w-3 h-3" /> Errors
                          </button>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
