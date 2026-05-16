/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, FormEvent } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';
import { doc, setDoc, writeBatch } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '@/lib/firebase';
import { DashboardLayout } from '@/components/DashboardLayout';
import { cn } from '@/lib/utils';
import { api } from '@/services/api';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { 
  TrendingUp, 
  Users as UsersIcon, 
  ShoppingBag, 
  DollarSign,
  AlertCircle,
  X,
  Plus
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Specialized Pages
import { ManagerDashboard } from '@/pages/manager/ManagerDashboard';
import { SalesDashboard } from '@/pages/sales/SalesDashboard';
import { CustomerPortal as CustomerDashboard } from '@/pages/customer/CustomerPortal';
import { Products as AdminProducts } from '@/pages/admin/Products';
import { Customers as AdminCustomers } from '@/pages/admin/Customers';
import { Orders as AdminOrders } from '@/pages/admin/Orders';
import { Users as AdminUsers } from '@/pages/admin/Users';

const data = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 2000 },
  { name: 'Apr', revenue: 2780 },
  { name: 'May', revenue: 1890 },
  { name: 'Jun', revenue: 2390 },
];

const StatCard = ({ title, value, icon: Icon, description, trend, color }: any) => (
  <Card className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
    <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-2">{title}</div>
    <div className="flex items-baseline space-x-2">
      <span className={cn("text-2xl font-black text-slate-800", color)}>{value}</span>
      {trend && (
        <span className={cn(
          "text-[10px] font-bold",
          trend.startsWith('+') ? "text-emerald-500" : "text-rose-500"
        )}>
          {trend}
        </span>
      )}
    </div>
    <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
      <div className={cn("h-full bg-blue-500", color === 'text-rose-600' ? "bg-rose-500" : "bg-blue-500")} style={{ width: '75%' }}></div>
    </div>
    <p className="text-[10px] text-slate-400 mt-2">{description}</p>
  </Card>
);

const AdminDashboard = () => (
  <DashboardLayout role="ADMIN">
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-6">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Distributor Analytics Dashboard</h1>
          <p className="text-slate-500 text-xs">Real-time performance metrics across your enterprise.</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase border border-blue-100 shadow-sm">
            Region: North America
          </span>
        </div>
      </header>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Monthly Revenue" value="$482,900" description="on target for Q3" trend="+12.4%" />
        <StatCard title="Pending Orders" value="142" description="requires warehouse approval" trend="+5.1%" />
        <StatCard title="Low Stock Alerts" value="28" description="critical replenishment needed" color="text-rose-600" />
        <Card className="bg-blue-600 border-none p-4 rounded-xl shadow-lg relative overflow-hidden group">
          <div className="relative z-10">
            <div className="text-white/70 text-[10px] uppercase font-bold tracking-wider">Sales Targets</div>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-black text-white">88.2%</span>
              <span className="text-white/80 text-[10px] font-bold tracking-tighter">Goal Reached</span>
            </div>
            <button className="mt-3 w-full py-1.5 bg-white text-blue-600 text-[10px] font-bold rounded-lg shadow-sm active:scale-95 transition-transform">
              VIEW RECAP
            </button>
          </div>
          <TrendingUp className="absolute -right-2 -bottom-2 h-16 w-16 text-white/10 group-hover:scale-110 transition-transform" />
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-7 min-h-0">
        <Card className="lg:col-span-4 rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col bg-white">
          <CardHeader className="bg-slate-50/50 p-4 border-b border-slate-100 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-800">Revenue Performance Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex-1">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="name" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: '#64748B', fontWeight: 600 }}
                  />
                  <YAxis 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `$${value/1000}k`}
                    tick={{ fill: '#64748B', fontWeight: 600 }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                  />
                  <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 rounded-xl border border-slate-200 shadow-sm flex flex-col bg-white overflow-hidden">
          <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between bg-slate-50/50">
            <div>
              <CardTitle className="text-sm font-bold text-slate-800">Leaderboard</CardTitle>
              <CardDescription className="text-[10px] font-medium text-slate-500 uppercase tracking-tighter">By monthly revenue</CardDescription>
            </div>
            <button className="text-[10px] font-bold text-blue-600 hover:underline">Full Report</button>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {[
                { name: "S. Jenkins", revenue: "$88.4k", orders: 128, color: "bg-blue-100 text-blue-600" },
                { name: "D. Cohen", revenue: "$76.1k", orders: 115, color: "bg-indigo-100 text-indigo-600" },
                { name: "M. Tan", revenue: "$54.9k", orders: 92, color: "bg-emerald-100 text-emerald-600" },
                { name: "R. Sharma", revenue: "$42.2k", orders: 74, color: "bg-orange-100 text-orange-600" },
              ].map((s) => (
                <div key={s.name} className="flex items-center justify-between group cursor-default p-1 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px]", s.color)}>
                      {s.name.split('. ').map(n => n.charAt(0)).join('')}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{s.name}</p>
                      <p className="text-[9px] font-medium text-slate-400 uppercase tracking-tighter">{s.orders} closed deals</p>
                    </div>
                  </div>
                  <div className="text-xs font-black text-slate-900">{s.revenue}</div>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-slate-800 transition-colors">
              Performance Review
            </button>
          </CardContent>
        </Card>
      </div>

      <div className="h-8 flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-widest px-1 font-bold">
        <div className="flex space-x-4">
          <span>Status: <span className="text-emerald-500">Operational</span></span>
          <span className="hidden sm:inline">Build: <span className="text-slate-600 font-mono">v4.8.1-GA</span></span>
        </div>
        <div className="text-slate-500 hidden md:block">
          Enterprise Cloud ERP • DistriSync Core
        </div>
      </div>
    </div>
  </DashboardLayout>
);

const Onboarding = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    ownerName: '',
    mobileNumber: '',
    gstNumber: '',
    address: '',
    city: '',
    state: '',
    industries: [] as string[]
  });
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const suggestions = [
    "Electrical", "AC Spare Parts", "Hardware", "PVC", "Computer Hardware", 
    "FMCG", "Stationery", "Sanitary", "Lighting", "Solar"
  ];

  if (!user) return <Navigate to="/login" />;
  if (profile) return <Navigate to="/" />;

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !formData.industries.includes(trimmed)) {
      setFormData(prev => ({ ...prev, industries: [...prev.industries, trimmed] }));
    }
    setInputValue('');
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({ ...prev, industries: prev.industries.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(2);
      return;
    }
    if (!user || formData.industries.length === 0) return;
    setSubmitting(true);
    try {
      await api.createCompany({
        name: formData.companyName,
        industries: formData.industries,
        gstNumber: formData.gstNumber,
        mobileNumber: formData.mobileNumber,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        ownerId: user.uid
      }, {
        uid: user.uid,
        email: user.email!,
        name: formData.ownerName || user.displayName || 'Owner',
        mobile: formData.mobileNumber
      });
      await refreshProfile();
    } finally {
      setSubmitting(false);
    }
  };

  const filteredSuggestions = suggestions.filter(s => 
    s.toLowerCase().includes(inputValue.toLowerCase()) && !formData.industries.includes(s)
  );

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md border-slate-200 shadow-xl rounded-2xl overflow-hidden bg-white">
        <div className="bg-slate-900 p-6 text-white text-center relative overflow-hidden">
          <div className="relative z-10 text-left">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-black tracking-tight uppercase">DistriSync Terminal</h1>
              <span className="text-[10px] font-bold bg-blue-500 px-2 py-0.5 rounded">STEP {step}/2</span>
            </div>
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mt-1">Enterprise Distributor Provisioning</p>
          </div>
          <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/20 blur-3xl -z-0" />
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Company Name</label>
                <Input required value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="h-10 text-xs rounded-lg" placeholder="e.g. Skyline Enterprise" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Owner Name</label>
                  <Input required value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})} className="h-10 text-xs rounded-lg" placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Mobile</label>
                  <Input required value={formData.mobileNumber} onChange={e => setFormData({...formData, mobileNumber: e.target.value})} className="h-10 text-xs rounded-lg" placeholder="+1..." />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Address</label>
                <Input required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="h-10 text-xs rounded-lg" placeholder="Industrial Area..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">City</label>
                  <Input required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="h-10 text-xs rounded-lg" placeholder="New York" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">State</label>
                  <Input required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="h-10 text-xs rounded-lg" placeholder="NY" />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">GST / Tax Number (Optional)</label>
                <Input value={formData.gstNumber} onChange={e => setFormData({...formData, gstNumber: e.target.value})} className="h-10 text-xs rounded-lg" placeholder="GSTIN..." />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Primary Industries</label>
                <div className="flex flex-wrap gap-1.5 p-2 border border-slate-200 rounded-xl bg-slate-50/50 min-h-[44px]">
                  {formData.industries.map((tag, i) => (
                    <Badge key={i} className="bg-slate-900 group transition-all text-[9px] font-black px-2 py-0.5 rounded-md">
                      {tag}
                      <button type="button" onClick={() => removeTag(i)} className="ml-1 text-slate-500 hover:text-white"><X className="h-2.5 w-2.5" /></button>
                    </Badge>
                  ))}
                  <input
                    onFocus={() => setShowSuggestions(true)}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(inputValue); } }}
                    className="flex-1 bg-transparent border-none outline-none text-xs text-slate-800 placeholder:text-slate-300 min-w-[120px]"
                    placeholder="Add industry..."
                  />
                </div>
                {showSuggestions && inputValue && filteredSuggestions.length > 0 && (
                  <div className="mt-2 bg-white border border-slate-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {filteredSuggestions.map((s) => (
                      <button key={s} type="button" onClick={() => { addTag(s); setShowSuggestions(false); }} className="w-full text-left px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center justify-between group">
                        {s} <Plus className="h-3 w-3 opacity-0 group-hover:opacity-100 text-blue-500" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            {step === 2 && (
              <Button variant="outline" type="button" onClick={() => setStep(1)} className="flex-1 h-12 text-[10px] font-black uppercase tracking-widest border-slate-200">
                Back
              </Button>
            )}
            <button 
              disabled={submitting}
              type="submit"
              className="flex-3 py-3 px-6 bg-blue-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-blue-500/25 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {submitting ? 'Initializing...' : step === 1 ? 'Configure Verticals' : 'Finish Setup'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

const Login = () => {
  const { user, profile } = useAuth();
  if (user && !profile) return <Navigate to="/onboarding" />;
  if (user && profile) {
    if (profile.role === 'ADMIN') return <Navigate to="/admin" />;
    if (profile.role === 'MANAGER') return <Navigate to="/manager" />;
    if (profile.role === 'SALESPERSON') return <Navigate to="/sales" />;
    if (profile.role === 'CUSTOMER') return <Navigate to="/customer" />;
  }
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">DistriSync ERP</h1>
        <button 
          onClick={() => import('./lib/firebase').then(m => m.signIn())}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: string }) => {
  const { user, profile, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && profile?.role !== role) return <Navigate to="/login" />;
  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          
          <Route path="/admin/*" element={
            <ProtectedRoute role="ADMIN">
              <Routes>
                <Route index element={<AdminDashboard />} />
                <Route path="managers" element={<AdminUsers />} />
                <Route path="sales" element={<AdminUsers />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="orders" element={<AdminOrders />} />
              </Routes>
            </ProtectedRoute>
          } />
          
          <Route path="/manager/*" element={
            <ProtectedRoute role="MANAGER">
              <ManagerDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/sales/*" element={
            <ProtectedRoute role="SALESPERSON">
              <SalesDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/customer/*" element={
            <ProtectedRoute role="CUSTOMER">
              <CustomerDashboard />
            </ProtectedRoute>
          } />

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </AuthProvider>
  );
}

