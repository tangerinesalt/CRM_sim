## Context

The repository has OpenSpec context, README content, and GitHub publishing, but it does not yet contain a runnable application. The target product is a Chinese-first Windows desktop CRM simulator that runs offline with fictional data and demonstrates a complete P0 CRM workflow.

The implementation needs to move quickly while keeping future extension possible. The first version should be runnable through a Tauri development window, easy to inspect in a browser during UI work, and structured so later features can replace local JSON persistence with SQLite without rewriting page behavior.

## Goals / Non-Goals

**Goals:**

- Create a runnable Tauri + React + TypeScript + pnpm application foundation.
- Provide a Simplified Chinese CRM shell with stable navigation, role display, identity switching, and simulated-data messaging.
- Use mock seed data and configuration files for users, permissions, CRM statuses, stages, levels, and lead sources.
- Implement the P0 loop: lead conversion, customer detail, opportunity progression, won order creation, after-sales ticket creation, dashboard updates, local persistence, and reset.
- Keep business operations offline and local-only.
- Keep code modular enough that order, ticket, dashboard, and persistence logic can be expanded without large rewrites.

**Non-Goals:**

- Real authentication, password validation, registration, or user management.
- Real customer data import, Excel import, CRM integrations, cloud sync, SMS, email, WeChat, payment, contract, or AI customer service integrations.
- Multi-tenant architecture, mobile support, complex approvals, or production-grade audit logging.
- Full visual design system beyond the reusable components needed for the MVP.

## Decisions

### Use Vite React TypeScript with Tauri v2

The frontend will use Vite, React, and TypeScript, with Tauri v2 providing the desktop shell. This matches the project context and gives the quickest path to a browser-testable UI plus Windows desktop packaging.

Alternatives considered:

- Plain Tauri vanilla template: faster scaffold, but weaker fit for multi-page CRM state and component reuse.
- Next.js: heavier than needed for an offline desktop simulator.
- Web-only React app first: faster initially, but delays Tauri configuration and installer risks.

### Use pnpm and local Tauri CLI dependency

The project will use pnpm scripts such as `pnpm dev`, `pnpm tauri dev`, `pnpm build`, and `pnpm tauri build`. The Tauri CLI will be installed as a dev dependency instead of requiring a global `cargo-tauri` command.

Alternatives considered:

- npm: available, but the project context prefers pnpm.
- Global `cargo-tauri`: useful fallback, but unnecessary when Node scripts can manage the CLI consistently.

### Use Zustand stores with domain helpers

State will be split into:

- `authStore`: current user and role switching.
- `configStore`: app config, domain values, and permission config.
- `crmStore`: leads, customers, contacts, opportunities, follow-ups, orders, tickets, reset, and persistence hydration.

Business operations such as `convertLeadToCustomer`, `markOpportunityWon`, and `createTicket` should live in store actions or nearby domain helper modules, not directly inside page components.

Alternatives considered:

- React Context only: simple, but likely to become noisy as CRM operations grow.
- Redux Toolkit: powerful, but heavier than needed for this MVP.

### Use local JSON persistence for MVP

The MVP will persist simulator state locally through a small persistence adapter. Browser/dev mode can use `localStorage`; Tauri mode can later use a file-backed command or plugin without changing page code. The adapter should preserve the option to swap in SQLite later.

Alternatives considered:

- SQLite immediately: more realistic for CRM data, but slower to scaffold and test during the first runnable slice.
- No persistence: fastest, but fails the local save requirement.

### Make permissions configuration-driven

Role behavior will be driven by `permission-config.json` and checked through `PermissionGuard` plus utility functions. Pages should ask for capabilities and scopes instead of hard-coding role names everywhere.

Alternatives considered:

- Page-level role checks only: quick, but easy to scatter and hard to maintain.
- Backend-enforced permissions: unnecessary for a local mock simulator with no real data or remote API.

### Chinese-first UI and mock content

All user-facing labels, statuses, validation messages, dashboard cards, mock business content, and release notes will use Simplified Chinese by default. English remains acceptable for code identifiers, file paths, and configuration keys.

Alternatives considered:

- Bilingual UI: useful later, but not needed for the MVP and adds copy overhead.

### Build one vertical slice before filling every module

Implementation should first create the shell and a complete happy path:

```text
线索管理 -> 转为客户 -> 客户详情 -> 创建商机 -> 标记赢单 -> 自动订单 -> 售后工单 -> 看板更新
```

After this vertical slice works, remaining list/detail polish and secondary actions can be filled in.

Alternatives considered:

- Build all pages as static screens first: visually satisfying, but delays validation of business rules.
- Build data layer first with no UI: clean technically, but less useful for quick simulator feedback.

## Risks / Trade-offs

- Local JSON persistence may diverge from future SQLite behavior -> Use a persistence adapter and keep page code independent of storage details.
- Permissions may be under-specified at first -> Centralize permission checks and add scenarios for admin, manager, and staff scope.
- The first UI can become table-heavy and hard to scan -> Keep page layouts dense but organized, with no decorative landing page.
- Tauri Windows build may fail on missing system dependencies -> Verify `pnpm tauri dev` early, then add packaging checks once the app skeleton runs.
- Mock data reset can erase user-created local state unexpectedly -> Make reset explicit, admin-only, and clearly labeled as simulated data reset.
- Chinese copy can become inconsistent across config and UI -> Store statuses/domain labels in config and reuse them in pages.

## Migration Plan

1. Scaffold the Tauri/React project in the existing repository without deleting OpenSpec files.
2. Add dependencies and scripts, then verify the browser dev server.
3. Add Tauri configuration and verify the Tauri development window.
4. Add app shell, navigation, and role switching.
5. Add seed/config/state layers and hydrate from local persistence.
6. Implement the P0 vertical CRM flow.
7. Add ticket workflow, dashboard metrics, reset, and validation checks.
8. Commit and push the completed change after verification.

Rollback is simple during MVP development: revert this change branch/commit to return to the OpenSpec-only repository state.

## Open Questions

- Should MVP persistence remain browser `localStorage`, or should the first implementation include a Tauri file-write command for real desktop-local JSON storage?
- Should the first installer target be NSIS only, or both NSIS and MSI?
- Should the project add a license before the first public implementation commit?
