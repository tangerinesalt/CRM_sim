import { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Leads } from './pages/Leads';
import { Customers } from './pages/Customers';
import { Opportunities } from './pages/Opportunities';
import { FollowUps } from './pages/FollowUps';
import { Orders } from './pages/Orders';
import { Tickets } from './pages/Tickets';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import type { ModuleId } from './types';

export function App() {
  const [activePage, setActivePage] = useState<ModuleId>('dashboard');

  return (
    <Layout activePage={activePage} onPageChange={setActivePage}>
      {activePage === 'dashboard' && <Dashboard />}
      {activePage === 'leads' && <Leads />}
      {activePage === 'customers' && <Customers />}
      {activePage === 'opportunities' && <Opportunities />}
      {activePage === 'followups' && <FollowUps />}
      {activePage === 'orders' && <Orders />}
      {activePage === 'tickets' && <Tickets />}
      {activePage === 'reports' && <Reports />}
      {activePage === 'settings' && <Settings />}
    </Layout>
  );
}
