import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Product, Customer } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Trash2, Plus, ShoppingCart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface OrderFormProps {
  companyId: string;
  salespersonId: string;
  onSuccess: () => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({ companyId, salespersonId, onSuccess }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [items, setItems] = useState<{ productId: string, quantity: number, price: number }[]>([]);

  useEffect(() => {
    async function loadData() {
      const [c, p] = await Promise.all([
        api.getCustomers(companyId),
        api.getProducts(companyId)
      ]);
      if (c) setCustomers(c);
      if (p) setProducts(p);
      setLoading(false);
    }
    loadData();
  }, [companyId]);

  const addItem = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    setItems([...items, { productId, quantity: 1, price: product.price }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotal = () => items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = async () => {
    if (!selectedCustomerId || items.length === 0) {
      toast.error('Please select customer and add items');
      return;
    }

    setSubmitting(true);
    try {
      await api.createOrder(companyId, {
        customerId: selectedCustomerId,
        salespersonId: salespersonId,
        items: items.map(i => ({ 
          productId: i.productId, 
          quantity: i.quantity, 
          unitPrice: i.price, 
          total: i.price * i.quantity 
        })),
        totalAmount: calculateTotal(),
        status: 'pending',
        source: 'salesperson'
      });
      toast.success('Order synchronized successfully');
      setItems([]);
      onSuccess();
    } catch (err) {
      toast.error('Fulfillment error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-blue-500" /></div>;

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-slate-500">Target Customer / Party</label>
        <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
          <SelectTrigger className="h-9 text-xs">
            <SelectValue placeholder="Select Party Account" />
          </SelectTrigger>
          <SelectContent>
            {customers.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.firmName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-slate-500">Inventory Catalog</label>
        <div className="flex gap-2">
          <Select onValueChange={addItem}>
            <SelectTrigger className="h-9 text-xs flex-1">
              <SelectValue placeholder="Add SKU to Cart" />
            </SelectTrigger>
            <SelectContent>
              {products.map(p => (
                <SelectItem key={p.id} value={p.id} disabled={p.stock <= 0}>
                  {p.sku} - {p.name} (${p.price}) {p.stock <= 0 ? '(OOS)' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50/30">
        <Table>
          <TableHeader>
            <TableRow className="h-8 bg-white">
              <TableHead className="text-[9px] font-black uppercase text-slate-500">SKU</TableHead>
              <TableHead className="text-[9px] font-black uppercase text-slate-500">Qty</TableHead>
              <TableHead className="text-[9px] font-black uppercase text-slate-500 text-right">Price</TableHead>
              <TableHead className="w-[40px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, i) => {
              const product = products.find(p => p.id === item.productId);
              return (
                <TableRow key={i} className="h-10 hover:bg-white transition-colors">
                  <TableCell className="text-[10px] font-bold text-slate-800 uppercase">{product?.sku}</TableCell>
                  <TableCell>
                    <Input 
                      type="number" 
                      className="h-6 w-12 text-[10px] p-1 font-bold" 
                      value={item.quantity} 
                      onChange={e => {
                        const newItems = [...items];
                        newItems[i].quantity = Number(e.target.value);
                        setItems(newItems);
                      }}
                    />
                  </TableCell>
                  <TableCell className="text-right text-[10px] font-black text-slate-900">${(item.price * item.quantity).toLocaleString()}</TableCell>
                  <TableCell>
                    <button onClick={() => removeItem(i)} className="text-rose-400 hover:text-rose-600 transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-20 text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">Cart Empty</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl text-white">
        <div>
          <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">Cart Valuation</p>
          <p className="text-lg font-black tracking-tighter">${calculateTotal().toLocaleString()}</p>
        </div>
        <Button 
          disabled={submitting || items.length === 0} 
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-[10px] font-black uppercase tracking-widest h-9 px-6"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><ShoppingCart className="h-3.5 w-3.5 mr-2" /> Sync Order</>}
        </Button>
      </div>
    </div>
  );
};
