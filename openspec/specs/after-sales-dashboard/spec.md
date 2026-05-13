# after-sales-dashboard Specification

## Purpose
TBD - created by archiving change bootstrap-tauri-crm-mvp. Update Purpose after archive.
## Requirements
### Requirement: After Sales Ticket Workflow

The system SHALL support after-sales tickets for simulated customers and orders.

#### Scenario: Create ticket for order
- **WHEN** a user creates an after-sales ticket for an order within their permitted scope
- **THEN** the ticket SHALL store customer, order, problem type, description, handler, status, and creation time

#### Scenario: Close ticket
- **WHEN** a ticket is closed
- **THEN** the system SHALL require a processing result, record closed time, and allow satisfaction score recording

### Requirement: Dashboard Metrics

The system SHALL calculate dashboard metrics from current local simulator state.

#### Scenario: Calculate conversion rate
- **WHEN** dashboard metrics are refreshed
- **THEN** customer conversion rate SHALL equal converted leads divided by total leads

#### Scenario: Calculate win rate
- **WHEN** dashboard metrics are refreshed
- **THEN** win rate SHALL equal won opportunities divided by total opportunities

#### Scenario: Calculate sales forecast
- **WHEN** dashboard metrics are refreshed
- **THEN** sales forecast amount SHALL equal the sum of opportunity amount multiplied by configured stage probability

#### Scenario: Calculate pending follow-ups
- **WHEN** dashboard metrics are refreshed
- **THEN** pending follow-up count SHALL include records whose next follow-up time is today or earlier and not completed

### Requirement: Role Scoped Dashboard

The system SHALL scope dashboard metrics according to the current role.

#### Scenario: Administrator dashboard
- **WHEN** an administrator opens the dashboard
- **THEN** metrics SHALL include all simulated records

#### Scenario: Manager dashboard
- **WHEN** a manager opens the dashboard
- **THEN** metrics SHALL include team-scoped records

#### Scenario: Staff dashboard
- **WHEN** a staff user opens the dashboard
- **THEN** metrics SHALL include personal-scope records

