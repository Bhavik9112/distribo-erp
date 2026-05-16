import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  Search, 
  PlusCircle, 
  MapPin, 
  History, 
  TrendingUp,
  Navigation
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { OrderForm } from '@/components/OrderForm';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '@/services/api';
import { toast } from 'sonner';

export const SalesDashboard = () => {
  const { profile } = useAuth();
  const [isOrdering, setIsOrdering] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [visitNote, setVisitNote] = useState('');

  const handleCheckIn = async () => {
    if (!profile?.companyId) return;
    try {
      await api.createVisitLog(profile.companyId, {
        salespersonId: profile.uid,
        customerId: 'GPS_AUTO', // In a real app, we'd detect the nearest customer
        location: { lat: 0, lng: 0 }, // Would use navigator.geolocation
        notes: visitNote || 'Routine site visit',
        timestamp: new Date().toISOString()
      });
      toast.success('Check-in synchronized');
      setIsCheckingIn(false);
      setVisitNote('');
    } catch (err) {
      toast.error('Check-in failed');
    }
  };

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
          <button className="flex flex-col items-start p-3 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-blue-200 transition-all active:scale-95 text-left overflow-hidden relative group">
            <div className="p-2 rounded-lg mb-2 text-white shadow-md bg-blue-500">
              <Search className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[11px] font-black text-slate-800 uppercase tracking-tighter block">Lookup Party</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">CRM Search</span>
            </div>
          </button>

          <Dialog open={isOrdering} onOpenChange={setIsOrdering}>
            <DialogTrigger asChild>
              <button className="flex flex-col items-start p-3 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-blue-200 transition-all active:scale-95 text-left overflow-hidden relative group">
                <div className="p-2 rounded-lg mb-2 text-white shadow-md bg-emerald-500">
                  <PlusCircle className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[11px] font-black text-slate-800 uppercase tracking-tighter block">Take Order</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sync Live Cart</span>
                </div>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-sm font-black uppercase tracking-widest text-slate-900 border-b pb-3">Field Sales Fulfillment</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <OrderForm 
                  companyId={profile?.companyId || ''} 
                  salespersonId={profile?.uid || ''} 
                  onSuccess={() => setIsOrdering(false)} 
                />
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isCheckingIn} onOpenChange={setIsCheckingIn}>
            <DialogTrigger asChild>
              <button className="flex flex-col items-start p-3 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-blue-200 transition-all active:scale-95 text-left overflow-hidden relative group">
                <div className="p-2 rounded-lg mb-2 text-white shadow-md bg-indigo-500">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[11px] font-black text-slate-800 uppercase tracking-tighter block">Check-in</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">GPS Log</span>
                </div>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle className="text-sm font-black uppercase tracking-widest text-slate-900 border-b pb-3">Operational Check-in</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Navigation className="h-5 w-5 text-blue-600 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Location Accuracy</p>
                    <p className="text-xs font-bold text-slate-800">± 5 meters • Sector 4 Ind. Area</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Visit Observations</label>
                  <textarea 
                    className="w-full min-h-[80px] p-2 text-xs border border-slate-200 rounded-lg bg-white focus:ring-1 focus:ring-blue-500 outline-none" 
                    placeholder="Enter visit summary, market feedback or remarks..."
                    value={visitNote}
                    onChange={e => setVisitNote(e.target.value)}
                  />
                </div>
                <Button onClick={handleCheckIn} className="w-full bg-slate-900 text-[10px] font-black uppercase tracking-[0.2em] h-10">
                  Sync Coordinates & Log
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <button className="flex flex-col items-start p-3 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-blue-200 transition-all active:scale-95 text-left overflow-hidden relative group">
            <div className="p-2 rounded-lg mb-2 text-white shadow-md bg-slate-700">
              <History className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[11px] font-black text-slate-800 uppercase tracking-tighter block">Audit Log</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Daily History</span>
            </div>
          </button>
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
