import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  Search, 
  PlusCircle, 
  MapPin, 
  History, 
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const QuickAction = ({ icon: Icon, label, color }: any) => (
  <button className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-all active:scale-95">
    <div className={`p-3 rounded-xl mb-2 ${color}`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
    <span className="text-sm font-medium text-gray-700">{label}</span>
  </button>
);

export const SalesDashboard = () => {
  const { profile } = useAuth();

  return (
    <DashboardLayout role="SALESPERSON">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none uppercase">Agent Terminal</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Personnel ID: {profile?.uid.substring(0,8)}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white text-xs font-black shadow-lg">
            {profile?.name.charAt(0)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Search, label: "Lookup Party", color: "bg-blue-500", desc: "CRM Search" },
            { icon: PlusCircle, label: "Sync Order", color: "bg-emerald-500", desc: "Live Entry" },
            { icon: MapPin, label: "GPS Check-in", color: "bg-indigo-500", desc: "Route Log" },
            { icon: History, label: "Audit Log", color: "bg-slate-700", desc: "Daily Hist" },
          ].map((action, i) => (
            <button key={i} className="flex flex-col items-start p-3 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-blue-200 transition-all active:scale-95 text-left overflow-hidden relative group">
              <div className={cn("p-2 rounded-lg mb-2 text-white shadow-md", action.color)}>
                <action.icon className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[11px] font-black text-slate-800 uppercase tracking-tighter block">{action.label}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{action.desc}</span>
              </div>
              <div className="absolute -right-4 -top-4 w-12 h-12 bg-slate-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>

        <Card className="bg-slate-900 text-white border-none shadow-xl rounded-2xl relative overflow-hidden">
          <CardContent className="p-5 relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-none">Daily Target KPI</p>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-3xl font-black tracking-tighter">$12,450</span>
                  <span className="text-emerald-400 text-[10px] font-bold">REACHED</span>
                </div>
              </div>
              <TrendingUp className="h-6 w-6 text-emerald-500" />
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2">
              <div className="bg-blue-500 h-1.5 rounded-full w-[82%] shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            </div>
            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-500">
              <span>82% Consistency Score</span>
              <span className="text-white">Next Payout: $42.00</span>
            </div>
          </CardContent>
          <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/5 blur-3xl -z-0" />
        </Card>

        <section className="space-y-3">
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Active Route Queue</h2>
            <button className="text-[9px] text-blue-600 font-bold uppercase tracking-widest">Full List</button>
          </div>
          {[
            { company: "Electric Hub", time: "10:30 AM", status: "NEXT", dist: "0.2 km" },
            { company: "Global Spares", time: "12:00 PM", status: "PEND", dist: "1.4 km" },
            { company: "Prime PVC", time: "02:30 PM", status: "PEND", dist: "4.8 km" },
          ].map((visit, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "h-8 w-8 rounded-lg flex items-center justify-center font-black text-[10px]",
                  i === 0 ? "bg-blue-100 text-blue-600 border border-blue-200" : "bg-slate-50 text-slate-400"
                )}>
                  {visit.company.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800 uppercase tracking-tighter leading-none">{visit.company}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{visit.time}</span>
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">• {visit.dist}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded",
                  i === 0 ? "bg-blue-500 text-white shadow-sm" : "bg-slate-100 text-slate-500"
                )}>
                  {visit.status}
                </span>
              </div>
            </div>
          ))}
        </section>
      </div>
    </DashboardLayout>
  );
};
