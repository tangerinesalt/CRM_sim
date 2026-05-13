import { useMemo, useState } from 'react';
import { Plus, CheckCircle2 } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { useAuthStore } from '../store/authStore';
import { useConfigStore } from '../store/configStore';
import { useCrmStore } from '../store/crmStore';
import type { Ticket } from '../types';
import { filterOwned, filterTickets } from '../utils/permission';
import { todayIso } from '../utils/date';

export function Tickets() {
  const { currentUser, users } = useAuthStore();
  const { appConfig, permissions } = useConfigStore();
  const crm = useCrmStore();
  const [open, setOpen] = useState(false);
  const visibleOrders = filterOwned(crm.orders, currentUser, users, permissions);
  const visibleTickets = filterTickets(crm.tickets, crm.customers, currentUser, users, permissions);
  const [draft, setDraft] = useState({
    orderId: visibleOrders[0]?.id ?? '',
    type: appConfig.ticketTypes[0],
    description: '客户提出一个模拟售后问题。',
    handlerId: currentUser.id,
  });

  const selectedOrder = useMemo(
    () => crm.orders.find((order) => order.id === draft.orderId) ?? visibleOrders[0],
    [crm.orders, draft.orderId, visibleOrders],
  );

  function submitTicket() {
    if (!selectedOrder) {
      return;
    }
    crm.createTicket({
      customerId: selectedOrder.customerId,
      orderId: selectedOrder.id,
      type: draft.type,
      description: draft.description,
      handlerId: draft.handlerId,
    });
    setOpen(false);
  }

  return (
    <div className="page-grid">
      <section className="toolbar">
        <button className="primary-button" type="button" onClick={() => setOpen(true)} disabled={!visibleOrders.length}>
          <Plus size={16} />
          新建售后工单
        </button>
      </section>
      <DataTable<Ticket>
        data={visibleTickets}
        getRowKey={(item) => item.id}
        columns={[
          { key: 'customer', label: '客户', render: (item) => crm.customers.find((customer) => customer.id === item.customerId)?.name ?? '未知客户' },
          { key: 'type', label: '问题类型', render: (item) => item.type },
          { key: 'desc', label: '描述', render: (item) => item.description },
          { key: 'handler', label: '处理人', render: (item) => users.find((user) => user.id === item.handlerId)?.displayName ?? '未分配' },
          { key: 'status', label: '状态', render: (item) => <span className="status-pill">{item.status}</span> },
          {
            key: 'actions',
            label: '操作',
            render: (item) => (
              <button
                className="mini-button"
                type="button"
                onClick={() => crm.updateTicket(item.id, { status: '已关闭', result: '已完成模拟处理', satisfactionScore: 5, closedAt: todayIso() })}
                disabled={item.status === '已关闭'}
              >
                <CheckCircle2 size={14} />
                关闭
              </button>
            ),
          },
        ]}
      />

      <Modal title="新建售后工单" open={open} onClose={() => setOpen(false)}>
        <div className="form-grid">
          <label className="full-span">关联订单<select className="select" value={draft.orderId} onChange={(event) => setDraft({ ...draft, orderId: event.target.value })}>{visibleOrders.map((order) => <option key={order.id} value={order.id}>{order.orderNo}</option>)}</select></label>
          <label>问题类型<select className="select" value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value })}>{appConfig.ticketTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
          <label>处理人<select className="select" value={draft.handlerId} onChange={(event) => setDraft({ ...draft, handlerId: event.target.value })}>{users.filter((user) => user.role !== 'admin').map((user) => <option key={user.id} value={user.id}>{user.displayName}</option>)}</select></label>
          <label className="full-span">问题描述<textarea className="textarea" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></label>
          <div className="form-actions">
            <button className="primary-button" type="button" onClick={submitTicket}>保存工单</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
