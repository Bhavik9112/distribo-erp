import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { Order, UserProfile } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  Users, 
  MapPin, 
  ShoppingBag, 
  CheckCircle2, 
  Clock,
  ArrowUpRight,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export const ManagerDashboard = () => {
  const { profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [team, setTeam] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.companyId) {
      loadData();
    }
  }, [profile?.companyId]);

  const loadData = async () => {
    setLoading(true);
    const [ordersData] = await Promise.all([
      api.getOrders(profile!.companyId),
    ]);
    if (ordersData) setOrders(ordersData);
    setLoading(false);
  };

  const pendingOrders = orders.filter(o => o.status === 'pending');

  return (
    <DashboardLayout role="MANAGER">
      <div className="space-y-6">
        <header className="border-b border-slate-200 pb-4 mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Manager Operations Console</h2>
            <p className="text-slate-500 text-xs">Monitoring regional performance and fulfillment queue.</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Sync: Active</span>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-white border-slate-200 p-4 shadow-sm">
            <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">Queue Health</div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-slate-800">{pendingOrders.length}</span>
              <span className="text-amber-500 text-[10px] font-bold uppercase tracking-widest">Awaiting Review</span>
            </div>
          </Card>
          <Card className="bg-white border-slate-200 p-4 shadow-sm">
            <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">Total Pipeline</div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-slate-800">${orders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}</span>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter">Current Month</span>
            </div>
          </Card>
          <Card className={cn(
            "p-4 shadow-sm transition-colors",
            pendingOrders.length > 3 ? "bg-rose-50 border-rose-200" : "bg-emerald-50 border-emerald-200"
          )}>
            <div className="text-[10px] uppercase font-bold tracking-wider mb-1">Response Time SLA</div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black">94.8%</span>
              <span className="text-[10px] font-bold uppercase tracking-tighter">On Target</span>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-1">
          <Card className="rounded-xl border-slate-200 shadow-sm overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 p-4 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-tight">Fulfillment Approval Queue</CardTitle>
              {loading && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {pendingOrders.length === 0 ? (
                  <div className="p-8 text-center text-xs font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/20">
                    Queue Cleared • All Orders Dispatched
                  </div>
                ) : (
                  pendingOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                      <div className="space-y-1">
                        <p className="text-xs font-black text-blue-600 font-mono tracking-tighter uppercase">#{order.id.split('_')[1]}</p>
                        <p className="text-[10px] font-bold text-slate-800 uppercase truncate max-w-[200px]">{order.customerId}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-xs font-black text-slate-900 font-mono">${order.totalAmount.toLocaleString()}</p>
                          <span className="text-[9px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                            Pending Approval
                          </span>
                        </div>
                        <button 
                          onClick={() => toast.success(`Order ${order.id} approved`)}
                          className="px-4 py-1.5 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-800 shadow-sm"
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
