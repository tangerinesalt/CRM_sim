## 1. Project Scaffold

- [x] 1.1 Scaffold Vite React TypeScript files in the existing repository without removing OpenSpec files.
- [x] 1.2 Add pnpm-managed dependencies for React, TypeScript, Vite, Tauri CLI, Zustand, and UI/runtime helpers.
- [x] 1.3 Configure `package.json` scripts for `pnpm dev`, `pnpm build`, `pnpm preview`, `pnpm tauri dev`, and `pnpm tauri build`.
- [x] 1.4 Initialize Tauri v2 configuration under `src-tauri/` with MiniCRM Simulator app metadata and Windows desktop targets.
- [x] 1.5 Verify the browser dev server starts with `pnpm dev`.
- [x] 1.6 Verify the Tauri dev window starts with `pnpm tauri dev`.

## 2. Chinese Application Shell

- [x] 2.1 Build the main layout with sidebar navigation, topbar, content region, and simulated-data banner.
- [x] 2.2 Add Simplified Chinese navigation labels for 工作台, 线索管理, 客户管理, 商机管理, 跟进记录, 订单管理, 售后服务, 数据看板, and 系统配置.
- [x] 2.3 Add current identity display with role name, data scope, and identity-switch control.
- [x] 2.4 Hide navigation items according to administrator, manager, and staff role visibility rules.
- [x] 2.5 Add basic reusable UI primitives for buttons, filters, tables, forms, modal dialogs, and empty states.

## 3. Configuration And Mock Data

- [x] 3.1 Add `app-config.json` for app name, default role, identity switching, reset, import rules, sales stages, customer levels, lead sources, and theme.
- [x] 3.2 Add `permission-config.json` for administrator, manager, and staff module access, operations, and data scopes.
- [x] 3.3 Add fictional seed users, leads, customers, contacts, opportunities, follow-ups, orders, and tickets.
- [x] 3.4 Add TypeScript domain types for users, leads, customers, contacts, opportunities, follow-ups, orders, tickets, permissions, and dashboard metrics.
- [x] 3.5 Add helpers for ID generation, date comparison, sales-stage probability lookup, scoped filtering, and permission checks.

## 4. Zustand State And Persistence

- [x] 4.1 Implement `authStore` for default administrator identity and role switching.
- [x] 4.2 Implement `configStore` for app config, domain values, and permission config.
- [x] 4.3 Implement `crmStore` for CRM records and domain operations.
- [x] 4.4 Add a local persistence adapter that saves and hydrates simulator state without remote services.
- [x] 4.5 Add admin-only reset action that restores seed data and refreshes derived dashboard state.
- [x] 4.6 Add visible Chinese messages for local save, reset confirmation, and simulated-data guardrails.

## 5. P0 Sales Flow

- [x] 5.1 Build lead list with search, status filter, owner filter, create/edit actions, assignment, invalid marking, and scoped visibility.
- [x] 5.2 Implement lead-to-customer conversion that creates a customer, marks the lead 已转客户, assigns owner, and sets customer status 待跟进.
- [x] 5.3 Build customer list and customer detail with contacts, follow-ups, opportunities, orders, and tickets.
- [x] 5.4 Add follow-up creation from customer and opportunity contexts with next follow-up time and result.
- [x] 5.5 Build opportunity list/detail and create-opportunity flow from customer detail.
- [x] 5.6 Implement opportunity stage changes with configured probability updates.
- [x] 5.7 Implement won opportunity behavior that creates a simulated order and updates customer status 已成交.
- [x] 5.8 Implement lost opportunity behavior that requires lost reason and does not create an order.
- [x] 5.9 Build order list/detail with role-scoped visibility.

## 6. After Sales And Dashboard

- [x] 6.1 Build after-sales ticket list and create-ticket flow for permitted customer/order records.
- [x] 6.2 Implement ticket assignment, status update, result entry, closure time, and satisfaction score.
- [x] 6.3 Build dashboard metric cards for leads, customers, opportunities, won/lost counts, simulated amount, pending follow-ups, overdue follow-ups, tickets, conversion rate, win rate, and forecast amount.
- [x] 6.4 Scope dashboard metrics by administrator global scope, manager team scope, and staff personal scope.
- [x] 6.5 Add recent follow-up and overdue follow-up sections to the workbench.

## 7. Import Export Guardrails

- [x] 7.1 Add simulated JSON export with default filename `demo-crm-data.json`.
- [x] 7.2 Add import schema validation for simulator JSON files.
- [x] 7.3 Reject unsupported real customer Excel imports with a Chinese explanation.
- [x] 7.4 Ensure import/export controls follow role permissions and simulated-data messaging.

## 8. Verification And Release Readiness

- [x] 8.1 Run TypeScript build and fix all compile errors.
- [x] 8.2 Run browser verification for the main CRM flow.
- [x] 8.3 Run Tauri dev verification for the desktop shell.
- [x] 8.4 Verify role switching changes navigation, data scope, and dashboard metrics.
- [x] 8.5 Verify reset restores seed data and clears locally created records.
- [x] 8.6 Update README with setup, run, build, and simulated-data notes.
- [x] 8.7 Commit and push the completed implementation to GitHub.
