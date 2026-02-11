
import React from 'react';
import { SheetRow } from '../types';

interface Props {
  data: SheetRow[];
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: SheetRow['status']) => void;
}

export const DataTable: React.FC<Props> = ({ data, onDelete, onStatusChange }) => {
  const getStatusStyle = (status: SheetRow['status']) => {
    switch (status) {
      case 'Closed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Lead': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Contacted': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Lost': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">Customer Records (Source: Spreadsheet)</h3>
        <span className="text-xs font-medium text-slate-500">{data.length} total rows</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Value</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-800">{row.customerName}</td>
                <td className="px-6 py-4 text-slate-600 text-sm">{row.email}</td>
                <td className="px-6 py-4">
                  <select 
                    value={row.status}
                    onChange={(e) => onStatusChange(row.id, e.target.value as SheetRow['status'])}
                    className={`text-xs px-2 py-1 rounded-md border font-medium focus:outline-none ${getStatusStyle(row.status)}`}
                  >
                    <option value="Lead">Lead</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Closed">Closed</option>
                    <option value="Lost">Lost</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-slate-800 font-semibold">${row.value.toLocaleString()}</td>
                <td className="px-6 py-4 text-slate-500 text-sm">{row.date}</td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => onDelete(row.id)}
                    className="text-rose-500 hover:text-rose-700 transition-colors p-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
