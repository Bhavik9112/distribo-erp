export type UserRole = 'ADMIN' | 'MANAGER' | 'SALESPERSON' | 'CUSTOMER';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  companyId: string;
  status: 'active' | 'inactive';
  mobile?: string;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  industries: string[];
  gstNumber?: string;
  mobileNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  logo?: string;
  ownerId: string;
  createdAt: string;
}

export interface Product {
  id: string;
  companyId: string;
  sku: string;
  name: string;
  description: string;
  brandId: string;
  categoryId: string;
  price: number;
  costPrice?: number;
  stock: number;
  images: string[];
  attributes: Record<string, any>;
  status: 'active' | 'archived';
}

export interface Brand {
  id: string;
  companyId: string;
  name: string;
  logo?: string;
}

export interface Category {
  id: string;
  companyId: string;
  name: string;
  parentId?: string;
}

export interface Customer {
  id: string;
  companyId: string;
  firmName: string;
  contactName: string;
  mobile: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  gstNumber?: string;
  hasGst: boolean;
  creditLimit: number;
  outstandingBalance: number;
  salespersonId: string;
  managerId?: string;
  status: 'active' | 'blocked' | 'pending';
  tags: string[];
}

export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Order {
  id: string;
  companyId: string;
  customerId: string;
  salespersonId: string;
  status: 'pending' | 'approved' | 'packed' | 'dispatched' | 'delivered' | 'cancelled' | 'returned';
  totalAmount: number;
  items: OrderItem[];
  source: 'customer' | 'salesperson' | 'admin';
  createdAt: string;
  updatedAt: string;
}
