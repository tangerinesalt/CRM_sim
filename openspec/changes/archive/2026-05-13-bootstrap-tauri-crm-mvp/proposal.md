## Why

The repository currently contains OpenSpec project context but no runnable application. This change turns the CRM simulator concept into a working Chinese-first Tauri desktop MVP that can be run locally, exercised end-to-end with mock data, and later packaged for Windows.

## What Changes

- Add a Tauri + React + TypeScript + pnpm project skeleton in the current repository.
- Add a Simplified Chinese application shell with layout, navigation, current role display, identity switching, and visible simulated-data messaging.
- Add configuration-driven role permissions, CRM domain values, and mock seed data.
- Add Zustand stores for authentication, CRM records, configuration, derived statistics, local persistence, and reset behavior.
- Add P0 CRM workflow screens and actions covering lead conversion, customer detail, opportunity progression, won order creation, and follow-up records.
- Add after-sales ticket workflow and dashboard/reporting metrics needed to validate the full CRM loop.
- Add local save and one-click reset behavior without connecting to real customer data or remote services.
- Add basic validation and build scripts so the app can be verified through the browser/Tauri dev flow and prepared for Windows packaging.

## Capabilities

### New Capabilities

- `tauri-react-shell`: Establishes the Tauri, React, TypeScript, pnpm, Vite, and Windows desktop application foundation.
- `chinese-crm-navigation`: Provides the Chinese-first CRM application shell, navigation, role indicator, identity switching, and simulated-data messaging.
- `mock-crm-state`: Provides configurable mock CRM seed data, domain values, role permissions, and Zustand-backed state management.
- `crm-sales-flow`: Provides the P0 lead-to-customer-to-opportunity-to-order workflow with follow-ups and permission-aware data scope.
- `after-sales-dashboard`: Provides after-sales ticket workflow and dashboard/reporting metrics for the simulated CRM loop.
- `local-data-reset`: Provides local-only persistence, simulated data export/import guardrails, and one-click reset to seed data.

### Modified Capabilities

None.

## Impact

- Adds frontend application files under `src/`.
- Adds Tauri desktop files under `src-tauri/`.
- Adds package and tooling files such as `package.json`, `pnpm-lock.yaml`, Vite, TypeScript, and Tauri configuration.
- Adds mock seed/config files and utility modules for permissions, IDs, dates, statistics, and local persistence.
- Uses local JSON-style persistence for MVP speed while keeping a repository/storage abstraction so SQLite can replace it later.
- Does not add real authentication, real customer imports, network CRM integrations, cloud sync, payment, contract, email, SMS, or WeChat integrations.
