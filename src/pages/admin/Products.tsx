import React, { useState, useEffect, FormEvent } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { Product } from '@/types';
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
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Loader2
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export const Products = () => {
  const { profile } = useAuth();
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({
    sku: '',
    name: '',
    price: 0,
    stock: 0,
    brandId: 'generic',
    categoryId: 'uncategorized'
  });

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

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile?.companyId) return;
    try {
      await api.createProduct(profile.companyId, {
        ...newProduct,
        description: '',
        images: [],
        attributes: {},
        status: 'active'
      } as any);
      toast.success('Product created successfully');
      setIsAdding(false);
      loadProducts();
    } catch (err) {
      toast.error('Failed to create product');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout role="ADMIN">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Inventory & Stock Console</h2>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-tighter">Centralized Product Catalog Management</p>
          </div>
          
          <Dialog open={isAdding} onOpenChange={setIsAdding}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-xs font-bold uppercase tracking-wider rounded-lg h-9 shadow-md shadow-blue-500/20">
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-sm font-black uppercase tracking-widest text-slate-900">New Inventory Entry</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-500">SKU / Code</label>
                    <Input required value={newProduct.sku} onChange={e => setNewProduct({...newProduct, sku: e.target.value})} className="h-8 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-500">Name</label>
                    <Input required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="h-8 text-xs" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-500">Price</label>
                    <Input required type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} className="h-8 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-500">Initial Stock</label>
                    <Input required type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: Number(e.target.value)})} className="h-8 text-xs" />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-slate-900 text-[10px] font-black uppercase tracking-[0.2em] h-10 mt-2">Provision Item</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="rounded-xl border-slate-200 shadow-sm overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between p-3">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                className="pl-9 h-8 bg-white border-slate-200 text-xs rounded-lg placeholder:text-slate-300" 
                placeholder="Lookup SKU, Brand or Series..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] font-black uppercase text-slate-500 border-slate-200 px-2 py-0.5">
                {products.length} SKUs Active
              </Badge>
              <button onClick={loadProducts} className="p-1.5 hover:bg-slate-100 rounded-md">
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
                  <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100">
                    <TableHead className="w-[120px] text-[10px] uppercase font-black text-slate-500 tracking-widest pl-4">Part # / SKU</TableHead>
                    <TableHead className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Description</TableHead>
                    <TableHead className="text-[10px] uppercase font-black text-slate-500 tracking-widest text-right">Qty</TableHead>
                    <TableHead className="text-[10px] uppercase font-black text-slate-500 tracking-widest text-right pr-4">Dist. Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-32 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/20">
                        No product mapping found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((item) => (
                      <TableRow key={item.id} className="group border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                        <TableCell className="font-mono text-xs text-blue-600 font-bold pl-4 uppercase">{item.sku}</TableCell>
                        <TableCell>
                          <div className="text-xs font-bold text-slate-800">{item.name}</div>
                          <div className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">{item.categoryId}</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={cn(
                            "text-xs font-mono font-bold px-2 py-0.5 rounded",
                            item.stock < 10 ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-700"
                          )}>
                            {item.stock}
                          </span>
                        </TableCell>
                        <TableCell className="text-right pr-4">
                          <span className="text-xs font-black text-slate-900 font-mono">${item.price}</span>
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
