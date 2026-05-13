import {
  BarChart3,
  BriefcaseBusiness,
  ClipboardList,
  ContactRound,
  Gauge,
  Handshake,
  Home,
  RotateCcw,
  Settings,
  ShieldCheck,
  TicketCheck,
  UsersRound,
} from 'lucide-react';
import type { ModuleId } from '../types';
import { useAuthStore } from '../store/authStore';
import { useConfigStore } from '../store/configStore';
import { useCrmStore } from '../store/crmStore';
import { canAccessModule, canOperate, roleLabel, scopeLabel } from '../utils/permission';

export interface NavItem {
  id: ModuleId;
  label: string;
  icon: typeof Home;
}

export const navItems: NavItem[] = [
  { id: 'dashboard', label: '工作台', icon: Home },
  { id: 'leads', label: '线索管理', icon: ClipboardList },
  { id: 'customers', label: '客户管理', icon: UsersRound },
  { id: 'opportunities', label: '商机管理', icon: BriefcaseBusiness },
  { id: 'followups', label: '跟进记录', icon: ContactRound },
  { id: 'orders', label: '订单管理', icon: Handshake },
  { id: 'tickets', label: '售后服务', icon: TicketCheck },
  { id: 'reports', label: '数据看板', icon: BarChart3 },
  { id: 'settings', label: '系统配置', icon: Settings },
];

interface LayoutProps {
  activePage: ModuleId;
  onPageChange: (page: ModuleId) => void;
  children: React.ReactNode;
}

export function Layout({ activePage, onPageChange, children }: LayoutProps) {
  const { users, currentUser, switchUser } = useAuthStore();
  const { appConfig, permissions } = useConfigStore();
  const { message, clearMessage, resetData } = useCrmStore();
  const permission = permissions[currentUser.role];
  const visibleNav = navItems.filter((item) => canAccessModule(currentUser.role, item.id, permissions));
  const canReset = canOperate(currentUser.role, 'reset', permissions);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">M</div>
          <div>
            <strong>{appConfig.appName}</strong>
            <span>中文 CRM 模拟器</span>
          </div>
        </div>

        <nav className="nav-list" aria-label="主导航">
          {visibleNav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                onClick={() => onPageChange(item.id)}
                title={item.label}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <div>
            <div className="eyebrow">当前为模拟环境</div>
            <h1>{navItems.find((item) => item.id === activePage)?.label ?? '工作台'}</h1>
          </div>

          <div className="topbar-actions">
            <div className="identity-card">
              <ShieldCheck size={18} />
              <div>
                <span>{currentUser.displayName}</span>
                <strong>
                  {roleLabel(currentUser.role, permissions)} · {scopeLabel(permission.scope)}
                </strong>
              </div>
            </div>
            <select
              className="select"
              value={currentUser.id}
              onChange={(event) => switchUser(event.target.value)}
              aria-label="切换模拟身份"
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.displayName}（{roleLabel(user.role, permissions)}）
                </option>
              ))}
            </select>
            {canReset && (
              <button
                className="ghost-button"
                type="button"
                onClick={() => {
                  if (window.confirm('确认恢复初始模拟数据？本地新增记录会被清除。')) {
                    resetData();
                  }
                }}
                title="恢复初始模拟数据"
              >
                <RotateCcw size={16} />
                重置模拟数据
              </button>
            )}
          </div>
        </header>

        <div className="notice-band">
          <Gauge size={18} />
          <span>所有公司、联系人、手机号、邮箱、订单和跟进记录均为虚构模拟数据，不会上传到远程服务。</span>
          {message && (
            <button className="text-button" type="button" onClick={clearMessage}>
              {message}
            </button>
          )}
        </div>

        <section className="content-area">{children}</section>
      </div>
    </div>
  );
}
