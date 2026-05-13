# crm-sales-flow Specification

## Purpose
TBD - created by archiving change bootstrap-tauri-crm-mvp. Update Purpose after archive.
## Requirements
### Requirement: Lead Management And Conversion

The system SHALL allow permission-scoped users to view leads, create mock leads, edit leads, assign owners, mark invalid leads, and convert valid leads into customers.

#### Scenario: Convert lead to customer
- **WHEN** a valid lead is converted
- **THEN** the system SHALL create a customer record, mark the lead as 已转客户, assign the responsible owner, and set the customer status to 待跟进

#### Scenario: Mark lead invalid
- **WHEN** a user marks a lead as invalid
- **THEN** the lead status SHALL become 无效线索 and the lead SHALL NOT create a customer

### Requirement: Customer Detail Workflow

The system SHALL provide customer list and detail views with contacts, follow-ups, opportunities, orders, and tickets related to the selected customer.

#### Scenario: Open customer detail
- **WHEN** a user opens a customer record within their permitted scope
- **THEN** the detail view SHALL show customer basics, primary contact, follow-up history, related opportunities, related orders, and related tickets

#### Scenario: Add follow-up
- **WHEN** a user adds a follow-up from a customer detail view
- **THEN** the follow-up SHALL be associated with that customer and SHALL update recent follow-up information

### Requirement: Opportunity Stage Progression

The system SHALL allow users to create opportunities from customers and progress opportunities through configured sales stages.

#### Scenario: Create opportunity
- **WHEN** a user creates an opportunity from a customer
- **THEN** the opportunity SHALL start at 初步接触 with the configured 20% probability

#### Scenario: Update stage
- **WHEN** a user changes an opportunity stage
- **THEN** the opportunity probability SHALL update to the configured probability for that stage

### Requirement: Won And Lost Opportunity Outcomes

The system SHALL handle won and lost opportunity outcomes with required business effects.

#### Scenario: Mark opportunity won
- **WHEN** an opportunity is marked as 赢单
- **THEN** the system SHALL set probability to 100%, create a simulated order with amount equal to the opportunity amount, and update the customer status to 已成交

#### Scenario: Mark opportunity lost
- **WHEN** an opportunity is marked as 输单
- **THEN** the system SHALL require a lost reason and SHALL NOT create an order

### Requirement: Permission Scoped Sales Data

The system SHALL enforce role-based data scope across leads, customers, opportunities, follow-ups, and orders.

#### Scenario: Staff sees own sales records
- **WHEN** a staff user opens sales modules
- **THEN** the system SHALL show only records owned by or related to that staff user

#### Scenario: Manager sees team sales records
- **WHEN** a manager opens sales modules
- **THEN** the system SHALL show team records and allow team lead assignment where configured

