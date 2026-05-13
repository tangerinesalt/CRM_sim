import type { AppConfig, CrmData, DashboardMetrics, PermissionConfig, User } from '../types';
import { isTodayOrPast } from './date';
import { filterFollowups, filterOwned, filterTickets } from './permission';

export function calculateMetrics(
  data: CrmData,
  currentUser: User,
  users: User[],
  permissions: PermissionConfig,
  config: AppConfig,
): DashboardMetrics {
  const leads = filterOwned(data.leads, currentUser, users, permissions);
  const customers = filterOwned(data.customers, currentUser, users, permissions);
  const opportunities = filterOwned(data.opportunities, currentUser, users, permissions);
  const followups = filterFollowups(data.followups, currentUser, users, permissions);
  const orders = filterOwned(data.orders, currentUser, users, permissions);
  const tickets = filterTickets(data.tickets, data.customers, currentUser, users, permissions);

  const wonOpportunities = opportunities.filter((item) => item.stage === '赢单' || item.status === '已赢单');
  const lostOpportunities = opportunities.filter((item) => item.stage === '输单' || item.status === '已输单');
  const activeOpportunities = opportunities.filter((item) => item.status === '进行中');
  const convertedLeads = leads.filter((item) => item.status === '已转客户');
  const pendingCustomers = customers.filter((item) => item.status === '待跟进').length;
  const overdueFollowups = followups.filter(
    (item) => isTodayOrPast(item.nextFollowTime) && !['已成交', '已拒绝'].includes(item.result),
  ).length;
  const forecastAmount = opportunities
    .filter((item) => item.status === '进行中')
    .reduce((total, item) => {
      const stage = config.salesStages.find((stageItem) => stageItem.name === item.stage);
      return total + item.amount * ((stage?.probability ?? item.probability) / 100);
    }, 0);

  return {
    totalLeads: leads.length,
    totalCustomers: customers.length,
    activeOpportunities: activeOpportunities.length,
    wonOpportunities: wonOpportunities.length,
    lostOpportunities: lostOpportunities.length,
    simulatedWonAmount: orders
      .filter((item) => item.status !== '已取消')
      .reduce((total, item) => total + item.amount, 0),
    pendingCustomers,
    overdueFollowups,
    ticketCount: tickets.length,
    conversionRate: leads.length ? convertedLeads.length / leads.length : 0,
    winRate: opportunities.length ? wonOpportunities.length / opportunities.length : 0,
    forecastAmount,
  };
}
