'use client'

import { UploadCloud, Zap, CheckCircle, AlertTriangle } from 'lucide-react'
import { useData } from '@/lib/data-context'
import { useCallback } from 'react'

export default function FileUploadModule() {
  const { uploadDataset, loadDemoDataset, files } = useData();

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        uploadDataset(file);
      } else {
        alert("Please upload a valid CSV file.");
      }
    }
  }, [uploadDataset]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadDataset(e.target.files[0]);
    }
  }, [uploadDataset]);

  return (
    <div className="p-8 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload File Area */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-sm text-gray-900">Upload Transaction File</h3>
            <p className="text-xs text-gray-500 mt-1">CSV format. Headers: order_id, customer_id, order_date, order_amount, country, phone, payment_mode...</p>
          </div>
          <div className="p-8">
            <label 
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-300 bg-gray-50/50 hover:bg-gray-50 hover:border-blue-400 transition-colors rounded-lg flex flex-col items-center justify-center py-16 cursor-pointer"
            >
              <UploadCloud className="w-8 h-8 text-blue-600 mb-4" />
              <div className="text-sm font-bold text-gray-900">Drag and drop CSV here</div>
              <div className="text-xs text-gray-500 mt-1">or click to browse files</div>
              <input 
                type="file" 
                accept=".csv" 
                className="hidden" 
                onChange={handleFileChange} 
              />
            </label>
          </div>
        </div>

        {/* Demo Dataset */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" />
              Demo Dataset
            </h3>
            <p className="text-xs text-gray-500 mt-1">Generate realistic test data</p>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Generates 500 multi-country transactions (India, Singapore, UAE, USA, UK) with ~10% intentional validation errors for testing the platform.
            </p>
            <ul className="text-xs text-gray-500 space-y-2.5 mb-8">
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span> Invalid phone numbers
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span> Malformed dates
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span> Duplicate order IDs
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span> Unknown payment modes
              </li>
            </ul>
            <button 
              onClick={loadDemoDataset}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
            >
              Load Sample Dataset
            </button>
          </div>
        </div>
      </div>

      {/* Upload History */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-bold text-sm text-gray-900">Upload History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-600">
                <th className="px-6 py-4 font-bold">File</th>
                <th className="px-6 py-4 font-bold">Uploaded</th>
                <th className="px-6 py-4 font-bold">Records</th>
                <th className="px-6 py-4 font-bold">Valid</th>
                <th className="px-6 py-4 font-bold">Invalid</th>
                <th className="px-6 py-4 font-bold">Quality</th>
                <th className="px-6 py-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {files.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500 border-b border-gray-100">
                    No uploads yet
                  </td>
                </tr>
              ) : (
                files.map((file) => (
                  <tr key={file.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{file.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{file.processedAt.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{file.totalRecords}</td>
                    <td className="px-6 py-4 text-sm text-green-600 font-medium">{file.validRecordsCount}</td>
                    <td className="px-6 py-4 text-sm text-red-600 font-medium">{file.totalRecords - file.validRecordsCount}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${file.qualityScore > 80 ? 'bg-green-500' : file.qualityScore > 50 ? 'bg-amber-500' : 'bg-red-500'}`} 
                            style={{ width: `${file.qualityScore}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-700">{file.qualityScore}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {file.qualityScore > 90 ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                          <CheckCircle className="w-3.5 h-3.5" /> Excellent
                        </span>
                      ) : file.qualityScore > 70 ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertTriangle className="w-3.5 h-3.5" /> Good
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                          <AlertTriangle className="w-3.5 h-3.5" /> Poor
                        </span>
                      )}
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

