## ADDED Requirements

### Requirement: Runnable Tauri React TypeScript Project

The system SHALL provide a runnable Tauri + React + TypeScript application scaffold managed by pnpm.

#### Scenario: Install dependencies
- **WHEN** a developer runs `pnpm install`
- **THEN** dependencies SHALL install successfully from `package.json`

#### Scenario: Run frontend dev server
- **WHEN** a developer runs `pnpm dev`
- **THEN** the React application SHALL start in browser development mode

#### Scenario: Run Tauri development app
- **WHEN** a developer runs `pnpm tauri dev`
- **THEN** Tauri SHALL compile the desktop shell and open the CRM simulator window

### Requirement: Windows Desktop Configuration

The system SHALL include Tauri configuration suitable for a Windows desktop application named MiniCRM Simulator.

#### Scenario: Inspect desktop metadata
- **WHEN** the Tauri configuration is opened
- **THEN** it SHALL define the application name, window title, frontend dev URL, frontend build output, and Windows bundling configuration

#### Scenario: Build desktop package
- **WHEN** a developer runs the configured Tauri build command on a prepared Windows machine
- **THEN** the build SHALL produce Windows desktop artifacts without requiring real customer data or network CRM services

### Requirement: Preserve OpenSpec Context

The project scaffold MUST coexist with existing OpenSpec files and repository metadata.

#### Scenario: Scaffold existing repository
- **WHEN** the application scaffold is added
- **THEN** `openspec/project.md`, `openspec/project_cn.md`, and existing `.codex` OpenSpec skills SHALL remain available

