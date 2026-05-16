import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { Order } from '@/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Loader2,
  Package,
  CheckCircle,
  XCircle,
  Truck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export const Orders = () => {
  const { profile } = useAuth();
  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.companyId) {
      loadOrders();
    }
  }, [profile?.companyId]);

  const loadOrders = async () => {
    setLoading(true);
    const data = await api.getOrders(profile!.companyId);
    if (data) setOrders(data);
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-amber-500",
      approved: "bg-blue-500",
      packed: "bg-indigo-500",
      dispatched: "bg-purple-500",
      delivered: "bg-emerald-500",
      cancelled: "bg-rose-500",
      returned: "bg-slate-500",
    };
    return (
      <Badge className={cn("text-[8px] px-2 h-4 uppercase font-black", colors[status] || "bg-slate-500")}>
        {status}
      </Badge>
    );
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(search.toLowerCase()) || 
    o.customerId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout role="ADMIN">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Order Management System</h2>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Real-time Fulfillment Pipeline</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="text-xs font-bold uppercase tracking-widest rounded-lg h-9 border-slate-200">
              Export Manifest
            </Button>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[
            { label: "New Orders", value: orders.filter(o => o.status === 'pending').length.toString(), icon: Package, col: "text-amber-600" },
            { label: "In Transit", value: orders.filter(o => o.status === 'dispatched').length.toString(), icon: Truck, col: "text-blue-600" },
            { label: "Delivered", value: orders.filter(o => o.status === 'delivered').length.toString(), icon: CheckCircle, col: "text-emerald-600" },
            { label: "Cancelled", value: orders.filter(o => o.status === 'cancelled').length.toString(), icon: XCircle, col: "text-rose-600" },
          ].map(stat => (
            <Card key={stat.label} className="bg-white border-slate-100 p-3 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className={cn("text-xl font-black", stat.col)}>{stat.value}</p>
              </div>
              <stat.icon className={cn("h-8 w-8 opacity-10", stat.col)} />
            </Card>
          ))}
        </div>

        <Card className="rounded-xl border-slate-200 shadow-sm overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/30 border-b border-slate-100 flex flex-row items-center justify-between p-3">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                className="pl-9 h-8 bg-white border-slate-200 text-xs rounded-lg placeholder:text-slate-300" 
                placeholder="Search by Order ID or Customer..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <button onClick={loadOrders} className="p-1.5 hover:bg-slate-100 rounded-md">
                {loading ? <Loader2 className="h-4 w-4 text-blue-500 animate-spin" /> : <Filter className="h-4 w-4 text-slate-400" />}
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                    <TableHead className="w-[120px] text-[10px] font-black uppercase text-slate-500 pl-4 tracking-widest">Order ID</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Customer / Source</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Status</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">Amount</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-widest text-right pr-4">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/20">
                        No active orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((o) => (
                      <TableRow key={o.id} className="group border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                        <TableCell className="font-mono text-[10px] text-blue-600 font-bold pl-4 uppercase tracking-tighter">#{o.id.split('_')[1]}</TableCell>
                        <TableCell>
                          <div className="text-xs font-black text-slate-800 capitalize">{o.customerId}</div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Via {o.source}</div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(o.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-xs font-black font-mono text-slate-900">
                            ${o.totalAmount.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right pr-4">
                          <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 px-2 py-1 rounded transition-colors">
                            Details
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};
