import { create } from 'zustand';
import appConfig from '../config/app-config.json';
import seedContacts from '../mock/seed-contacts.json';
import seedCustomers from '../mock/seed-customers.json';
import seedFollowups from '../mock/seed-followups.json';
import seedLeads from '../mock/seed-leads.json';
import seedOpportunities from '../mock/seed-opportunities.json';
import seedOrders from '../mock/seed-orders.json';
import seedTickets from '../mock/seed-tickets.json';
import type {
  Contact,
  CrmData,
  Customer,
  FollowUp,
  ImportResult,
  Lead,
  Opportunity,
  Order,
  Ticket,
} from '../types';
import { createId, createOrderNo } from '../utils/id';
import {
  clearLocalState,
  downloadJson,
  loadLocalState,
  parseImportJson,
  saveLocalState,
} from '../utils/persistence';
import { todayIso } from '../utils/date';

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function seedData(): CrmData {
  return {
    leads: clone(seedLeads as Lead[]),
    customers: clone(seedCustomers as Customer[]),
    contacts: clone(seedContacts as Contact[]),
    opportunities: clone(seedOpportunities as Opportunity[]),
    followups: clone(seedFollowups as FollowUp[]),
    orders: clone(seedOrders as Order[]),
    tickets: clone(seedTickets as Ticket[]),
  };
}

const initialData = loadLocalState() ?? seedData();

interface CrmStore extends CrmData {
  message: string;
  createLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLead: (lead: Lead) => void;
  assignLead: (leadId: string, ownerId: string) => void;
  markLeadInvalid: (leadId: string) => void;
  convertLeadToCustomer: (leadId: string) => string | null;
  addFollowUp: (followup: Omit<FollowUp, 'id' | 'createdAt'>) => void;
  createOpportunity: (opportunity: Omit<Opportunity, 'id' | 'probability' | 'status' | 'lostReason' | 'createdAt' | 'updatedAt'>) => void;
  updateOpportunityStage: (opportunityId: string, stage: string) => void;
  markOpportunityWon: (opportunityId: string) => void;
  markOpportunityLost: (opportunityId: string, lostReason: string) => void;
  createTicket: (ticket: Omit<Ticket, 'id' | 'status' | 'result' | 'satisfactionScore' | 'createdAt' | 'closedAt'>) => void;
  updateTicket: (ticketId: string, updates: Partial<Ticket>) => void;
  resetData: () => void;
  exportData: () => void;
  importData: (content: string) => ImportResult;
  clearMessage: () => void;
}

function stageProbability(stageName: string): number {
  return appConfig.salesStages.find((stage) => stage.name === stageName)?.probability ?? 0;
}

function persistState(state: CrmData): void {
  saveLocalState(state);
}

function crmDataFromState(state: CrmStore): CrmData {
  return {
    leads: state.leads,
    customers: state.customers,
    contacts: state.contacts,
    opportunities: state.opportunities,
    followups: state.followups,
    orders: state.orders,
    tickets: state.tickets,
  };
}

export const useCrmStore = create<CrmStore>((set, get) => ({
  ...initialData,
  message: loadLocalState() ? '已载入本地保存的模拟数据。' : '已载入初始模拟数据。',

  createLead: (lead) => {
    const now = todayIso();
    set((state) => {
      const next = {
        ...state,
        leads: [
          {
            ...lead,
            id: createId('L'),
            createdAt: now,
            updatedAt: now,
          },
          ...state.leads,
        ],
        message: '已新建模拟线索，并保存到本地。',
      };
      persistState(crmDataFromState(next));
      return next;
    });
  },

  updateLead: (lead) => {
    set((state) => {
      const next = {
        ...state,
        leads: state.leads.map((item) =>
          item.id === lead.id ? { ...lead, updatedAt: todayIso() } : item,
        ),
        message: '线索已更新。',
      };
      persistState(crmDataFromState(next));
      return next;
    });
  },

  assignLead: (leadId, ownerId) => {
    set((state) => {
      const next = {
        ...state,
        leads: state.leads.map((lead) =>
          lead.id === leadId
            ? { ...lead, ownerId, status: '已分配', updatedAt: todayIso() }
            : lead,
        ),
        message: '线索负责人已更新。',
      };
      persistState(crmDataFromState(next));
      return next;
    });
  },

  markLeadInvalid: (leadId) => {
    set((state) => {
      const next = {
        ...state,
        leads: state.leads.map((lead) =>
          lead.id === leadId ? { ...lead, status: '无效线索', updatedAt: todayIso() } : lead,
        ),
        message: '线索已标记为无效，不会生成客户。',
      };
      persistState(crmDataFromState(next));
      return next;
    });
  },

  convertLeadToCustomer: (leadId) => {
    const state = get();
    const lead = state.leads.find((item) => item.id === leadId);
    if (!lead || lead.status === '已转客户' || lead.status === '无效线索') {
      set({ message: '该线索无法转为客户。' });
      return null;
    }
    const now = todayIso();
    const contactId = createId('CT');
    const customerId = createId('C');
    const ownerId = lead.ownerId || 'u-staff01';
    const customer: Customer = {
      id: customerId,
      name: lead.companyName,
      type: '企业客户',
      industry: '待补充',
      region: '待补充',
      level: lead.level === '高' ? 'A 重点客户' : 'B 普通客户',
      mainContactId: contactId,
      ownerId,
      status: '待跟进',
      remark: lead.remark,
      createdAt: now,
      updatedAt: now,
    };
    const contact: Contact = {
      id: contactId,
      customerId,
      name: lead.contactName,
      position: '联系人',
      phone: lead.phone,
      email: lead.email,
      wechat: '',
      isPrimary: true,
      remark: '由模拟线索转化生成。',
    };
    set((current) => {
      const next = {
        ...current,
        leads: current.leads.map((item) =>
          item.id === leadId
            ? { ...item, ownerId, status: '已转客户', updatedAt: now }
            : item,
        ),
        customers: [customer, ...current.customers],
        contacts: [contact, ...current.contacts],
        message: '线索已转为客户，客户状态为待跟进。',
      };
      persistState(crmDataFromState(next));
      return next;
    });
    return customerId;
  },

  addFollowUp: (followup) => {
    const now = todayIso();
    set((state) => {
      const next = {
        ...state,
        followups: [{ ...followup, id: createId('F'), createdAt: now }, ...state.followups],
        customers: state.customers.map((customer) =>
          customer.id === followup.customerId
            ? { ...customer, status: '跟进中', updatedAt: now }
            : customer,
        ),
        message: '跟进记录已添加，并保存到本地。',
      };
      persistState(crmDataFromState(next));
      return next;
    });
  },

  createOpportunity: (opportunity) => {
    const now = todayIso();
    const probability = stageProbability(opportunity.stage);
    set((state) => {
      const next = {
        ...state,
        opportunities: [
          {
            ...opportunity,
            id: createId('OP'),
            probability,
            status: '进行中',
            lostReason: '',
            createdAt: now,
            updatedAt: now,
          },
          ...state.opportunities,
        ],
        message: '商机已创建，默认进入配置化销售阶段。',
      };
      persistState(crmDataFromState(next));
      return next;
    });
  },

  updateOpportunityStage: (opportunityId, stage) => {
    set((state) => {
      const next = {
        ...state,
        opportunities: state.opportunities.map((opportunity) =>
          opportunity.id === opportunityId
            ? {
                ...opportunity,
                stage,
                probability: stageProbability(stage),
                status: stage === '赢单' ? '已赢单' : stage === '输单' ? '已输单' : '进行中',
                updatedAt: todayIso(),
              }
            : opportunity,
        ),
        message: '商机阶段已更新。',
      };
      persistState(crmDataFromState(next));
      return next;
    });
  },

  markOpportunityWon: (opportunityId) => {
    const state = get();
    const opportunity = state.opportunities.find((item) => item.id === opportunityId);
    if (!opportunity) {
      set({ message: '未找到商机。' });
      return;
    }
    const existingOrder = state.orders.find((order) => order.opportunityId === opportunityId);
    const now = todayIso();
    const order: Order = {
      id: createId('ORD'),
      customerId: opportunity.customerId,
      opportunityId,
      orderNo: createOrderNo(),
      amount: opportunity.amount,
      status: '待确认',
      ownerId: opportunity.ownerId,
      remark: '赢单商机自动生成的模拟订单。',
      createdAt: now,
      updatedAt: now,
    };
    set((current) => {
      const next = {
        ...current,
        opportunities: current.opportunities.map((item) =>
          item.id === opportunityId
            ? { ...item, stage: '赢单', probability: 100, status: '已赢单', updatedAt: now }
            : item,
        ),
        customers: current.customers.map((customer) =>
          customer.id === opportunity.customerId
            ? { ...customer, status: '已成交', updatedAt: now }
            : customer,
        ),
        orders: existingOrder ? current.orders : [order, ...current.orders],
        message: existingOrder ? '商机已赢单，订单已存在。' : '商机已赢单，并自动生成模拟订单。',
      };
      persistState(crmDataFromState(next));
      return next;
    });
  },

  markOpportunityLost: (opportunityId, lostReason) => {
    if (!lostReason.trim()) {
      set({ message: '标记输单必须填写输单原因。' });
      return;
    }
    set((state) => {
      const next = {
        ...state,
        opportunities: state.opportunities.map((item) =>
          item.id === opportunityId
            ? {
                ...item,
                stage: '输单',
                probability: 0,
                status: '已输单',
                lostReason,
                updatedAt: todayIso(),
              }
            : item,
        ),
        message: '商机已标记为输单，未创建订单。',
      };
      persistState(crmDataFromState(next));
      return next;
    });
  },

  createTicket: (ticket) => {
    const now = todayIso();
    set((state) => {
      const next = {
        ...state,
        tickets: [
          {
            ...ticket,
            id: createId('T'),
            status: '待处理',
            result: '',
            satisfactionScore: 0,
            createdAt: now,
            closedAt: '',
          },
          ...state.tickets,
        ],
        message: '售后工单已创建。',
      };
      persistState(crmDataFromState(next));
      return next;
    });
  },

  updateTicket: (ticketId, updates) => {
    set((state) => {
      const next = {
        ...state,
        tickets: state.tickets.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, ...updates } : ticket,
        ),
        message: '售后工单已更新。',
      };
      persistState(crmDataFromState(next));
      return next;
    });
  },

  resetData: () => {
    const nextSeed = seedData();
    clearLocalState();
    saveLocalState(nextSeed);
    set({ ...nextSeed, message: '已恢复初始模拟数据。' });
  },

  exportData: () => {
    downloadJson('demo-crm-data.json', crmDataFromState(get()));
    set({ message: '已导出模拟数据文件 demo-crm-data.json。' });
  },

  importData: (content) => {
    const { data, result } = parseImportJson(content);
    if (data) {
      saveLocalState(data);
      set({ ...data, message: result.message });
    } else {
      set({ message: result.message });
    }
    return result;
  },

  clearMessage: () => set({ message: '' }),
}));
