import type {
  Customer,
  FollowUp,
  Lead,
  ModuleId,
  Operation,
  Order,
  PermissionConfig,
  Role,
  Scope,
  Ticket,
  User,
} from '../types';

export function roleLabel(role: Role, permissions: PermissionConfig): string {
  return permissions[role].label;
}

export function scopeLabel(scope: Scope): string {
  if (scope === 'all') {
    return '全局数据';
  }
  if (scope === 'team') {
    return '团队数据';
  }
  return '个人数据';
}

export function canAccessModule(
  role: Role,
  moduleId: ModuleId,
  permissions: PermissionConfig,
): boolean {
  return permissions[role].modules.includes(moduleId);
}

export function canOperate(
  role: Role,
  operation: Operation,
  permissions: PermissionConfig,
): boolean {
  return permissions[role].operations.includes(operation);
}

export function ownerIdsForUser(currentUser: User, users: User[], permissions: PermissionConfig): string[] {
  const scope = permissions[currentUser.role].scope;
  if (scope === 'all') {
    return users.map((user) => user.id);
  }
  if (scope === 'team') {
    return users.filter((user) => user.teamId === currentUser.teamId).map((user) => user.id);
  }
  return [currentUser.id];
}

export function filterOwned<T extends { ownerId: string }>(
  records: T[],
  currentUser: User,
  users: User[],
  permissions: PermissionConfig,
): T[] {
  const scope = permissions[currentUser.role].scope;
  if (scope === 'all') {
    return records;
  }
  const allowed = new Set(ownerIdsForUser(currentUser, users, permissions));
  return records.filter((record) => allowed.has(record.ownerId) || record.ownerId === '');
}

export function filterFollowups(
  records: FollowUp[],
  currentUser: User,
  users: User[],
  permissions: PermissionConfig,
): FollowUp[] {
  const scope = permissions[currentUser.role].scope;
  if (scope === 'all') {
    return records;
  }
  const allowed = new Set(ownerIdsForUser(currentUser, users, permissions));
  return records.filter((record) => allowed.has(record.userId));
}

export function filterTickets(
  records: Ticket[],
  customers: Customer[],
  currentUser: User,
  users: User[],
  permissions: PermissionConfig,
): Ticket[] {
  const scope = permissions[currentUser.role].scope;
  if (scope === 'all') {
    return records;
  }
  const allowed = new Set(ownerIdsForUser(currentUser, users, permissions));
  return records.filter((ticket) => {
    const customer = customers.find((item) => item.id === ticket.customerId);
    return allowed.has(ticket.handlerId) || (customer ? allowed.has(customer.ownerId) : false);
  });
}

export function customerIdsFromScope(
  customers: Customer[],
  currentUser: User,
  users: User[],
  permissions: PermissionConfig,
): Set<string> {
  return new Set(filterOwned(customers, currentUser, users, permissions).map((customer) => customer.id));
}

export function recordMatchesScope(
  ownerId: string,
  currentUser: User,
  users: User[],
  permissions: PermissionConfig,
): boolean {
  const scope = permissions[currentUser.role].scope;
  if (scope === 'all') {
    return true;
  }
  return ownerIdsForUser(currentUser, users, permissions).includes(ownerId);
}

export type ScopeBundle = {
  leads: Lead[];
  customers: Customer[];
  followups: FollowUp[];
  orders: Order[];
  tickets: Ticket[];
};
