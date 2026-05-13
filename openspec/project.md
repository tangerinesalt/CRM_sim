# Project Context

## Purpose

MiniCRM Simulator is a Windows desktop CRM simulator. It demonstrates a complete CRM business loop with local mock data: lead capture, lead assignment, customer conversion, opportunity follow-up, won deal, simulated order creation, after-sales ticket handling, and reporting.

The product is for simulation, learning, product validation, and internal demonstration. It must not connect to or process real customer data.

The application is Chinese-first. Product copy, navigation labels, form labels, status names, validation messages, mock business content, release notes, and user-facing documentation should primarily use Simplified Chinese. English identifiers are acceptable in code, configuration keys, filenames, and technical documentation where they improve maintainability.

## Source Reference

- Notion page: `研发项目｜基础CRM系统模拟器设计稿_20260513`
- Record date: `2026-05-13`
- Source purpose: product and engineering plan for a Tauri Windows desktop CRM simulator.

## Tech Stack

- Desktop shell: Tauri
- Frontend: React + TypeScript
- Styling: CSS Modules or Tailwind CSS
- State management: Zustand
- Mock data: JSON seed files
- Local persistence: SQLite or JSON files
- Packaging: Tauri build
- Release automation: GitHub Actions
- Target platform: Windows 10 and Windows 11

## Product Principles

- Keep the first version small, complete, and easy to understand.
- The home page should show only the most important work items and metrics.
- Each page should focus on one primary task.
- Forms should generally stay under 10 fields.
- List pages should support search, filters, detail navigation, and simple pagination or scrolling.
- All simulated operations must be resettable with one action.
- Default login is administrator; there is no real registration or password verification.
- The UI must clearly mark that the app uses simulated data.
- Roles, permissions, customer fields, sales stages, lead sources, customer levels, dashboard metrics, and reset rules should live in configuration files rather than being hard-coded into page components.

## Simulation And Data Constraints

- Do not connect to real CRM, email, SMS, WeChat, payment, contract, or cloud sync services.
- Do not upload any local data.
- Do not collect user privacy data.
- All seeded company names, people, phone numbers, emails, contracts, orders, and follow-up records must be fictional.
- User-created and edited records are local simulation data only.
- Exported files must still be treated as simulated data and default to `demo-crm-data.json`.
- Import is allowed only for JSON files matching the simulator schema.
- Importing real customer Excel files is explicitly disallowed to avoid misuse.
- The app should work offline.

## Roles And Permissions

The app has three built-in roles:

- `admin`: full access to all modules, all records, system configuration, identity switching, and data reset.
- `manager`: team-scoped access; can assign leads, inspect team CRM data, and view team dashboard data; cannot modify system configuration or reset all data.
- `staff`: personal-scope access; can create and manage assigned leads, customers, follow-ups, opportunities, orders, and related tickets; cannot delete critical data, access other staff customer details, or change system configuration.

Default accounts:

| Username | Role | Name | Phone | Email |
| --- | --- | --- | --- | --- |
| `admin` | admin | 陈明 | 13800000001 | admin@demo-crm.local |
| `manager01` | manager | 李娜 | 13800000002 | manager01@demo-crm.local |
| `staff01` | staff | 王强 | 13800000003 | staff01@demo-crm.local |
| `staff02` | staff | 赵敏 | 13800000004 | staff02@demo-crm.local |

## Core Modules

The navigation should include:

- Dashboard
- Leads
- Customers
- Opportunities
- Follow-ups
- Orders
- After-sales tickets
- Reports
- Settings

Role visibility rules:

- Staff should not see system settings.
- Managers should not see global configuration or full data reset controls.
- Admins should see all modules.

## Business Flow

The primary end-to-end flow is:

```text
Lead captured
  -> lead assigned
  -> lead followed up
  -> converted to customer
  -> opportunity created
  -> opportunity followed up and advanced
  -> opportunity won
  -> simulated order generated
  -> after-sales ticket created
  -> dashboard metrics updated
```

Important flow rules:

- Converting a valid lead should create a customer profile and put the customer into a follow-up state.
- A new opportunity created from a customer should start at the initial sales stage.
- Marking an opportunity as won should automatically create a simulated order and mark the customer as won/closed.
- Marking an opportunity as lost must require a lost reason.
- After-sales tickets should support assignment, processing, result recording, closure, and satisfaction scoring.

## Domain Model

Primary entities:

- User: `id`, `username`, `displayName`, `role`, `phone`, `email`, `teamId`, `status`
- Lead: `id`, `companyName`, `contactName`, `phone`, `email`, `source`, `level`, `ownerId`, `status`, `remark`, `createdAt`, `updatedAt`
- Customer: `id`, `name`, `type`, `industry`, `region`, `level`, `mainContactId`, `ownerId`, `status`, `remark`, `createdAt`, `updatedAt`
- Contact: `id`, `customerId`, `name`, `position`, `phone`, `email`, `wechat`, `isPrimary`, `remark`
- Opportunity: `id`, `customerId`, `name`, `amount`, `stage`, `probability`, `ownerId`, `expectedCloseDate`, `status`, `lostReason`, `createdAt`, `updatedAt`
- Follow-up: `id`, `customerId`, `opportunityId`, `userId`, `method`, `content`, `result`, `nextFollowTime`, `createdAt`
- Order: `id`, `customerId`, `opportunityId`, `orderNo`, `amount`, `status`, `ownerId`, `createdAt`, `updatedAt`
- Ticket: `id`, `customerId`, `orderId`, `type`, `description`, `handlerId`, `status`, `result`, `satisfactionScore`, `createdAt`, `closedAt`

## Domain Values

Lead statuses:

- New lead
- Assigned
- Following up
- Converted to customer
- Invalid

Customer types:

- Enterprise customer
- Individual customer
- Channel customer

Customer levels:

- A key customer
- B normal customer
- C low priority customer

Customer statuses:

- Pending follow-up
- Following up
- Won
- Silent
- Lost

Sales stages and probabilities:

| Stage | Probability |
| --- | --- |
| Initial contact | 20% |
| Requirement confirmed | 40% |
| Proposal/quotation | 60% |
| Negotiation | 80% |
| Won | 100% |
| Lost | 0% |

Follow-up methods:

- Phone
- WeChat
- Email
- Visit
- Online meeting

Follow-up results:

- Interested
- Needs quotation
- Waiting for decision
- No budget
- Won
- Rejected

Order statuses:

- Pending confirmation
- Confirmed
- Completed
- Canceled

Ticket types:

- Usage consultation
- Functional issue
- Contract issue
- Renewal consultation
- Complaint or suggestion

Ticket statuses:

- Pending
- In progress
- Resolved
- Closed

## Dashboard Metrics

The dashboard should include:

- Total leads
- Total customers
- Active opportunities
- Won opportunities
- Lost opportunities
- Simulated won amount
- Customers pending follow-up
- Overdue follow-ups
- After-sales ticket count
- Customer conversion rate
- Win rate
- Sales forecast amount

Metric formulas:

- Customer conversion rate = converted leads / total leads
- Win rate = won opportunities / total opportunities
- Sales forecast amount = sum of opportunity amount multiplied by sales-stage probability
- Pending follow-up count = follow-up records whose next follow-up time is today or earlier and not completed

## Expected Project Structure

```text
src/pages/Dashboard
src/pages/Leads
src/pages/Customers
src/pages/Opportunities
src/pages/FollowUps
src/pages/Orders
src/pages/Tickets
src/pages/Reports
src/pages/Settings
src/components/Layout
src/components/Table
src/components/Form
src/components/Modal
src/components/PermissionGuard
src/store/authStore
src/store/crmStore
src/store/configStore
src/mock/seed-users.json
src/mock/seed-customers.json
src/mock/seed-leads.json
src/mock/seed-opportunities.json
src/mock/seed-followups.json
src/utils/permission.ts
src/utils/id.ts
src/utils/date.ts
src/utils/statistics.ts
src-tauri/src/main.rs
src-tauri/tauri.conf.json
src-tauri/capabilities/default.json
package.json
README.md
release-notes.md
```

## Configuration

Use configuration files for product rules and permissions.

`app-config.json` should cover:

- Application name: `MiniCRM Simulator`
- Default role: `admin`
- Identity switching enabled
- Data reset enabled
- Mock data import enabled
- Real data import disabled
- Default sales stages
- Default customer levels
- Default lead sources
- Default theme: light

`permission-config.json` should cover:

- Admin modules and operations
- Manager modules, team scope, and forbidden operations
- Staff modules, personal scope, and forbidden operations

## MVP Scope

The first version must include:

- Tauri project initialization
- Default administrator entry
- Identity switching
- Dashboard
- Lead list and lead-to-customer conversion
- Customer list and customer detail
- Follow-up records
- Opportunity stage progression
- Automatic order creation after won opportunity
- After-sales ticket workflow
- Basic dashboard metrics
- Permission control
- One-click simulated data reset
- Windows installer build

The first version must not include:

- Real registration or login
- Real SMS, email, WeChat, payment, contract, or cloud integrations
- Real customer data import
- Cloud sync
- Multi-tenant architecture
- Mobile app
- AI customer service
- Complex approval workflows

## Development Priorities

- P0: Tauri setup, page shell, mock data loading, login and identity switching, permission guard, lead/customer/opportunity/follow-up loop, local persistence, reset.
- P1: Orders, after-sales tickets, dashboard, system settings, Windows packaging.
- P2: Mock data import/export, updater placeholder, theme configuration, i18n placeholder, richer mock data.

## Acceptance Criteria

- The Windows app can be installed and launched.
- The app enters admin identity by default.
- Users can switch between admin, manager, and staff identities.
- Different roles see different data scopes and module access.
- Users can complete the full lead-to-customer-to-opportunity-to-order-to-ticket flow.
- All records and exported files are clearly simulated data.
- The app can reset back to initial seed data.
- The app works offline.
- Build commands can reliably generate a Windows installer.
- Adding future fields, roles, and sales stages should not require large architectural changes.
