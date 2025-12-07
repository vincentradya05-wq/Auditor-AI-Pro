import React, { useMemo } from 'react';
import { AuditRecord } from '../types';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend 
} from 'recharts';
import { DollarSign, Users, AlertOctagon, TrendingDown } from 'lucide-react';

interface DashboardProps {
  data: AuditRecord[];
}

const COLORS = ['#0ea5e9', '#f59e0b', '#ef4444'];

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  
  const stats = useMemo(() => {
    const totalExposure = data.reduce((sum, r) => sum + r.totalBalance, 0);
    const impairedData = data.filter(r => r.status === 'Impaired');
    const impairedTotal = impairedData.reduce((sum, r) => sum + r.totalBalance, 0);
    const nplRatio = totalExposure > 0 ? (impairedTotal / totalExposure) * 100 : 0;

    return {
      totalExposure,
      totalCustomers: data.length,
      impairedTotal,
      nplRatio
    };
  }, [data]);

  const pieData = useMemo(() => {
    const buckets = { Current: 0, Overdue: 0, Impaired: 0 };
    data.forEach(r => {
      if (buckets[r.status] !== undefined) buckets[r.status] += r.totalBalance;
    });
    return Object.keys(buckets).map(key => ({ name: key, value: buckets[key as keyof typeof buckets] }));
  }, [data]);

  const barData = useMemo(() => {
    return [...data]
      .sort((a, b) => b.totalBalance - a.totalBalance)
      .slice(0, 5)
      .map(r => ({
        name: r.customerName.length > 10 ? r.customerName.substring(0, 10) + '...' : r.customerName,
        Balance: r.totalBalance
      }));
  }, [data]);

  return (
    <div className="p-8 space-y-8 h-full overflow-y-auto">
      <h2 className="text-3xl font-bold text-white">Audit Dashboard</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Total Exposure" 
          value={`$${stats.totalExposure.toLocaleString()}`} 
          icon={<DollarSign className="text-blue-400" />} 
          trend="Gross Receivables"
        />
        <KpiCard 
          title="Total Customers" 
          value={stats.totalCustomers.toString()} 
          icon={<Users className="text-purple-400" />} 
          trend="Active Accounts"
        />
        <KpiCard 
          title="Impaired (>90 Days)" 
          value={`$${stats.impairedTotal.toLocaleString()}`} 
          icon={<AlertOctagon className="text-red-400" />} 
          isWarning
          trend="High Risk"
        />
        <KpiCard 
          title="NPL Ratio" 
          value={`${stats.nplRatio.toFixed(2)}%`} 
          icon={<TrendingDown className="text-orange-400" />} 
          trend="Portfolio Health"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-6">Aging Composition</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-6">Top 5 Debtors (Pareto)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" tickFormatter={(val) => `$${val/1000}k`} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} />
                <Tooltip 
                  cursor={{fill: '#334155', opacity: 0.2}}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                />
                <Bar dataKey="Balance" fill="#0ea5e9" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const KpiCard = ({ title, value, icon, isWarning, trend }: any) => (
  <div className={`bg-slate-900 border ${isWarning ? 'border-red-900/50 bg-red-900/10' : 'border-slate-800'} rounded-2xl p-6`}>
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <h4 className={`text-2xl font-bold mt-1 ${isWarning ? 'text-red-400' : 'text-white'}`}>{value}</h4>
      </div>
      <div className={`p-2 rounded-lg ${isWarning ? 'bg-red-500/20' : 'bg-slate-800'}`}>
        {icon}
      </div>
    </div>
    <div className="text-xs text-slate-500">
      {trend}
    </div>
  </div>
);

export default Dashboard;