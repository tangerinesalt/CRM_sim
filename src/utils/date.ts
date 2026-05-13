export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isTodayOrPast(dateIso: string): boolean {
  if (!dateIso) {
    return false;
  }
  return dateIso <= todayIso();
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}
