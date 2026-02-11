
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { SheetRow, AIInsight } from '../types';

interface Props {
  data: SheetRow[];
  insight: AIInsight | null;
  loadingInsight: boolean;
  onAnalyze: () => void;
}

export const AnalyticsPanel: React.FC<Props> = ({ data, insight, loadingInsight, onAnalyze }) => {
  const chartData = useMemo(() => {
    const counts = data.reduce((acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [data]);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Chart Section */}
      <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Pipeline Status</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insight Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-xl shadow-lg text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
            Gemini AI Insights
          </h3>
          <button 
            onClick={onAnalyze}
            disabled={loadingInsight}
            className="text-xs bg-white/20 hover:bg-white/30 backdrop-blur-md px-3 py-1.5 rounded-full transition-all disabled:opacity-50"
          >
            {loadingInsight ? 'Analyzing...' : 'Refresh AI'}
          </button>
        </div>

        {insight ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <p className="text-sm text-indigo-100 leading-relaxed italic">
              "{insight.summary}"
            </p>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-200 mb-2">Strategy Recommendations:</p>
              <ul className="space-y-2">
                {insight.suggestions.map((s, i) => (
                  <li key={i} className="text-xs bg-white/10 p-2 rounded-lg border border-white/5">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className={`mt-2 flex items-center gap-2 text-xs font-medium py-1 px-3 rounded-full w-fit ${
              insight.trend === 'positive' ? 'bg-emerald-400/20 text-emerald-300' : 'bg-amber-400/20 text-amber-300'
            }`}>
              Overall Trend: <span className="capitalize">{insight.trend}</span>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-10">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <p className="text-sm text-indigo-100">Click refresh to generate AI insights from your sheet data.</p>
          </div>
        )}
      </div>
    </div>
  );
};
