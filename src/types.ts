export type Role = 'admin' | 'manager' | 'staff';
export type Scope = 'all' | 'team' | 'self';

export type ModuleId =
  | 'dashboard'
  | 'leads'
  | 'customers'
  | 'opportunities'
  | 'followups'
  | 'orders'
  | 'tickets'
  | 'reports'
  | 'settings';

export type Operation =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'assign'
  | 'reset'
  | 'configure'
  | 'export'
  | 'import';

export interface User {
  id: string;
  username: string;
  displayName: string;
  role: Role;
  phone: string;
  email: string;
  teamId: string;
  status: string;
}

export interface PermissionRule {
  label: string;
  scope: Scope;
  modules: ModuleId[];
  operations: Operation[];
}

export type PermissionConfig = Record<Role, PermissionRule>;

export interface SalesStage {
  name: string;
  probability: number;
}

export interface AppConfig {
  appName: string;
  defaultRole: Role;
  identitySwitching: boolean;
  allowReset: boolean;
  allowMockImport: boolean;
  allowRealDataImport: boolean;
  defaultTheme: string;
  leadStatuses: string[];
  leadSources: string[];
  leadLevels: string[];
  customerTypes: string[];
  customerLevels: string[];
  customerStatuses: string[];
  salesStages: SalesStage[];
  followMethods: string[];
  followResults: string[];
  orderStatuses: string[];
  ticketTypes: string[];
  ticketStatuses: string[];
}

export interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  source: string;
  level: string;
  ownerId: string;
  status: string;
  remark: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  type: string;
  industry: string;
  region: string;
  level: string;
  mainContactId: string;
  ownerId: string;
  status: string;
  remark: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  customerId: string;
  name: string;
  position: string;
  phone: string;
  email: string;
  wechat: string;
  isPrimary: boolean;
  remark: string;
}

export interface Opportunity {
  id: string;
  customerId: string;
  name: string;
  amount: number;
  stage: string;
  probability: number;
  ownerId: string;
  expectedCloseDate: string;
  status: string;
  lostReason: string;
  createdAt: string;
  updatedAt: string;
}

export interface FollowUp {
  id: string;
  customerId: string;
  opportunityId: string;
  userId: string;
  method: string;
  content: string;
  result: string;
  nextFollowTime: string;
  createdAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  opportunityId: string;
  orderNo: string;
  amount: number;
  status: string;
  ownerId: string;
  remark: string;
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: string;
  customerId: string;
  orderId: string;
  type: string;
  description: string;
  handlerId: string;
  status: string;
  result: string;
  satisfactionScore: number;
  createdAt: string;
  closedAt: string;
}

export interface CrmData {
  leads: Lead[];
  customers: Customer[];
  contacts: Contact[];
  opportunities: Opportunity[];
  followups: FollowUp[];
  orders: Order[];
  tickets: Ticket[];
}

export interface DashboardMetrics {
  totalLeads: number;
  totalCustomers: number;
  activeOpportunities: number;
  wonOpportunities: number;
  lostOpportunities: number;
  simulatedWonAmount: number;
  pendingCustomers: number;
  overdueFollowups: number;
  ticketCount: number;
  conversionRate: number;
  winRate: number;
  forecastAmount: number;
}

export type ImportResult =
  | { ok: true; message: string }
  | { ok: false; message: string };
