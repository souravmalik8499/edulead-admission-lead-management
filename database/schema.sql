CREATE DATABASE IF NOT EXISTS edulead_db;

USE edulead_db;

-- =========================================
-- USERS TABLE
-- =========================================

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'COUNSELLOR', 'LEAD') NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- LEADS TABLE
-- =========================================

CREATE TABLE IF NOT EXISTS leads (
    id INT PRIMARY KEY AUTO_INCREMENT,

    user_id INT NOT NULL,

    course VARCHAR(150) NOT NULL,
    qualification VARCHAR(100),
    city VARCHAR(100),
    source VARCHAR(100),
    message TEXT,

    status ENUM(
        'NEW',
        'CONTACTED',
        'FOLLOW_UP',
        'CONVERTED',
        'LOST'
    ) DEFAULT 'NEW',

    assigned_counsellor_id INT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_lead_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_lead_counsellor
        FOREIGN KEY (assigned_counsellor_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);


-- =========================================
-- LEAD ACTIVITIES TABLE
-- =========================================

CREATE TABLE IF NOT EXISTS lead_activities (
    id INT PRIMARY KEY AUTO_INCREMENT,

    lead_id INT NOT NULL,

    counsellor_id INT NOT NULL,

    activity_type VARCHAR(50) NOT NULL,

    notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_activity_lead
        FOREIGN KEY (lead_id)
        REFERENCES leads(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_activity_counsellor
        FOREIGN KEY (counsellor_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- =========================================
-- INDEXES
-- =========================================

CREATE INDEX idx_leads_status
ON leads(status);

CREATE INDEX idx_leads_counsellor
ON leads(assigned_counsellor_id);

CREATE INDEX idx_leads_created_at
ON leads(created_at);

CREATE INDEX idx_activities_lead
ON lead_activities(lead_id);