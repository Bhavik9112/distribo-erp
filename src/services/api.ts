import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit as firestoreLimit,
  writeBatch,
  onSnapshot
} from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '@/lib/firebase';
import { 
  Company, 
  UserProfile, 
  Product, 
  Customer, 
  Order, 
  Brand, 
  Category 
} from '@/types';

// Generic CRUD factory or pattern
const getCollectionPath = (companyId: string, subPath: string) => `companies/${companyId}/${subPath}`;

export const api = {
  // Company & Onboarding
  async createCompany(companyData: Partial<Company>, adminData: Partial<UserProfile>) {
    const companyId = `comp_${Math.random().toString(36).substring(2, 9)}`;
    const batch = writeBatch(db);

    const companyRef = doc(db, 'companies', companyId);
    batch.set(companyRef, {
      ...companyData,
      id: companyId,
      createdAt: new Date().toISOString(),
    });

    const userRef = doc(db, 'users', adminData.uid!);
    batch.set(userRef, {
      ...adminData,
      companyId,
      role: 'ADMIN',
      status: 'active',
      createdAt: new Date().toISOString(),
    });

    try {
      await batch.commit();
      return companyId;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'onboarding/batch');
    }
  },

  // Products
  async getProducts(companyId: string) {
    const path = getCollectionPath(companyId, 'products');
    try {
      const q = query(collection(db, path), orderBy('name'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  async createProduct(companyId: string, productData: Partial<Product>) {
    const path = getCollectionPath(companyId, 'products');
    const id = `prod_${Math.random().toString(36).substring(2, 9)}`;
    try {
      await setDoc(doc(db, path, id), { ...productData, companyId, id });
      return id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `${path}/${id}`);
    }
  },

  // Customers
  async getCustomers(companyId: string) {
    const path = getCollectionPath(companyId, 'customers');
    try {
      const q = query(collection(db, path), orderBy('firmName'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Customer));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  // Orders
  async getOrders(companyId: string) {
    const path = getCollectionPath(companyId, 'orders');
    try {
      const q = query(collection(db, path), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Order));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  async createOrder(companyId: string, orderData: Partial<Order>) {
    const path = getCollectionPath(companyId, 'orders');
    const id = `ord_${Math.random().toString(36).substring(2, 9)}`;
    try {
      const fullOrder = {
        ...orderData,
        companyId,
        id,
        status: orderData.status || 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, path, id), fullOrder);
      return id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `${path}/${id}`);
    }
  },

  async createVisitLog(companyId: string, logData: any) {
    const path = getCollectionPath(companyId, 'visitLogs');
    const id = `visit_${Math.random().toString(36).substring(2, 9)}`;
    try {
      await setDoc(doc(db, path, id), { ...logData, companyId, id });
      return id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `${path}/${id}`);
    }
  }
};
