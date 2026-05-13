## ADDED Requirements

### Requirement: Local Only Persistence

The system SHALL save simulator state locally and SHALL NOT upload CRM data to remote services.

#### Scenario: Save local changes
- **WHEN** a user creates or edits simulator records
- **THEN** the changes SHALL persist locally across application reloads

#### Scenario: Offline use
- **WHEN** the application is used without internet access
- **THEN** local CRM simulation features SHALL continue to work

### Requirement: One Click Seed Reset

The system SHALL provide an administrator-only action to reset local simulator state back to initial seed data.

#### Scenario: Administrator resets data
- **WHEN** an administrator confirms reset
- **THEN** all local simulator state SHALL be replaced with initial seed data

#### Scenario: Non-admin reset hidden
- **WHEN** a manager or staff user uses the application
- **THEN** full data reset controls SHALL NOT be available

### Requirement: Simulated Import Export Guardrails

The system SHALL treat imports and exports as simulated data only.

#### Scenario: Export simulator data
- **WHEN** simulator data is exported
- **THEN** the file SHALL be named `demo-crm-data.json` by default and SHALL be clearly described as simulated data

#### Scenario: Reject unsupported import
- **WHEN** a user attempts to import data that does not match the simulator JSON schema
- **THEN** the system SHALL reject the import and SHALL explain in Chinese that real customer Excel import is not supported

