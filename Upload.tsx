import React, { useState } from 'react';
import { AuditRecord } from '../types';
import { FileUp, Loader2, CheckCircle } from 'lucide-react';

interface UploadProps {
  onDataLoaded: (data: AuditRecord[]) => void;
}

const Upload: React.FC<UploadProps> = ({ onDataLoaded }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processCSV = (text: string) => {
    try {
      const lines = text.split('\n');
      const data: AuditRecord[] = [];
      
      // Assume header is row 0
      // Expected: Name, Balance, Aging, Date
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const cols = line.split(',');
        // Basic parsing logic - in production use a library like PapaParse
        const balance = parseFloat(cols[1]);
        const aging = parseInt(cols[2]);

        if (isNaN(balance)) continue;

        let status: 'Current' | 'Overdue' | 'Impaired' = 'Current';
        if (aging > 30 && aging <= 90) status = 'Overdue';
        if (aging > 90) status = 'Impaired';

        data.push({
          id: `REC-${i}`,
          customerName: cols[0] || 'Unknown',
          totalBalance: balance,
          agingDays: aging || 0,
          status,
          invoiceDate: cols[3] || new Date().toISOString().split('T')[0]
        });
      }

      if (data.length === 0) throw new Error("No valid records found in CSV.");
      
      onDataLoaded(data);
    } catch (err) {
      setError("Failed to parse CSV. Please ensure format: Name,Balance,AgingDays,Date");
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      // Simulate slight delay for UX
      setTimeout(() => processCSV(text), 1500);
    };
    reader.onerror = () => {
      setError("Error reading file.");
      setIsProcessing(false);
    };
    reader.readAsText(file);
  };

  const loadSampleData = () => {
    setIsProcessing(true);
    const sampleCSV = `PT. Maju Jaya,150000000,15,2023-10-01
CV. Sumber Rejeki,45000000,45,2023-09-01
Toko Abadi,12500000,120,2023-06-01
PT. Teknologi Baru,250000000,5,2023-10-10
UD. Sejahtera,8500000,200,2023-03-01
Global Corp,500000000,10,2023-10-05
Local Trader,-1500000,30,2023-09-15
Mega Construction,300000000,95,2023-07-01`;
    setTimeout(() => processCSV(sampleCSV), 1000);
  };

  return (
    <div className="w-full h-full p-8 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-10 shadow-2xl text-center">
        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
          {isProcessing ? (
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
          ) : (
            <FileUp className="w-10 h-10 text-primary-500" />
          )}
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Upload Working Paper (KKP)</h2>
        <p className="text-slate-400 mb-8">Upload your .csv file containing receivables data.</p>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="relative group w-full mb-6">
          <input 
            type="file" 
            accept=".csv"
            onChange={handleFileUpload}
            disabled={isProcessing}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
          />
          <div className="w-full py-4 border-2 border-dashed border-slate-700 rounded-xl group-hover:border-primary-500 group-hover:bg-slate-800/50 transition-all flex items-center justify-center text-slate-400 group-hover:text-white">
             {isProcessing ? "Processing..." : "Click to Browse or Drag File"}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-slate-900 text-slate-500">Or</span>
          </div>
        </div>

        <button 
          onClick={loadSampleData}
          disabled={isProcessing}
          className="mt-6 text-sm text-primary-400 hover:text-primary-300 font-medium underline underline-offset-4"
        >
          Load Sample Audit Data
        </button>
      </div>
    </div>
  );
};

export default Upload;