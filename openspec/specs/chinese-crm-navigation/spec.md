# chinese-crm-navigation Specification

## Purpose
TBD - created by archiving change bootstrap-tauri-crm-mvp. Update Purpose after archive.
## Requirements
### Requirement: Chinese First Application Shell

The system SHALL render primary user-facing CRM navigation, labels, status text, empty states, validation messages, and simulated-data notices in Simplified Chinese.

#### Scenario: Open application shell
- **WHEN** a user opens the application
- **THEN** the shell SHALL display Chinese navigation and visible text indicating the system is using simulated data

#### Scenario: View technical identifiers
- **WHEN** a developer inspects code, routes, filenames, or configuration keys
- **THEN** English identifiers MAY be used while user-facing text remains Chinese-first

### Requirement: Role Aware Navigation

The system SHALL render navigation items according to the current simulated role.

#### Scenario: Administrator navigation
- **WHEN** the current role is administrator
- **THEN** the navigation SHALL show 工作台, 线索管理, 客户管理, 商机管理, 跟进记录, 订单管理, 售后服务, 数据看板, and 系统配置

#### Scenario: Manager navigation
- **WHEN** the current role is manager
- **THEN** the navigation SHALL show team-level CRM modules and SHALL hide global configuration and full reset controls

#### Scenario: Staff navigation
- **WHEN** the current role is staff
- **THEN** the navigation SHALL hide 系统配置 and show only modules available to personal-scope CRM work

### Requirement: Simulated Identity Switching

The system SHALL allow switching among built-in simulated identities without real password validation.

#### Scenario: Default identity
- **WHEN** the application starts for the first time
- **THEN** the current identity SHALL be the administrator account

#### Scenario: Switch identity
- **WHEN** a user selects another built-in identity
- **THEN** the shell SHALL update the current role indicator, navigation visibility, and data scope

#### Scenario: Show permission scope
- **WHEN** a user views the current identity control
- **THEN** the system SHALL show the current role and its data scope in Chinese

