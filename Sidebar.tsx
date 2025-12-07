import React from 'react';
import { ViewState } from '../types';
import { 
  Home, 
  UploadCloud, 
  BarChart2, 
  Mic, 
  AlertTriangle, 
  FileText, 
  LogOut 
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  hasData: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, hasData }) => {
  
  const navItems = [
    { id: ViewState.UPLOAD, label: 'Upload Data', icon: UploadCloud, disabled: false },
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: BarChart2, disabled: !hasData },
    { id: ViewState.ANALYSIS, label: 'AI Analysis', icon: Mic, disabled: !hasData },
    { id: ViewState.FINDINGS, label: 'Findings', icon: AlertTriangle, disabled: !hasData },
    { id: ViewState.REPORT, label: 'Report', icon: FileText, disabled: !hasData },
  ];

  return (
    <div className="w-64 h-full bg-slate-900 border-r border-slate-800 flex flex-col shadow-2xl">
      <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
        <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
          <Home className="text-white w-5 h-5" />
        </div>
        <span className="text-xl font-bold text-slate-100 tracking-tight">Auditor-AI</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => !item.disabled && setView(item.id)}
            disabled={item.disabled}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              currentView === item.id
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/50'
                : item.disabled
                ? 'text-slate-600 cursor-not-allowed'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon className={`w-5 h-5 ${currentView === item.id ? 'animate-pulse' : ''}`} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={() => setView(ViewState.LANDING)}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-slate-400 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Exit Audit</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;