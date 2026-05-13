import { DataTable } from '../components/DataTable';
import { useAuthStore } from '../store/authStore';
import { useConfigStore } from '../store/configStore';
import { useCrmStore } from '../store/crmStore';
import type { FollowUp } from '../types';
import { filterFollowups } from '../utils/permission';

export function FollowUps() {
  const { currentUser, users } = useAuthStore();
  const { permissions } = useConfigStore();
  const crm = useCrmStore();
  const followups = filterFollowups(crm.followups, currentUser, users, permissions);

  return (
    <section className="panel">
      <header className="panel-header">
        <div>
          <h2>跟进记录</h2>
          <p>可从客户详情或商机上下文继续添加。</p>
        </div>
      </header>
      <DataTable<FollowUp>
        data={followups}
        getRowKey={(item) => item.id}
        columns={[
          { key: 'customer', label: '客户', render: (item) => crm.customers.find((customer) => customer.id === item.customerId)?.name ?? '未知客户' },
          { key: 'user', label: '跟进人', render: (item) => users.find((user) => user.id === item.userId)?.displayName ?? '未知' },
          { key: 'method', label: '方式/结果', render: (item) => `${item.method} · ${item.result}` },
          { key: 'content', label: '内容', render: (item) => item.content },
          { key: 'next', label: '下次跟进', render: (item) => item.nextFollowTime },
        ]}
      />
    </section>
  );
}
