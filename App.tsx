import React, { useState } from 'react';
import { ViewState, AuditRecord } from './types';
import Sidebar from './Sidebar';
import Landing from './Landing';
import Upload from './Upload';
import Dashboard from './Dashboard';
import Analysis from './Analysis';
import Findings from './Findings';
import Report from './Report';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.LANDING);
  const [auditData, setAuditData] = useState<AuditRecord[]>([]);

  const handleDataLoaded = (data: AuditRecord[]) => {
    setAuditData(data);
    setCurrentView(ViewState.DASHBOARD);
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.LANDING:
        return <Landing onStart={() => setCurrentView(ViewState.UPLOAD)} />;
      case ViewState.UPLOAD:
        return <Upload onDataLoaded={handleDataLoaded} />;
      case ViewState.DASHBOARD:
        return <Dashboard data={auditData} />;
      case ViewState.ANALYSIS:
        return <Analysis data={auditData} />;
      case ViewState.FINDINGS:
        return <Findings data={auditData} />;
      case ViewState.REPORT:
        return <Report data={auditData} />;
      default:
        return <Landing onStart={() => setCurrentView(ViewState.UPLOAD)} />;
    }
  };

  return (
    <div className="flex w-screen h-screen bg-slate-950 overflow-hidden text-slate-200 font-sans">
      {/* Sidebar only visible after Landing */}
      {currentView !== ViewState.LANDING && (
        <Sidebar 
          currentView={currentView} 
          setView={setCurrentView} 
          hasData={auditData.length > 0} 
        />
      )}
      
      <main className="flex-1 relative overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
