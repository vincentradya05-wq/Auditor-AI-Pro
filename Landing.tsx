import React from 'react';
import { ArrowRight, ShieldCheck, Cpu, BarChart } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-950 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-teal-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="z-10 text-center max-w-4xl px-6">
        <div className="inline-flex items-center space-x-2 bg-slate-900/50 border border-slate-700 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs font-medium text-slate-300 uppercase tracking-wider">PSAK 71 Compliant</span>
        </div>

        <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
          Auditor-AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-teal-400">Receivables</span>
        </h1>
        
        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          The next generation of audit intelligence. Automate your receivables testing, calculate Expected Credit Loss (ECL), and converse with your data using Voice AI.
        </p>

        <button 
          onClick={onStart}
          className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-primary-600 rounded-full hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600 focus:ring-offset-slate-900"
        >
          <span>Start Audit Session</span>
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="z-10 mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 px-6 max-w-5xl w-full">
        <FeatureCard 
          icon={<Cpu className="w-6 h-6 text-primary-400" />}
          title="AI Analysis"
          desc="Gemini-powered voice assistant to query your audit data instantly."
        />
        <FeatureCard 
          icon={<ShieldCheck className="w-6 h-6 text-teal-400" />}
          title="Risk Detection"
          desc="Automated flagging of high-risk accounts and negative balances."
        />
        <FeatureCard 
          icon={<BarChart className="w-6 h-6 text-purple-400" />}
          title="Visual Insights"
          desc="Interactive dashboard for aging analysis and Pareto charts."
        />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm hover:border-slate-700 transition-colors">
    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default Landing;