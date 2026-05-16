import React, { useState, useEffect, FormEvent } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { db, OperationType, handleFirestoreError } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { UserProfile, UserRole } from '@/types';
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
  Plus, 
  Search, 
  UserPlus, 
  Shield, 
  Briefcase, 
  Loader2,
  Mail
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export const Users = () => {
  const { profile } = useAuth();
  const location = useLocation();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  const pathRole = location.pathname.includes('managers') ? 'MANAGER' : 
                   location.pathname.includes('sales') ? 'SALESPERSON' : null;

  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    role: (pathRole || 'MANAGER') as UserRole,
  });

  useEffect(() => {
    if (pathRole) {
      setNewUser(prev => ({ ...prev, role: pathRole as UserRole }));
    }
  }, [pathRole]);

  useEffect(() => {
    if (profile?.companyId) {
      loadUsers();
    }
  }, [profile?.companyId]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'users'), where('companyId', '==', profile!.companyId));
      const snapshot = await getDocs(q);
      setUsers(snapshot.docs.map(d => d.data() as UserProfile));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile?.companyId) return;
    try {
      const tempId = `user_${Math.random().toString(36).substring(2, 9)}`;
      await setDoc(doc(db, 'users', tempId), {
        uid: tempId,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        companyId: profile.companyId,
        status: 'active',
        createdAt: new Date().toISOString()
      });
      toast.success('Internal user registered');
      setIsAdding(false);
      loadUsers();
    } catch (err) {
      toast.error('Failed to register user');
    }
  };

  const filteredUsers = users.filter(u => !pathRole || u.role === pathRole);
  const title = pathRole === 'MANAGER' ? 'Management Registry' : 
                pathRole === 'SALESPERSON' ? 'Sales Force Roster' : 
                'Internal User Permission Registry';

  return (
    <DashboardLayout role="ADMIN">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">{title}</h2>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Internal User Permission Registry</p>
          </div>
          
          <Dialog open={isAdding} onOpenChange={setIsAdding}>
            <DialogTrigger asChild>
              <Button className="bg-slate-900 hover:bg-slate-800 text-xs font-bold uppercase tracking-widest rounded-lg h-9">
                <UserPlus className="mr-2 h-4 w-4" /> Provision {pathRole || 'User'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle className="text-sm font-black uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-3">Identity Provisioning</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 pt-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Legal Name</label>
                  <Input required value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="h-8 text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Corporate Email</label>
                  <Input required type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="h-8 text-xs" />
                </div>
                {!pathRole && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-500">System Role</label>
                    <Select value={newUser.role} onValueChange={(v: any) => setNewUser({...newUser, role: v})}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MANAGER">Operations Manager</SelectItem>
                        <SelectItem value="SALESPERSON">Sales Representative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <Button type="submit" className="w-full bg-blue-600 text-[10px] font-black uppercase tracking-[0.2em] h-10 mt-2">Activate Identity</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="rounded-xl border-slate-200 shadow-sm overflow-hidden bg-white">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                    <TableHead className="w-[80px] pl-4"></TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Name & Identity</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Access Level</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-widest text-right pr-4">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-32 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">No staff recorded</TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((u) => (
                      <TableRow key={u.uid} className="group border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                        <TableCell className="pl-4">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px]",
                            u.role === 'ADMIN' ? "bg-slate-900 text-white" : 
                            u.role === 'MANAGER' ? "bg-blue-100 text-blue-600" : 
                            "bg-emerald-100 text-emerald-600"
                          )}>
                            {u.name.charAt(0)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-black text-slate-800">{u.name}</div>
                          <div className="flex items-center text-[9px] font-bold text-slate-400 mt-0.5">
                            <Mail className="h-2.5 w-2.5 mr-1" /> {u.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn(
                            "text-[8px] font-black uppercase tracking-tighter px-1.5 h-4",
                            u.role === 'ADMIN' ? "border-slate-400 text-slate-600" : 
                            u.role === 'MANAGER' ? "border-blue-200 text-blue-600" : 
                            "border-emerald-200 text-emerald-600"
                          )}>
                            {u.role === 'ADMIN' ? <Shield className="h-2 w-2 mr-1" /> : <Briefcase className="h-2 w-2 mr-1" />}
                            {u.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-4">
                          <Badge className="bg-emerald-500 text-[8px] font-black h-4 px-2 uppercase">Active</Badge>
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
