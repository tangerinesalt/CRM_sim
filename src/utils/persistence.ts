import type { CrmData, ImportResult } from '../types';

const STORAGE_KEY = 'mini-crm-simulator-state-v1';

export function loadLocalState(): CrmData | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as CrmData;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function saveLocalState(data: CrmData): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearLocalState(): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.removeItem(STORAGE_KEY);
}

export function validateImportData(value: unknown): value is CrmData {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const record = value as Record<string, unknown>;
  return [
    'leads',
    'customers',
    'contacts',
    'opportunities',
    'followups',
    'orders',
    'tickets',
  ].every((key) => Array.isArray(record[key]));
}

export function parseImportJson(content: string): { data: CrmData | null; result: ImportResult } {
  try {
    const parsed = JSON.parse(content) as unknown;
    if (!validateImportData(parsed)) {
      return {
        data: null,
        result: {
          ok: false,
          message: '导入失败：文件不是模拟 CRM JSON 模板。系统不支持导入真实客户 Excel。',
        },
      };
    }
    return { data: parsed, result: { ok: true, message: '模拟数据导入成功。' } };
  } catch {
    return {
      data: null,
      result: {
        ok: false,
        message: '导入失败：JSON 格式无效。系统不支持导入真实客户 Excel。',
      },
    };
  }
}

export function downloadJson(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
