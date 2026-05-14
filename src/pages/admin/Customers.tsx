import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
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
import { Plus, Search, Filter, Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Customers = () => {
  const [search, setSearch] = useState('');

  const customers = [
    { id: "C-001", name: "Metro Hardware Store", type: "Wholesaler", city: "New York", balance: "$2,450", status: "Active" },
    { id: "C-002", name: "Apex Cooling Solutions", type: "Retailer", city: "Chicago", balance: "$0", status: "Active" },
    { id: "C-003", name: "Reliable PVC Pipes", type: "Dealer", city: "Los Angeles", balance: "$1,890", status: "Blocked" },
    { id: "C-004", name: "Tech Solutions Inc", type: "Dealer", city: "Houston", balance: "$4,200", status: "Active" },
    { id: "C-005", name: "Global Spares", type: "Wholesaler", city: "Phoenix", balance: "$550", status: "Active" },
  ];

  return (
    <DashboardLayout role="ADMIN">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">CRM & Partner Directory</h2>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Enterprise Customer Database</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-xs font-bold uppercase tracking-widest rounded-lg h-9">
            <Plus className="mr-2 h-4 w-4" /> Register New Account
          </Button>
        </div>

        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Accounts", value: "128", col: "text-blue-600" },
            { label: "Pending Approvals", value: "5", col: "text-amber-600" },
            { label: "High Credit Usage", value: "12", col: "text-rose-600" },
            { label: "Top Region", value: "NE-01", col: "text-indigo-600" },
          ].map(stat => (
            <Card key={stat.label} className="bg-white border-slate-100 p-3 shadow-sm">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className={cn("text-xl font-black", stat.col)}>{stat.value}</p>
            </Card>
          ))}
        </div>

        <Card className="rounded-xl border-slate-200 shadow-sm overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/30 border-b border-slate-100 flex flex-row items-center justify-between p-3 space-y-0">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                className="pl-9 h-8 bg-white border-slate-200 text-xs rounded-lg" 
                placeholder="Search by Firm, GST or Manager..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <button className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
                Quick Filter
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                  <TableHead className="w-[100px] text-[10px] font-black uppercase text-slate-500 pl-4 tracking-widest">Acc ID</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Firm Designation</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Type</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">Outstanding</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-widest text-right pr-4">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((c) => (
                  <TableRow key={c.id} className="group border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                    <TableCell className="font-mono text-[10px] text-slate-400 pl-4 tracking-tighter">{c.id}</TableCell>
                    <TableCell>
                      <div className="text-xs font-black text-slate-800">{c.name}</div>
                      <div className="flex gap-3 mt-1">
                        <div className="flex items-center text-[9px] font-bold text-slate-400">
                          <MapPin className="h-2.5 w-2.5 mr-1" />
                          {c.city}
                        </div>
                        <div className="flex items-center text-[9px] font-black text-emerald-600">
                          <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                          VERIFIED
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[9px] font-black border-slate-200 uppercase tracking-tighter px-1.5 py-0">
                        {c.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={cn(
                        "text-xs font-black font-mono",
                        c.balance !== '$0' ? "text-rose-600" : "text-emerald-600"
                      )}>
                        {c.balance}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 px-2 py-1 rounded transition-colors">
                        Inspect
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center px-4">
            <p className="text-[9px] font-bold text-slate-400">Showing 5 of 128 registered partners</p>
            <div className="flex gap-1">
              <button className="p-1 px-2 border border-slate-200 rounded text-[9px] font-black uppercase text-slate-500">Prev</button>
              <button className="p-1 px-2 bg-slate-900 rounded text-[9px] font-black uppercase text-white shadow-sm">Next</button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};
