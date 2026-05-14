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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Products = () => {
  const [search, setSearch] = useState('');

  const products = [
    { sku: "CP-102", name: "Rotary Compressor 1.5T", brand: "Godrej", category: "Compressors", stock: 45, price: "$120" },
    { sku: "CP-105", name: "Copper Pipe 1/4 (15m)", brand: "Generic", category: "Pipes", stock: 120, price: "$45" },
    { sku: "MT-201", name: "AC Fan Motor YSK", brand: "Panasonic", category: "Motors", stock: 8, price: "$35" },
    { sku: "EL-502", name: "Capacitor 45uF", brand: "Havells", category: "Electrical", stock: 250, price: "$8" },
    { sku: "EL-503", name: "Circuit Breaker 32A", brand: "Schneider", category: "Switchgear", stock: 64, price: "$25" },
  ];

  return (
    <DashboardLayout role="ADMIN">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Inventory & Stock Console</h2>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-tighter">Centralized Product Catalog Management</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-xs font-bold uppercase tracking-wider rounded-lg h-9 shadow-md shadow-blue-500/20">
            <Plus className="mr-2 h-4 w-4" /> Import Inventory
          </Button>
        </div>

        <Card className="rounded-xl border-slate-200 shadow-sm overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between p-3">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                className="pl-9 h-8 bg-white border-slate-200 text-xs rounded-lg" 
                placeholder="Lookup SKU, Brand or Series..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] font-black uppercase text-slate-500 border-slate-200 px-2 py-0.5">
                428 SKUs Active
              </Badge>
              <button className="p-1.5 hover:bg-slate-100 rounded-md">
                <Filter className="h-4 w-4 text-slate-400" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100">
                  <TableHead className="w-[120px] text-[10px] uppercase font-black text-slate-500 tracking-widest pl-4">Part # / SKU</TableHead>
                  <TableHead className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Description</TableHead>
                  <TableHead className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Brand</TableHead>
                  <TableHead className="text-[10px] uppercase font-black text-slate-500 tracking-widest text-right">Qty</TableHead>
                  <TableHead className="text-[10px] uppercase font-black text-slate-500 tracking-widest text-right pr-4">Dist. Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((item) => (
                  <TableRow key={item.sku} className="group border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                    <TableCell className="font-mono text-xs text-blue-600 font-bold pl-4">{item.sku}</TableCell>
                    <TableCell>
                      <div className="text-xs font-bold text-slate-800">{item.name}</div>
                      <div className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">{item.category}</div>
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-slate-600">{item.brand}</TableCell>
                    <TableCell className="text-right">
                      <span className={cn(
                        "text-xs font-mono font-bold px-2 py-0.5 rounded",
                        item.stock < 10 ? "bg-rose-100 text-rose-700" : "text-slate-900"
                      )}>
                        {item.stock}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <span className="text-xs font-black text-slate-900 font-mono">{item.price}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <div className="p-3 bg-slate-50/50 border-t border-slate-100 text-center">
            <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">
              Load 50 More Items
            </button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};
