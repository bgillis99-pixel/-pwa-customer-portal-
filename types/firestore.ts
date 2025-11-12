import { Timestamp } from 'firebase/firestore';

/**
 * User interface - represents authenticated users in the system
 */
export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'technician' | 'customer';
  phone?: string;
  createdAt: Timestamp;
  lastLogin: Timestamp;
}

/**
 * Customer interface - represents business customers
 */
export interface Customer {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  fleetSize: number;
  totalRevenue: number;
  lastServiceDate: Timestamp;
  nextServiceDue?: Timestamp;
  source: 'google_ads' | 'organic' | 'referral' | 'a_plus_ctc' | 'sms' | 'direct';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Job interface - represents service jobs
 */
export interface Job {
  id: string;
  customerId: string;
  customerName: string;
  serviceType: 'obd' | 'smoke_j1667' | 'rv_motorhome' | 'dpf_inspection';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: Timestamp;
  completedDate?: Timestamp;
  technicianId: string;
  technicianName: string;
  vehicles: Array<{
    vin: string;
    year: number;
    make: string;
    model: string;
    testResult?: 'pass' | 'fail';
    notes?: string;
  }>;
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  pricing: {
    basePrice: number;
    additionalFees: number;
    discount: number;
    total: number;
  };
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod?: 'paypal' | 'cash' | 'check' | 'credit_card';
  paypalTransactionId?: string;
  certificateUrl?: string;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Webhook interface - represents incoming webhook events
 */
export interface Webhook {
  id: string;
  source: 'paypal' | 'make' | 'calendar' | 'sms' | 'ads' | 'twilio';
  timestamp: Timestamp;
  payload: any;
  status: 'received' | 'processing' | 'completed' | 'failed';
  retryCount: number;
  processedAt?: Timestamp;
  error?: string;
}

/**
 * Lead interface - represents potential customer leads
 */
export interface Lead {
  id: string;
  source: 'sms' | 'google_ads' | 'organic' | 'referral' | 'phone';
  phone?: string;
  email?: string;
  message?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  assignedTo?: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  webhookId?: string;
  metadata?: {
    zipCode?: string;
    county?: string;
    fleetSize?: number;
    serviceInterest?: string[];
  };
}

/**
 * ServiceArea interface - represents geographic service areas
 */
export interface ServiceArea {
  id: string;
  name: string;
  counties: string[];
  cities: string[];
  zipCodes?: string[];
  active: boolean;
  priority: number;
  technicianIds?: string[];
}

/**
 * Log interface - represents system logs (for the existing log feature)
 */
export interface Log {
  id: string;
  raw: string;
  parsed?: {
    type: 'trip' | 'fuel' | 'maintenance';
    miles?: number;
    from?: string;
    to?: string;
    gallons?: number;
    location?: string;
  }[];
  createdAt: Timestamp;
  userId?: string;
}

/**
 * Analytics interface - represents analytics data
 */
export interface Analytics {
  id: string;
  date: Timestamp;
  jobCount: number;
  totalRevenue: number;
  averageJobValue: number;
  statusCounts?: {
    scheduled: number;
    in_progress: number;
    completed: number;
    cancelled: number;
  };
  paymentStatusCounts?: {
    pending: number;
    paid: number;
    refunded: number;
  };
}

/**
 * Collection names enum for type safety
 */
export enum Collections {
  USERS = 'users',
  CUSTOMERS = 'customers',
  JOBS = 'jobs',
  WEBHOOKS = 'webhooks',
  LEADS = 'leads',
  SERVICE_AREAS = 'service_areas',
  LOGS = 'logs',
  ANALYTICS = 'analytics',
}
