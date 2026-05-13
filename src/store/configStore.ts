import { create } from 'zustand';
import appConfigJson from '../config/app-config.json';
import permissionConfigJson from '../config/permission-config.json';
import type { AppConfig, PermissionConfig } from '../types';

interface ConfigStore {
  appConfig: AppConfig;
  permissions: PermissionConfig;
}

export const useConfigStore = create<ConfigStore>(() => ({
  appConfig: appConfigJson as AppConfig,
  permissions: permissionConfigJson as PermissionConfig,
}));
