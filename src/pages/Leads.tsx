import { useMemo, useState } from 'react';
import { Plus, UserCheck, UserX } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { useAuthStore } from '../store/authStore';
import { useConfigStore } from '../store/configStore';
import { useCrmStore } from '../store/crmStore';
import type { Lead } from '../types';
import { filterOwned, canOperate } from '../utils/permission';

export function Leads() {
  const { currentUser, users } = useAuthStore();
  const { appConfig, permissions } = useConfigStore();
  const crm = useCrmStore();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('全部');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    companyName: '',
    contactName: '',
    phone: '13700008888',
    email: 'demo-lead@demo.local',
    source: appConfig.leadSources[0],
    level: '中',
    ownerId: currentUser.role === 'staff' ? currentUser.id : '',
    status: '新线索',
    remark: '新建模拟线索。',
  });

  const visibleLeads = useMemo(() => {
    return filterOwned(crm.leads, currentUser, users, permissions).filter((lead) => {
      const matchesSearch = `${lead.companyName}${lead.contactName}${lead.phone}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus = status === '全部' || lead.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [crm.leads, currentUser, users, permissions, search, status]);

  const staffUsers = users.filter((user) => user.role === 'staff');
  const canAssign = canOperate(currentUser.role, 'assign', permissions);

  function submitLead() {
    if (!draft.companyName.trim() || !draft.contactName.trim()) {
      return;
    }
    if (editingLeadId) {
      const existing = crm.leads.find((lead) => lead.id === editingLeadId);
      if (existing) {
        crm.updateLead({ ...existing, ...draft });
      }
    } else {
      crm.createLead(draft);
    }
    setModalOpen(false);
    setEditingLeadId(null);
    setDraft((value) => ({ ...value, companyName: '', contactName: '' }));
  }

  return (
    <div className="page-grid">
      <section className="toolbar">
        <input className="input" placeholder="搜索客户名称、联系人、手机号" value={search} onChange={(event) => setSearch(event.target.value)} />
        <select className="select" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option>全部</option>
          {appConfig.leadStatuses.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <button className="primary-button" type="button" onClick={() => setModalOpen(true)}>
          <Plus size={16} />
          新建模拟线索
        </button>
      </section>

      <DataTable<Lead>
        data={visibleLeads}
        getRowKey={(lead) => lead.id}
        columns={[
          { key: 'company', label: '线索客户', render: (lead) => <strong>{lead.companyName}</strong> },
          { key: 'contact', label: '联系人', render: (lead) => `${lead.contactName} · ${lead.phone}` },
          { key: 'source', label: '来源/等级', render: (lead) => `${lead.source} · ${lead.level}` },
          {
            key: 'owner',
            label: '负责人',
            render: (lead) =>
              canAssign ? (
                <select className="inline-select" value={lead.ownerId} onChange={(event) => crm.assignLead(lead.id, event.target.value)}>
                  <option value="">未分配</option>
                  {staffUsers.map((user) => (
                    <option key={user.id} value={user.id}>{user.displayName}</option>
                  ))}
                </select>
              ) : (
                users.find((user) => user.id === lead.ownerId)?.displayName ?? '未分配'
              ),
          },
          { key: 'status', label: '状态', render: (lead) => <span className="status-pill">{lead.status}</span> },
          {
            key: 'actions',
            label: '操作',
            render: (lead) => (
              <div className="row-actions">
                <button className="mini-button" type="button" onClick={() => crm.convertLeadToCustomer(lead.id)} disabled={lead.status === '已转客户' || lead.status === '无效线索'}>
                  <UserCheck size={14} />
                  转客户
                </button>
                <button
                  className="mini-button"
                  type="button"
                  onClick={() => {
                    setEditingLeadId(lead.id);
                    setDraft({
                      companyName: lead.companyName,
                      contactName: lead.contactName,
                      phone: lead.phone,
                      email: lead.email,
                      source: lead.source,
                      level: lead.level,
                      ownerId: lead.ownerId,
                      status: lead.status,
                      remark: lead.remark,
                    });
                    setModalOpen(true);
                  }}
                >
                  编辑
                </button>
                <button className="mini-button danger" type="button" onClick={() => crm.markLeadInvalid(lead.id)} disabled={lead.status === '无效线索'}>
                  <UserX size={14} />
                  无效
                </button>
              </div>
            ),
          },
        ]}
      />

      <Modal
        title={editingLeadId ? '编辑模拟线索' : '新建模拟线索'}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingLeadId(null);
        }}
      >
        <div className="form-grid">
          <label>客户名称<input className="input" value={draft.companyName} onChange={(event) => setDraft({ ...draft, companyName: event.target.value })} /></label>
          <label>联系人<input className="input" value={draft.contactName} onChange={(event) => setDraft({ ...draft, contactName: event.target.value })} /></label>
          <label>手机号<input className="input" value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} /></label>
          <label>邮箱<input className="input" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} /></label>
          <label>来源<select className="select" value={draft.source} onChange={(event) => setDraft({ ...draft, source: event.target.value })}>{appConfig.leadSources.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>意向<select className="select" value={draft.level} onChange={(event) => setDraft({ ...draft, level: event.target.value })}>{appConfig.leadLevels.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="full-span">备注<textarea className="textarea" value={draft.remark} onChange={(event) => setDraft({ ...draft, remark: event.target.value })} /></label>
          <div className="form-actions">
            <button className="primary-button" type="button" onClick={submitLead}>保存线索</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
