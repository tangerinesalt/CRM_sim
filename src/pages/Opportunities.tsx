import { MessageSquarePlus, Trophy, XCircle } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { useAuthStore } from '../store/authStore';
import { useConfigStore } from '../store/configStore';
import { useCrmStore } from '../store/crmStore';
import type { Opportunity } from '../types';
import { filterOwned } from '../utils/permission';
import { formatCurrency, todayIso } from '../utils/date';

export function Opportunities() {
  const { currentUser, users } = useAuthStore();
  const { appConfig, permissions } = useConfigStore();
  const crm = useCrmStore();
  const opportunities = filterOwned(crm.opportunities, currentUser, users, permissions);

  return (
    <section className="panel">
      <header className="panel-header">
        <div>
          <h2>商机推进</h2>
          <p>阶段概率来自配置，赢单后自动生成模拟订单。</p>
        </div>
      </header>
      <DataTable<Opportunity>
        data={opportunities}
        getRowKey={(item) => item.id}
        columns={[
          { key: 'name', label: '商机', render: (item) => <strong>{item.name}</strong> },
          { key: 'customer', label: '客户', render: (item) => crm.customers.find((customer) => customer.id === item.customerId)?.name ?? '未知客户' },
          { key: 'amount', label: '金额', render: (item) => formatCurrency(item.amount) },
          {
            key: 'stage',
            label: '阶段',
            render: (item) => (
              <select className="inline-select" value={item.stage} onChange={(event) => crm.updateOpportunityStage(item.id, event.target.value)}>
                {appConfig.salesStages.map((stage) => (
                  <option key={stage.name} value={stage.name}>{stage.name} · {stage.probability}%</option>
                ))}
              </select>
            ),
          },
          { key: 'probability', label: '概率', render: (item) => `${item.probability}%` },
          { key: 'status', label: '状态', render: (item) => <span className="status-pill">{item.status}</span> },
          {
            key: 'actions',
            label: '操作',
            render: (item) => (
              <div className="row-actions">
                <button className="mini-button" type="button" onClick={() => crm.markOpportunityWon(item.id)}>
                  <Trophy size={14} />
                  赢单
                </button>
                <button
                  className="mini-button"
                  type="button"
                  onClick={() =>
                    crm.addFollowUp({
                      customerId: item.customerId,
                      opportunityId: item.id,
                      userId: currentUser.id,
                      method: appConfig.followMethods[0],
                      content: `围绕商机「${item.name}」补充一条模拟跟进。`,
                      result: '客户有兴趣',
                      nextFollowTime: todayIso(),
                    })
                  }
                >
                  <MessageSquarePlus size={14} />
                  跟进
                </button>
                <button
                  className="mini-button danger"
                  type="button"
                  onClick={() => {
                    const reason = window.prompt('请输入输单原因');
                    if (reason !== null) {
                      crm.markOpportunityLost(item.id, reason);
                    }
                  }}
                >
                  <XCircle size={14} />
                  输单
                </button>
              </div>
            ),
          },
        ]}
      />
    </section>
  );
}
