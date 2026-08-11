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
-- BCrypt password hash below corresponds to standard hashed passwords
-- ----------------------------------------------------------------------------
INSERT INTO users (id, email, full_name, password, role_id, phone, skills, status) VALUES
(1, 'deepak@gmail.com', 'Deepak Admin', '$2a$10$e8V9z4s3B1n0M7x8L9k0e.y6Z5W4V3U2T1S0R9P8O7N6M5L4K3J2I', 5, '9876543210', 'Management, System Administration', 'Active'),
(2, 'deepak123@gmail.com', 'Deepak Tech', '$2a$10$e8V9z4s3B1n0M7x8L9k0e.y6Z5W4V3U2T1S0R9P8O7N6M5L4K3J2I', 2, '9876543211', 'HVAC, AC Repair, Electrical', 'Available'),
(3, 'aruj@gmail.com', 'Aruj Technician', '$2a$10$e8V9z4s3B1n0M7x8L9k0e.y6Z5W4V3U2T1S0R9P8O7N6M5L4K3J2I', 2, '09159764093', 'Plumbing, General Maintenance', 'Off Duty'),
(4, 'bavan@gmail.com', 'Bavan Technician', '$2a$10$e8V9z4s3B1n0M7x8L9k0e.y6Z5W4V3U2T1S0R9P8O7N6M5L4K3J2I', 2, '8975634890', 'Electrical Systems, Inspection', 'Available')
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
(1, 'ABC Industries', 'abc@gmail.com', '9876543210', 'Anna Nagar', 'Chennai', 'Tamil Nadu', '600040', 'Active', NOW(6), 'system_admin'),
(2, 'Deepak K', 'k.deepak23102003@gmail.com', '9159764095', '18, Nagalamman Koil Street, Podhaturpet', 'Thirutani', 'Tamil Nadu', '631208', 'Active', NOW(6), 'system_admin')
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
(1, 'Chennai Head Office', 'T Nagar', 'Chennai', 'Tamil Nadu', '600040', 'Active', NOW(6), 'system_admin', 1),
(2, 'Thirutani Facility', 'Main Road', 'Thirutani', 'Tamil Nadu', '631208', 'Active', NOW(6), 'system_admin', 2)
ON DUPLICATE KEY UPDATE
    site_name = VALUES(site_name),
    address = VALUES(address),
    city = VALUES(city),
    state = VALUES(state),
    pincode = VALUES(pincode),
    status = VALUES(status),
    customer_id = VALUES(customer_id);

-- ----------------------------------------------------------------------------
-- Seed Data: work_orders
-- ----------------------------------------------------------------------------
INSERT INTO work_orders (id, title, description, priority, status, created_at, created_by, site_id, technician_id) VALUES
(1, 'AC Repair Service', 'Repair main office air conditioning unit', 'HIGH', 'COMPLETED', NOW(6), 'system_admin', 1, 2),
(2, 'Routine AC Maintenance', 'Routine air conditioner inspection and filter replacement', 'MEDIUM', 'IN_PROGRESS', NOW(6), 'system_admin', 2, 4)
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
(1, 1, 'OPEN', 'COMPLETED', 'Deepak Admin', NOW(6))
ON DUPLICATE KEY UPDATE
    old_status = VALUES(old_status),
    new_status = VALUES(new_status),
    changed_by = VALUES(changed_by),
    changed_at = VALUES(changed_at);

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
