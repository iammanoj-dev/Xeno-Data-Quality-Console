'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ValidationRule, ProcessedFile, defaultRules, processDataset, generateDemoData } from './processor';
import Papa from 'papaparse';

interface DataContextType {
  files: ProcessedFile[];
  validationRules: ValidationRule[];
  uploadDataset: (file: File) => void;
  loadDemoDataset: () => void;
  toggleValidationRule: (id: number) => void;
  downloadCSV: (data: any[], filename: string) => void;
  clearAll: () => void;
  aggregatedStats: {
    totalFiles: number;
    recordsProcessed: number;
    totalErrors: number;
    avgQualityScore: number;
    errorStats: Record<string, number>;
    countryStats: Record<string, number>;
    dailyUploads: Record<string, number>;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [validationRules, setValidationRules] = useState<ValidationRule[]>(defaultRules);

  const CHUNK_SIZE = 10000;

  const handleDataChunking = (data: any[], filename: string) => {
    const globalContext = { orderIds: new Set<string>() };
    if (data.length <= CHUNK_SIZE) {
      const processed = processDataset(data, validationRules, filename, globalContext);
      setFiles(prev => [processed, ...prev]);
    } else {
      const totalChunks = Math.ceil(data.length / CHUNK_SIZE);
      const newFiles = [];
      for (let i = 0; i < totalChunks; i++) {
        const chunk = data.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
        const chunkName = `${filename.replace('.csv', '')}_part${i + 1}.csv`;
        const processed = processDataset(chunk, validationRules, chunkName, globalContext);
        newFiles.push(processed);
      }
      setFiles(prev => [...newFiles.reverse(), ...prev]);
    }
  };

  const uploadDataset = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        handleDataChunking(results.data, file.name);
      },
      error: (err) => {
        console.error("Error parsing CSV:", err);
      }
    });
  };

  const loadDemoDataset = () => {
    const demoData = generateDemoData();
    handleDataChunking(demoData, `demo_dataset_${Date.now()}.csv`);
  };

  const toggleValidationRule = (id: number) => {
    setValidationRules(prev => prev.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
    // Optionally reprocess existing files based on new rules, 
    // but for this demo we'll just apply it to future uploads.
  };

  const downloadCSV = (data: any[], filename: string) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearAll = () => {
    setFiles([]);
  };

  const getAggregatedStats = () => {
    const stats = {
      totalFiles: files.length,
      recordsProcessed: 0,
      totalErrors: 0,
      avgQualityScore: 0,
      errorStats: {} as Record<string, number>,
      countryStats: {} as Record<string, number>,
      dailyUploads: {} as Record<string, number>,
    };

    let totalQualityScore = 0;

    files.forEach(file => {
      stats.recordsProcessed += file.totalRecords;
      stats.totalErrors += file.errors.length;
      totalQualityScore += file.qualityScore;

      // Aggregate errors
      Object.entries(file.errorStats).forEach(([key, val]) => {
        stats.errorStats[key] = (stats.errorStats[key] || 0) + val;
      });

      // Aggregate countries
      Object.entries(file.countryStats).forEach(([key, val]) => {
        stats.countryStats[key] = (stats.countryStats[key] || 0) + val;
      });

      // Aggregate dates (simple format YYYY-MM-DD)
      const dateStr = file.processedAt.toISOString().split('T')[0];
      stats.dailyUploads[dateStr] = (stats.dailyUploads[dateStr] || 0) + 1;
    });

    if (files.length > 0) {
      stats.avgQualityScore = Number((totalQualityScore / files.length).toFixed(1));
    }

    return stats;
  };

  return (
    <DataContext.Provider value={{
      files,
      validationRules,
      uploadDataset,
      loadDemoDataset,
      toggleValidationRule,
      downloadCSV,
      clearAll,
      aggregatedStats: getAggregatedStats(),
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
