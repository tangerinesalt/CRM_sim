import { useAuthStore } from '../store/authStore';
import { useConfigStore } from '../store/configStore';
import { useCrmStore } from '../store/crmStore';
import { formatCurrency, formatPercent } from '../utils/date';
import { calculateMetrics } from '../utils/statistics';

export function Reports() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const users = useAuthStore((state) => state.users);
  const { appConfig, permissions } = useConfigStore();
  const crm = useCrmStore();
  const metrics = calculateMetrics(crm, currentUser, users, permissions, appConfig);

  return (
    <div className="page-grid">
      <section className="metric-grid reports">
        <Metric label="线索总数" value={metrics.totalLeads.toString()} />
        <Metric label="客户总数" value={metrics.totalCustomers.toString()} />
        <Metric label="进行中商机" value={metrics.activeOpportunities.toString()} />
        <Metric label="赢单商机" value={metrics.wonOpportunities.toString()} />
        <Metric label="输单商机" value={metrics.lostOpportunities.toString()} />
        <Metric label="模拟成交金额" value={formatCurrency(metrics.simulatedWonAmount)} />
        <Metric label="待跟进客户" value={metrics.pendingCustomers.toString()} />
        <Metric label="逾期跟进" value={metrics.overdueFollowups.toString()} />
        <Metric label="售后工单" value={metrics.ticketCount.toString()} />
        <Metric label="客户转化率" value={formatPercent(metrics.conversionRate)} />
        <Metric label="赢单率" value={formatPercent(metrics.winRate)} />
        <Metric label="销售预测金额" value={formatCurrency(metrics.forecastAmount)} />
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>当前身份范围</small>
    </article>
  );
}
