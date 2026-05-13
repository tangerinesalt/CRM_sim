import type { ReactNode } from 'react';
import type { ModuleId, Operation } from '../types';
import { useAuthStore } from '../store/authStore';
import { useConfigStore } from '../store/configStore';
import { canAccessModule, canOperate } from '../utils/permission';

interface PermissionGuardProps {
  moduleId?: ModuleId;
  operation?: Operation;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGuard({ moduleId, operation, children, fallback = null }: PermissionGuardProps) {
  const currentUser = useAuthStore((state) => state.currentUser);
  const permissions = useConfigStore((state) => state.permissions);
  const allowedModule = moduleId ? canAccessModule(currentUser.role, moduleId, permissions) : true;
  const allowedOperation = operation ? canOperate(currentUser.role, operation, permissions) : true;

  return allowedModule && allowedOperation ? <>{children}</> : <>{fallback}</>;
}
