-- ============================================================================
-- Field Service Management Platform (Project KEYSTONE)
-- Database Schema Script
-- Target Database Engine: MySQL 8.0+
-- Database Name: field_service_management
-- ============================================================================

CREATE DATABASE IF NOT EXISTS field_service_management;
USE field_service_management;

-- Disable foreign key checks for safe schema initialization
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- Table: roles
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_roles_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- Table: users
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(255) DEFAULT NULL,
    skills VARCHAR(1000) DEFAULT NULL,
    status VARCHAR(255) NOT NULL DEFAULT 'Active',
    role_id BIGINT DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_email (email),
    KEY idx_users_role_id (role_id),
    CONSTRAINT fk_users_roles FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- Table: customers
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS customers (
    id BIGINT NOT NULL AUTO_INCREMENT,
    customer_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    pincode VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL DEFAULT 'Active',
    created_at DATETIME(6) NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_customers_email (email),
    UNIQUE KEY uk_customers_phone (phone),
    KEY idx_customers_city (city),
    KEY idx_customers_state (state),
    KEY idx_customers_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- Table: sites
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sites (
    id BIGINT NOT NULL AUTO_INCREMENT,
    site_name VARCHAR(255) DEFAULT NULL,
    address VARCHAR(255) DEFAULT NULL,
    city VARCHAR(255) DEFAULT NULL,
    state VARCHAR(255) DEFAULT NULL,
    pincode VARCHAR(255) DEFAULT NULL,
    status VARCHAR(255) DEFAULT 'Active',
    created_at DATETIME(6) DEFAULT NULL,
    created_by VARCHAR(255) DEFAULT NULL,
    customer_id BIGINT DEFAULT NULL,
    PRIMARY KEY (id),
    KEY idx_sites_customer_id (customer_id),
    CONSTRAINT fk_sites_customers FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- Table: work_orders
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS work_orders (
    id BIGINT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) DEFAULT NULL,
    description VARCHAR(255) DEFAULT NULL,
    priority VARCHAR(255) DEFAULT NULL,
    status VARCHAR(255) DEFAULT NULL,
    created_at DATETIME(6) DEFAULT NULL,
    created_by VARCHAR(255) DEFAULT NULL,
    site_id BIGINT DEFAULT NULL,
    technician_id BIGINT DEFAULT NULL,
    PRIMARY KEY (id),
    KEY idx_work_orders_site_id (site_id),
    KEY idx_work_orders_technician_id (technician_id),
    KEY idx_work_orders_status (status),
    CONSTRAINT fk_work_orders_sites FOREIGN KEY (site_id) REFERENCES sites (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_work_orders_technicians FOREIGN KEY (technician_id) REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- Table: work_order_status_history
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS work_order_status_history (
    id BIGINT NOT NULL AUTO_INCREMENT,
    work_order_id BIGINT DEFAULT NULL,
    old_status VARCHAR(255) DEFAULT NULL,
    new_status VARCHAR(255) DEFAULT NULL,
    changed_by VARCHAR(255) DEFAULT NULL,
    changed_at DATETIME(6) DEFAULT NULL,
    PRIMARY KEY (id),
    KEY idx_status_history_work_order_id (work_order_id),
    CONSTRAINT fk_status_history_work_orders FOREIGN KEY (work_order_id) REFERENCES work_orders (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
