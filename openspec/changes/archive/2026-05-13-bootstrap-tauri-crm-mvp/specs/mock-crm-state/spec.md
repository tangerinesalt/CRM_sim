## ADDED Requirements

### Requirement: Mock Seed Data

The system SHALL load fictional seed data for users, leads, customers, contacts, opportunities, and follow-up records.

#### Scenario: First launch seed load
- **WHEN** no saved simulator state exists
- **THEN** the CRM store SHALL initialize from seed data

#### Scenario: Inspect mock records
- **WHEN** a user views seeded CRM records
- **THEN** company names, people, phone numbers, emails, orders, and follow-up content SHALL be fictional simulation data

### Requirement: Configured Domain Values

The system SHALL load CRM domain values from configuration instead of duplicating them across pages.

#### Scenario: Render lead statuses
- **WHEN** the lead list renders status filters
- **THEN** statuses SHALL come from configuration and include 新线索, 已分配, 跟进中, 已转客户, and 无效线索

#### Scenario: Render sales stages
- **WHEN** opportunity stages are displayed
- **THEN** stages and probabilities SHALL come from configuration and include 初步接触 20%, 需求确认 40%, 方案报价 60%, 谈判中 80%, 赢单 100%, and 输单 0%

### Requirement: Centralized Permission Checks

The system SHALL evaluate module access, operations, and data scope through centralized permission utilities and configuration.

#### Scenario: Administrator access
- **WHEN** an administrator views CRM data
- **THEN** the system SHALL allow global access to all simulated records and configuration modules

#### Scenario: Manager access
- **WHEN** a manager views CRM data
- **THEN** the system SHALL restrict records to team scope and SHALL prevent system configuration and full reset operations

#### Scenario: Staff access
- **WHEN** a staff user views CRM data
- **THEN** the system SHALL restrict records to personal scope and SHALL prevent access to other staff customer details

### Requirement: Zustand CRM Stores

The system SHALL manage current identity, configuration, and CRM records through Zustand stores or equivalent store modules.

#### Scenario: Store action updates records
- **WHEN** a CRM operation such as lead conversion or opportunity win occurs
- **THEN** the relevant records SHALL update through store actions rather than direct page-local mutation

