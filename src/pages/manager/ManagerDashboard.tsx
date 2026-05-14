import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  Users, 
  MapPin, 
  ShoppingBag, 
  CheckCircle2, 
  Clock,
  ArrowUpRight
} from 'lucide-react';

const TeamCard = ({ agent }: any) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100">
        {agent.name.charAt(0)}
      </div>
      <div>
        <h4 className="font-medium text-gray-900">{agent.name}</h4>
        <div className="flex items-center text-xs text-gray-500">
          <MapPin className="h-3 w-3 mr-1" />
          {agent.lastSeen}
        </div>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm font-semibold text-gray-900">{agent.revenue}</p>
      <p className="text-[10px] text-green-600 font-medium">{agent.visits} visits</p>
    </div>
  </div>
);

export const ManagerDashboard = () => {
  return (
    <DashboardLayout role="MANAGER">
      <div className="space-y-6">
        <header className="border-b border-slate-200 pb-4 mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Manager Operations Console</h2>
            <p className="text-slate-500 text-xs">Monitoring 4 active salespersons in your assigned region.</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Sync: Active</span>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-white border-slate-200 p-4 shadow-sm">
            <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">Team Revenue</div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-slate-800">$24,850</span>
              <span className="text-emerald-500 text-[10px] font-bold">+8.2%</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 uppercase font-semibold tracking-tighter">Current Month Performance</p>
          </Card>
          <Card className="bg-white border-slate-200 p-4 shadow-sm">
            <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">Total Visits</div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-slate-800">48</span>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter">Locations Touched</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 uppercase font-semibold tracking-tighter">Route Efficiency: 92%</p>
          </Card>
          <Card className="bg-amber-50 border-amber-200 p-4 shadow-sm">
            <div className="text-amber-800 text-[10px] uppercase font-bold tracking-wider mb-1">Pending CRM Requests</div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-amber-900">3</span>
              <span className="text-amber-600 text-[10px] font-bold uppercase tracking-tighter animate-bounce">Awaiting Review</span>
            </div>
            <p className="text-[10px] text-amber-700 mt-1 font-bold underline cursor-pointer">Approve Now</p>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="rounded-xl border-slate-200 shadow-sm overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 p-4 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-slate-800">Sales Force Real-time Status</CardTitle>
              </div>
              <button className="text-[10px] font-bold text-blue-600 hover:underline px-2 py-1 bg-blue-50 rounded">GPS Log</button>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {[
                { name: "Alice Johnson", revenue: "$8,200", visits: 14, lastSeen: "2m ago - Sector 4", color: "bg-blue-100 text-blue-600" },
                { name: "Bob Williams", revenue: "$6,500", visits: 12, lastSeen: "15m ago - Ind. Area", color: "bg-slate-100 text-slate-600" },
                { name: "Charlie Davis", revenue: "$5,800", visits: 10, lastSeen: "Just now - Center", color: "bg-emerald-100 text-emerald-600" },
                { name: "Diana Prince", revenue: "$4,350", visits: 12, lastSeen: "1h ago - Highway", color: "bg-amber-100 text-amber-600" },
              ].map((agent, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50/30 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={cn("h-8 w-8 rounded-full flex items-center justify-center font-bold text-[10px]", agent.color)}>
                      {agent.name.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{agent.name}</h4>
                      <p className="text-[9px] font-medium text-slate-400 uppercase tracking-tighter">{agent.lastSeen}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-900">{agent.revenue}</p>
                    <p className="text-[9px] text-green-600 font-bold uppercase tracking-widest">{agent.visits} Visits</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-xl border-slate-200 shadow-sm overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 p-4 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-800">Recent Dispatch Queue</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50">
                {[
                  { id: "#ORD-9921", customer: "Tech Solutions", amount: "$1,200", status: "Approved" },
                  { id: "#ORD-9920", customer: "Apex Cooling", amount: "$2,450", status: "In Approval" },
                  { id: "#ORD-9919", customer: "Reliable PVC", amount: "$890", status: "Approved" },
                  { id: "#ORD-9918", customer: "Metro Hardware", amount: "$3,200", status: "In Approval" },
                ].map((order, i) => (
                  <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 transition-colors">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-blue-600 font-mono">{order.id}</p>
                      <p className="text-[10px] font-bold text-slate-800 truncate max-w-[120px]">{order.customer}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs font-black text-slate-900 font-mono">{order.amount}</p>
                        <span className={cn(
                          "text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full",
                          order.status === 'Approved' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        )}>
                          {order.status}
                        </span>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-slate-300" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
