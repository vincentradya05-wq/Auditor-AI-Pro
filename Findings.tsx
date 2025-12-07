import React, { useState } from 'react';
import { AuditRecord } from '../types';
import { Search, AlertTriangle, CheckCircle } from 'lucide-react';

interface FindingsProps {
  data: AuditRecord[];
}

const Findings: React.FC<FindingsProps> = ({ data }) => {
  const [search, setSearch] = useState('');

  // Auto-Flags
  const negativeBalances = data.filter(r => r.totalBalance < 0);
  const impairedAccounts = data.filter(r => r.status === 'Impaired');
  
  const filteredData = data.filter(r => 
    r.customerName.toLowerCase().includes(search.toLowerCase()) ||
    r.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Findings & Exceptions</h2>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search findings..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-primary-500 w-64"
          />
        </div>
      </div>

      {/* Flag Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-4 rounded-xl border ${negativeBalances.length > 0 ? 'bg-red-900/10 border-red-800' : 'bg-green-900/10 border-green-800'}`}>
          <div className="flex items-center space-x-3">
            <AlertTriangle className={negativeBalances.length > 0 ? "text-red-400" : "text-green-400"} />
            <div>
              <h4 className="text-white font-semibold">Credit Balances (Negative)</h4>
              <p className="text-slate-400 text-sm">
                {negativeBalances.length > 0 
                  ? `Found ${negativeBalances.length} accounts with negative balance. Potential classification error.` 
                  : "No negative balances found."}
              </p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${impairedAccounts.length > 0 ? 'bg-orange-900/10 border-orange-800' : 'bg-green-900/10 border-green-800'}`}>
          <div className="flex items-center space-x-3">
            <AlertTriangle className={impairedAccounts.length > 0 ? "text-orange-400" : "text-green-400"} />
            <div>
              <h4 className="text-white font-semibold">Impairment Risk (>90 Days)</h4>
              <p className="text-slate-400 text-sm">
                {impairedAccounts.length > 0 
                  ? `Found ${impairedAccounts.length} accounts exceeding 90 days. Requires PSAK 71 assessment.` 
                  : "No significantly overdue accounts."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
        <div className="overflow-auto custom-scrollbar flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-950 text-slate-400 sticky top-0 z-10">
              <tr>
                <th className="p-4 font-medium border-b border-slate-800">Customer Name</th>
                <th className="p-4 font-medium border-b border-slate-800">Balance</th>
                <th className="p-4 font-medium border-b border-slate-800">Aging (Days)</th>
                <th className="p-4 font-medium border-b border-slate-800">Status</th>
                <th className="p-4 font-medium border-b border-slate-800">Invoice Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-white font-medium">{row.customerName}</td>
                  <td className={`p-4 font-mono ${row.totalBalance < 0 ? 'text-red-400' : 'text-slate-300'}`}>
                    ${row.totalBalance.toLocaleString()}
                  </td>
                  <td className="p-4 text-slate-300">{row.agingDays}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      row.status === 'Impaired' ? 'bg-red-900 text-red-200' :
                      row.status === 'Overdue' ? 'bg-orange-900 text-orange-200' :
                      'bg-green-900 text-green-200'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 text-sm">{row.invoiceDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Findings;