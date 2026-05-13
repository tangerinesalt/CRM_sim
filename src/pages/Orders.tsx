import { DataTable } from '../components/DataTable';
import { useAuthStore } from '../store/authStore';
import { useConfigStore } from '../store/configStore';
import { useCrmStore } from '../store/crmStore';
import type { Order } from '../types';
import { filterOwned } from '../utils/permission';
import { formatCurrency } from '../utils/date';

export function Orders() {
  const { currentUser, users } = useAuthStore();
  const { permissions } = useConfigStore();
  const crm = useCrmStore();
  const orders = filterOwned(crm.orders, currentUser, users, permissions);

  return (
    <section className="panel">
      <header className="panel-header">
        <div>
          <h2>模拟订单</h2>
          <p>赢单商机会自动创建订单，订单数据仅保存在本地。</p>
        </div>
      </header>
      <DataTable<Order>
        data={orders}
        getRowKey={(item) => item.id}
        columns={[
          { key: 'orderNo', label: '订单编号', render: (item) => <strong>{item.orderNo}</strong> },
          { key: 'customer', label: '客户', render: (item) => crm.customers.find((customer) => customer.id === item.customerId)?.name ?? '未知客户' },
          { key: 'amount', label: '金额', render: (item) => formatCurrency(item.amount) },
          { key: 'status', label: '状态', render: (item) => <span className="status-pill">{item.status}</span> },
          { key: 'createdAt', label: '下单时间', render: (item) => item.createdAt },
          { key: 'remark', label: '备注', render: (item) => item.remark },
        ]}
      />
    </section>
  );
}
