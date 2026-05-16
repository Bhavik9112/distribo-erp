import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ShoppingCart, Heart, Filter, Loader2, Package } from 'lucide-react';
import { toast } from 'sonner';

const ProductCard = ({ product, onAddToCart }: any) => (
  <Card className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-all group bg-white rounded-xl flex flex-col">
    <div className="aspect-square bg-slate-100 relative overflow-hidden isolate">
      <img 
        src={`https://placehold.co/400?text=${product.sku}`} 
        alt={product.name}
        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-slate-900/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform">
        <button className="w-full py-1.5 bg-white/90 backdrop-blur text-[10px] font-black uppercase tracking-widest text-slate-900 rounded-lg shadow-sm">
          Specifications
        </button>
      </div>
      <Badge className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur text-[8px] font-black uppercase py-0.5 px-1.5 border-none h-4">
        {product.stock > 0 ? "IN STOCK" : "OUT OF STOCK"}
      </Badge>
    </div>
    <CardContent className="p-3 flex-1 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-0.5">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none">{product.brand}</p>
          <Badge variant="outline" className="text-[8px] font-black uppercase border-slate-200 px-1 py-0 leading-none h-3">{product.category}</Badge>
        </div>
        <h3 className="font-black text-xs text-slate-800 mb-2 uppercase tracking-tighter line-clamp-2 min-h-[2rem] leading-tight mt-1">{product.name}</h3>
      </div>
      <div className="flex items-center justify-between mt-2">
        <p className="text-sm font-black text-blue-600 font-mono tracking-tighter">${product.price.toLocaleString()}</p>
        <button 
          onClick={() => onAddToCart(product)}
          disabled={product.stock <= 0}
          className="p-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 transition active:scale-90 shadow-sm"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
        </button>
      </div>
    </CardContent>
  </Card>
);

export const CustomerPortal = () => {
  const { profile } = useAuth();
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    if (profile?.companyId) {
      loadProducts();
    }
  }, [profile?.companyId]);

  const loadProducts = async () => {
    setLoading(true);
    const data = await api.getProducts(profile!.companyId);
    if (data) setProducts(data);
    setLoading(false);
  };

  const handleAddToCart = (p: Product) => {
    toast.success(`${p.name} added to cart`);
    setCart([...cart, p]);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout role="CUSTOMER">
      <div className="space-y-6 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xs shadow-xl rotate-3">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none uppercase">Distribution Marketplace</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Live Catalog • Member: {profile?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input 
                className="pl-9 w-full md:w-[250px] h-8 text-[11px] bg-white border-slate-200 rounded-lg shadow-sm placeholder:text-slate-300" 
                placeholder="SKU, Part # or Model..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-3 h-8 bg-slate-900 border border-slate-900 rounded-lg text-white text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg">
              <ShoppingCart className="h-3.5 w-3.5" />
              <span>Checkout ({cart.length})</span>
            </button>
          </div>
        </header>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          </div>
        ) : (
          <>
            <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-full h-40 flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
                  <Package className="h-8 w-8 text-slate-300 mb-2" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No matching SKUs available</p>
                </div>
              )}
            </section>

            <div className="h-12 border-t border-slate-200 mt-12 flex items-center justify-center p-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">End of catalog • Live Sync Active</p>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};
