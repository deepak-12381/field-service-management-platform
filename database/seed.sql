-- ============================================================================
-- Field Service Management Platform (Project KEYSTONE)
-- Initial Master & Seed Data Script
-- Target Database Engine: MySQL 8.0+
-- Database Name: field_service_management
-- ============================================================================

USE field_service_management;

-- Disable foreign key checks for safe seed data insertion
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- Seed Data: roles
-- ----------------------------------------------------------------------------
INSERT INTO roles (id, name) VALUES
(1, 'CUSTOMER'),
(2, 'TECHNICIAN'),
(3, 'DISPATCHER'),
(4, 'MANAGER'),
(5, 'ADMIN')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ----------------------------------------------------------------------------
-- Seed Data: users
-- BCrypt password hash below corresponds to: Password@123
-- ----------------------------------------------------------------------------
INSERT INTO users (id, email, full_name, password, role_id, phone, skills, status) VALUES
(1, 'admin@meridian.com', 'Deepak Admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 5, '9876543210', 'Management, System Administration', 'Active'),
(2, 'tech1@meridian.com', 'Deepak Tech', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 2, '9876543211', 'HVAC, AC Repair, Electrical', 'Available'),
(3, 'tech2@meridian.com', 'Aruj Technician', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 2, '09159764093', 'Plumbing, General Maintenance', 'Off Duty'),
(4, 'tech3@meridian.com', 'Bavan Technician', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 2, '8975634890', 'Electrical Systems, Inspection', 'Available'),
(5, 'dispatcher@meridian.com', 'Sarah Dispatcher', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 3, '9876543220', 'Scheduling, Dispatch', 'Active'),
(6, 'manager@meridian.com', 'Daniel Manager', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4, '9876543221', 'Operations Management', 'Active'),
(7, 'customer@meridian.com', 'ABC Contact', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, '9876543222', NULL, 'Active')
ON DUPLICATE KEY UPDATE
    full_name = VALUES(full_name),
    role_id = VALUES(role_id),
    phone = VALUES(phone),
    skills = VALUES(skills),
    status = VALUES(status);

-- ----------------------------------------------------------------------------
-- Seed Data: customers
-- ----------------------------------------------------------------------------
INSERT INTO customers (id, customer_name, email, phone, address, city, state, pincode, status, created_at, created_by) VALUES
(1, 'ABC Industries', 'abc@industries.com', '9876543210', 'Anna Nagar', 'Chennai', 'Tamil Nadu', '600040', 'Active', NOW(6), 'admin@meridian.com'),
(2, 'Northgate Logistics', 'contact@northgate.com', '9159764095', '18, Nagalamman Koil Street', 'Thiruttani', 'Tamil Nadu', '631208', 'Active', NOW(6), 'admin@meridian.com'),
(3, 'Meridian Retail Group', 'ops@meridianretail.com', '9123456780', 'OMR Tech Park', 'Chennai', 'Tamil Nadu', '600096', 'Active', NOW(6), 'admin@meridian.com')
ON DUPLICATE KEY UPDATE
    customer_name = VALUES(customer_name),
    address = VALUES(address),
    city = VALUES(city),
    state = VALUES(state),
    pincode = VALUES(pincode),
    status = VALUES(status);

-- ----------------------------------------------------------------------------
-- Seed Data: sites
-- ----------------------------------------------------------------------------
INSERT INTO sites (id, site_name, address, city, state, pincode, status, created_at, created_by, customer_id) VALUES
(1, 'Chennai Head Office', 'T Nagar', 'Chennai', 'Tamil Nadu', '600040', 'Active', NOW(6), 'admin@meridian.com', 1),
(2, 'Thiruttani Facility', 'Main Road', 'Thiruttani', 'Tamil Nadu', '631208', 'Active', NOW(6), 'admin@meridian.com', 2),
(3, 'Retail Warehouse', 'OMR Phase 2', 'Chennai', 'Tamil Nadu', '600096', 'Active', NOW(6), 'admin@meridian.com', 3)
ON DUPLICATE KEY UPDATE
    site_name = VALUES(site_name),
    address = VALUES(address),
    city = VALUES(city),
    state = VALUES(state),
    pincode = VALUES(pincode),
    status = VALUES(status),
    customer_id = VALUES(customer_id);

-- ----------------------------------------------------------------------------
-- Seed Data: work_orders (lifecycle statuses)
-- ----------------------------------------------------------------------------
INSERT INTO work_orders (id, title, description, priority, status, created_at, created_by, site_id, technician_id) VALUES
(1, 'AC Repair Service', 'Repair main office air conditioning unit', 'HIGH', 'CLOSED', NOW(6), 'admin@meridian.com', 1, 2),
(2, 'Routine AC Maintenance', 'Routine air conditioner inspection and filter replacement', 'MEDIUM', 'IN_PROGRESS', NOW(6), 'dispatcher@meridian.com', 2, 4),
(3, 'Electrical Panel Inspection', 'Quarterly electrical safety inspection', 'HIGH', 'ASSIGNED', NOW(6), 'dispatcher@meridian.com', 1, 3),
(4, 'Plumbing Leak Fix', 'Fix restroom pipe leak on ground floor', 'HIGH', 'NEW', NOW(6), 'manager@meridian.com', 3, NULL),
(5, 'HVAC Filter Replacement', 'Replace filters across warehouse zones', 'LOW', 'ON_HOLD', NOW(6), 'dispatcher@meridian.com', 3, 2),
(6, 'Lighting Upgrade', 'Replace fluorescent fixtures with LED', 'MEDIUM', 'COMPLETED', NOW(6), 'manager@meridian.com', 2, 4)
ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    description = VALUES(description),
    priority = VALUES(priority),
    status = VALUES(status),
    site_id = VALUES(site_id),
    technician_id = VALUES(technician_id);

-- ----------------------------------------------------------------------------
-- Seed Data: work_order_status_history
-- ----------------------------------------------------------------------------
INSERT INTO work_order_status_history (id, work_order_id, old_status, new_status, changed_by, changed_at) VALUES
(1, 1, NULL, 'NEW', 'admin@meridian.com', DATE_SUB(NOW(6), INTERVAL 10 DAY)),
(2, 1, 'NEW', 'ASSIGNED', 'dispatcher@meridian.com', DATE_SUB(NOW(6), INTERVAL 9 DAY)),
(3, 1, 'ASSIGNED', 'IN_PROGRESS', 'tech1@meridian.com', DATE_SUB(NOW(6), INTERVAL 8 DAY)),
(4, 1, 'IN_PROGRESS', 'COMPLETED', 'tech1@meridian.com', DATE_SUB(NOW(6), INTERVAL 7 DAY)),
(5, 1, 'COMPLETED', 'CLOSED', 'manager@meridian.com', DATE_SUB(NOW(6), INTERVAL 6 DAY)),
(6, 2, NULL, 'NEW', 'dispatcher@meridian.com', DATE_SUB(NOW(6), INTERVAL 5 DAY)),
(7, 2, 'NEW', 'ASSIGNED', 'dispatcher@meridian.com', DATE_SUB(NOW(6), INTERVAL 4 DAY)),
(8, 2, 'ASSIGNED', 'IN_PROGRESS', 'tech3@meridian.com', DATE_SUB(NOW(6), INTERVAL 3 DAY)),
(9, 3, NULL, 'NEW', 'dispatcher@meridian.com', DATE_SUB(NOW(6), INTERVAL 2 DAY)),
(10, 3, 'NEW', 'ASSIGNED', 'dispatcher@meridian.com', DATE_SUB(NOW(6), INTERVAL 1 DAY)),
(11, 4, NULL, 'NEW', 'manager@meridian.com', NOW(6)),
(12, 5, NULL, 'NEW', 'dispatcher@meridian.com', DATE_SUB(NOW(6), INTERVAL 4 DAY)),
(13, 5, 'NEW', 'ASSIGNED', 'dispatcher@meridian.com', DATE_SUB(NOW(6), INTERVAL 3 DAY)),
(14, 5, 'ASSIGNED', 'IN_PROGRESS', 'tech1@meridian.com', DATE_SUB(NOW(6), INTERVAL 2 DAY)),
(15, 5, 'IN_PROGRESS', 'ON_HOLD', 'tech1@meridian.com', DATE_SUB(NOW(6), INTERVAL 1 DAY)),
(16, 6, NULL, 'NEW', 'manager@meridian.com', DATE_SUB(NOW(6), INTERVAL 3 DAY)),
(17, 6, 'NEW', 'ASSIGNED', 'dispatcher@meridian.com', DATE_SUB(NOW(6), INTERVAL 2 DAY)),
(18, 6, 'ASSIGNED', 'IN_PROGRESS', 'tech3@meridian.com', DATE_SUB(NOW(6), INTERVAL 1 DAY)),
(19, 6, 'IN_PROGRESS', 'COMPLETED', 'tech3@meridian.com', NOW(6))
ON DUPLICATE KEY UPDATE
    old_status = VALUES(old_status),
    new_status = VALUES(new_status),
    changed_by = VALUES(changed_by),
    changed_at = VALUES(changed_at);

-- ----------------------------------------------------------------------------
-- Seed Data: work_order_parts
-- ----------------------------------------------------------------------------
INSERT INTO work_order_parts (id, work_order_id, part_name, part_number, quantity, unit_cost, notes, created_at, created_by) VALUES
(1, 1, 'AC Compressor Belt', 'HVAC-BLT-001', 2, 45.00, 'Replaced worn belts', DATE_SUB(NOW(6), INTERVAL 7 DAY), 'tech1@meridian.com'),
(2, 1, 'Refrigerant R410A', 'REF-410A-5LB', 1, 120.00, 'Top-up after repair', DATE_SUB(NOW(6), INTERVAL 7 DAY), 'tech1@meridian.com'),
(3, 2, 'Air Filter 20x25', 'FLT-2025-STD', 4, 18.50, 'Standard MERV-8 filters', DATE_SUB(NOW(6), INTERVAL 3 DAY), 'tech3@meridian.com'),
(4, 5, 'HVAC Filter 16x20', 'FLT-1620-HD', 6, 22.00, 'On hold pending approval', DATE_SUB(NOW(6), INTERVAL 2 DAY), 'tech1@meridian.com'),
(5, 6, 'LED Tube Light 4ft', 'LED-T4-40W', 12, 15.75, 'Warehouse zone B upgrade', DATE_SUB(NOW(6), INTERVAL 1 DAY), 'tech3@meridian.com')
ON DUPLICATE KEY UPDATE
    part_name = VALUES(part_name),
    part_number = VALUES(part_number),
    quantity = VALUES(quantity),
    unit_cost = VALUES(unit_cost),
    notes = VALUES(notes);

-- ----------------------------------------------------------------------------
-- Seed Data: time_logs
-- ----------------------------------------------------------------------------
INSERT INTO time_logs (id, work_order_id, technician_id, start_time, end_time, hours_logged, notes, created_at) VALUES
(1, 1, 2, DATE_SUB(NOW(6), INTERVAL 8 DAY), DATE_SUB(NOW(6), INTERVAL 8 DAY) + INTERVAL 3 HOUR, 3.00, 'Initial diagnosis and belt replacement', DATE_SUB(NOW(6), INTERVAL 8 DAY)),
(2, 1, 2, DATE_SUB(NOW(6), INTERVAL 7 DAY), DATE_SUB(NOW(6), INTERVAL 7 DAY) + INTERVAL 2 HOUR, 2.00, 'Refrigerant recharge and testing', DATE_SUB(NOW(6), INTERVAL 7 DAY)),
(3, 2, 4, DATE_SUB(NOW(6), INTERVAL 3 DAY), DATE_SUB(NOW(6), INTERVAL 3 DAY) + INTERVAL 4 HOUR, 4.00, 'Filter replacement across units', DATE_SUB(NOW(6), INTERVAL 3 DAY)),
(4, 5, 2, DATE_SUB(NOW(6), INTERVAL 2 DAY), DATE_SUB(NOW(6), INTERVAL 2 DAY) + INTERVAL 1.5 HOUR, 1.50, 'Partial filter install before hold', DATE_SUB(NOW(6), INTERVAL 2 DAY)),
(5, 6, 4, DATE_SUB(NOW(6), INTERVAL 1 DAY), DATE_SUB(NOW(6), INTERVAL 1 DAY) + INTERVAL 5 HOUR, 5.00, 'LED fixture installation', DATE_SUB(NOW(6), INTERVAL 1 DAY))
ON DUPLICATE KEY UPDATE
    start_time = VALUES(start_time),
    end_time = VALUES(end_time),
    hours_logged = VALUES(hours_logged),
    notes = VALUES(notes);

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
