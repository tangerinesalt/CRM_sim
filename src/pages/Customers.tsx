import { useMemo, useState } from 'react';
import { MessageSquarePlus, PlusCircle } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { useAuthStore } from '../store/authStore';
import { useConfigStore } from '../store/configStore';
import { useCrmStore } from '../store/crmStore';
import type { Customer } from '../types';
import { filterOwned } from '../utils/permission';
import { todayIso } from '../utils/date';

export function Customers() {
  const { currentUser, users } = useAuthStore();
  const { appConfig, permissions } = useConfigStore();
  const crm = useCrmStore();
  const visibleCustomers = useMemo(
    () => filterOwned(crm.customers, currentUser, users, permissions),
    [crm.customers, currentUser, users, permissions],
  );
  const [selectedId, setSelectedId] = useState(visibleCustomers[0]?.id ?? '');
  const selected = visibleCustomers.find((customer) => customer.id === selectedId) ?? visibleCustomers[0];

  function addFollowup(customerId: string) {
    crm.addFollowUp({
      customerId,
      opportunityId: crm.opportunities.find((item) => item.customerId === customerId)?.id ?? '',
      userId: currentUser.id,
      method: appConfig.followMethods[0],
      content: '补充一条模拟跟进：确认客户下一步需求。',
      result: '客户有兴趣',
      nextFollowTime: todayIso(),
    });
  }

  function addOpportunity(customer: Customer) {
    crm.createOpportunity({
      customerId: customer.id,
      name: `${customer.name} CRM 模拟商机`,
      amount: 30000,
      stage: appConfig.salesStages[0].name,
      ownerId: customer.ownerId,
      expectedCloseDate: '2026-06-30',
    });
  }

  return (
    <div className="split-grid wide-left">
      <section className="panel">
        <header className="panel-header">
          <div>
            <h2>客户列表</h2>
            <p>按当前身份范围展示</p>
          </div>
        </header>
        <DataTable<Customer>
          data={visibleCustomers}
          getRowKey={(customer) => customer.id}
          columns={[
            { key: 'name', label: '客户', render: (customer) => <button className="link-button" onClick={() => setSelectedId(customer.id)}>{customer.name}</button> },
            { key: 'type', label: '类型/行业', render: (customer) => `${customer.type} · ${customer.industry}` },
            { key: 'level', label: '等级', render: (customer) => customer.level },
            { key: 'status', label: '状态', render: (customer) => <span className="status-pill">{customer.status}</span> },
          ]}
        />
      </section>

      <section className="panel detail-panel">
        {selected ? (
          <>
            <header className="panel-header">
              <div>
                <h2>{selected.name}</h2>
                <p>{selected.region} · {selected.industry} · {selected.level}</p>
              </div>
              <span className="status-pill">{selected.status}</span>
            </header>
            <div className="detail-grid">
              <Info label="负责人" value={users.find((user) => user.id === selected.ownerId)?.displayName ?? '未分配'} />
              <Info label="客户类型" value={selected.type} />
              <Info label="创建时间" value={selected.createdAt} />
              <Info label="备注" value={selected.remark} />
            </div>
            <h3>主要联系人</h3>
            {crm.contacts.filter((contact) => contact.customerId === selected.id).map((contact) => (
              <div className="soft-card" key={contact.id}>
                <strong>{contact.name} · {contact.position}</strong>
                <span>{contact.phone} · {contact.email}</span>
              </div>
            ))}
            <div className="row-actions">
              <button className="primary-button" type="button" onClick={() => addFollowup(selected.id)}>
                <MessageSquarePlus size={16} />
                添加跟进
              </button>
              <button className="ghost-button" type="button" onClick={() => addOpportunity(selected)}>
                <PlusCircle size={16} />
                创建商机
              </button>
            </div>
            <h3>关联记录</h3>
            <div className="stack-list compact">
              {crm.followups.filter((item) => item.customerId === selected.id).map((item) => (
                <div className="list-row" key={item.id}>
                  <strong>{item.method} · {item.result}</strong>
                  <span>{item.content}</span>
                  <em>{item.createdAt}</em>
                </div>
              ))}
              {crm.opportunities.filter((item) => item.customerId === selected.id).map((item) => (
                <div className="list-row" key={item.id}>
                  <strong>{item.name}</strong>
                  <span>{item.stage} · {item.amount.toLocaleString('zh-CN')} 元</span>
                  <em>{item.status}</em>
                </div>
              ))}
              {crm.orders.filter((item) => item.customerId === selected.id).map((item) => (
                <div className="list-row" key={item.id}>
                  <strong>{item.orderNo}</strong>
                  <span>模拟订单 · {item.amount.toLocaleString('zh-CN')} 元</span>
                  <em>{item.status}</em>
                </div>
              ))}
              {crm.tickets.filter((item) => item.customerId === selected.id).map((item) => (
                <div className="list-row" key={item.id}>
                  <strong>{item.type}</strong>
                  <span>{item.description}</span>
                  <em>{item.status}</em>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state">暂无客户</div>
        )}
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="info-tile">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
