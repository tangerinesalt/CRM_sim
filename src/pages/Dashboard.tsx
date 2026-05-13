import { AlertTriangle, CalendarClock, CircleDollarSign, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useConfigStore } from '../store/configStore';
import { useCrmStore } from '../store/crmStore';
import { formatCurrency, formatPercent, isTodayOrPast } from '../utils/date';
import { calculateMetrics } from '../utils/statistics';
import { filterFollowups } from '../utils/permission';

export function Dashboard() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const users = useAuthStore((state) => state.users);
  const { appConfig, permissions } = useConfigStore();
  const crm = useCrmStore();
  const metrics = calculateMetrics(crm, currentUser, users, permissions, appConfig);
  const followups = filterFollowups(crm.followups, currentUser, users, permissions);
  const overdue = followups.filter(
    (item) => isTodayOrPast(item.nextFollowTime) && !['已成交', '已拒绝'].includes(item.result),
  );
  const recent = [...followups].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  const cards = [
    { label: '今日待跟进', value: metrics.overdueFollowups, hint: '到期或逾期跟进', icon: CalendarClock },
    { label: '新增/总线索', value: metrics.totalLeads, hint: `转化率 ${formatPercent(metrics.conversionRate)}`, icon: TrendingUp },
    { label: '进行中商机', value: metrics.activeOpportunities, hint: `赢单率 ${formatPercent(metrics.winRate)}`, icon: CircleDollarSign },
    { label: '模拟成交金额', value: formatCurrency(metrics.simulatedWonAmount), hint: `预测 ${formatCurrency(metrics.forecastAmount)}`, icon: CircleDollarSign },
  ];

  return (
    <div className="page-grid">
      <section className="metric-grid">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article className="metric-card" key={card.label}>
              <div className="metric-icon">
                <Icon size={20} />
              </div>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
              <small>{card.hint}</small>
            </article>
          );
        })}
      </section>

      <section className="split-grid">
        <article className="panel">
          <header className="panel-header">
            <div>
              <h2>逾期未跟进提醒</h2>
              <p>按当前身份的数据范围计算</p>
            </div>
            <AlertTriangle size={20} />
          </header>
          <div className="stack-list">
            {overdue.length ? (
              overdue.map((item) => {
                const customer = crm.customers.find((customerItem) => customerItem.id === item.customerId);
                return (
                  <div className="list-row" key={item.id}>
                    <strong>{customer?.name ?? '未知客户'}</strong>
                    <span>{item.method} · {item.result}</span>
                    <em>{item.nextFollowTime}</em>
                  </div>
                );
              })
            ) : (
              <div className="empty-state">暂无逾期跟进</div>
            )}
          </div>
        </article>

        <article className="panel">
          <header className="panel-header">
            <div>
              <h2>最近跟进记录</h2>
              <p>帮助快速回到业务上下文</p>
            </div>
          </header>
          <div className="stack-list">
            {recent.map((item) => {
              const customer = crm.customers.find((customerItem) => customerItem.id === item.customerId);
              const user = users.find((userItem) => userItem.id === item.userId);
              return (
                <div className="list-row" key={item.id}>
                  <strong>{customer?.name ?? '未知客户'}</strong>
                  <span>{user?.displayName} · {item.content}</span>
                  <em>{item.createdAt}</em>
                </div>
              );
            })}
          </div>
        </article>
      </section>
    </div>
  );
}
