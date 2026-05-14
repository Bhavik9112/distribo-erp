import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ShoppingCart, Heart, Filter } from 'lucide-react';

const ProductCard = ({ product }: any) => (
  <Card className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-all group bg-white rounded-xl">
    <div className="aspect-square bg-slate-100 relative overflow-hidden isolate">
      <img 
        src={product.image || `https://placehold.co/400?text=${product.name}`} 
        alt={product.name}
        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-slate-900/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform">
        <button className="w-full py-1.5 bg-white/90 backdrop-blur text-[10px] font-black uppercase tracking-widest text-slate-900 rounded-lg shadow-sm">
          Specifications
        </button>
      </div>
      <button className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm active:scale-90">
        <Heart className="h-3 w-3 text-slate-600" />
      </button>
    </div>
    <CardContent className="p-3">
      <div className="flex justify-between items-start mb-0.5">
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none">{product.brand}</p>
        <Badge variant="outline" className="text-[8px] font-black uppercase border-slate-200 px-1 py-0 leading-none h-3">{product.category}</Badge>
      </div>
      <h3 className="font-black text-xs text-slate-800 mb-2 truncate uppercase tracking-tighter">{product.name}</h3>
      <div className="flex items-center justify-between">
        <p className="text-sm font-black text-blue-600 font-mono tracking-tighter">${product.price}</p>
        <button className="p-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition active:scale-90 shadow-sm">
          <ShoppingCart className="h-3.5 w-3.5" />
        </button>
      </div>
    </CardContent>
  </Card>
);

export const CustomerPortal = () => {
  const [search, setSearch] = useState('');

  const products = [
    { id: 1, name: "Rotary Compressor 1.5T", brand: "Godrej", price: 120, category: "Compressors" },
    { id: 2, name: "Copper Pipe 1/4 (15m)", brand: "Generic", price: 45, category: "Pipes" },
    { id: 3, name: "AC Fan Motor YSK", brand: "Panasonic", price: 35, category: "Motors" },
    { id: 4, name: "Capacitor 45uF", brand: "Havells", price: 8, category: "Electrical" },
    { id: 5, name: "Circuit Breaker 32A", brand: "Schneider", price: 25, category: "Switchgear" },
    { id: 6, name: "Industrial V-Belt", brand: "Gates", price: 15, category: "Mechanical" },
  ];

  return (
    <DashboardLayout role="CUSTOMER">
      <div className="space-y-6 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-6">
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none uppercase">Distribution Marketplace</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Live Inventory Availability</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input 
                className="pl-9 w-full md:w-[250px] h-8 text-[11px] bg-white border-slate-200 rounded-lg shadow-sm" 
                placeholder="SKU, Part # or Model..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="p-1.5 border border-slate-200 rounded-lg hover:bg-white shadow-sm transition-colors active:scale-95">
              <Filter className="h-4 w-4 text-slate-600" />
            </button>
          </div>
        </header>

        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </section>

        <div className="h-12 border-t border-slate-200 mt-12 flex items-center justify-center p-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">End of catalog • System Synced</p>
        </div>
      </div>
    </DashboardLayout>
  );
};
