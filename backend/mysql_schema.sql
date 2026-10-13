-- LifeLink Sri Lanka - Complete MySQL 8 Database Schema
-- Ready for execution in MySQL Workbench

CREATE DATABASE IF NOT EXISTS `lifelink_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `lifelink_db`;

-- 1. Provinces
CREATE TABLE IF NOT EXISTS `provinces` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `name_si` VARCHAR(100) NULL,
  `name_ta` VARCHAR(100) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Districts
CREATE TABLE IF NOT EXISTS `districts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `province_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `center_lat` DECIMAL(9,6) DEFAULT 9.6615,
  `center_lng` DECIMAL(9,6) DEFAULT 80.0255,
  FOREIGN KEY (`province_id`) REFERENCES `provinces`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Verified Hospitals
CREATE TABLE IF NOT EXISTS `hospitals` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `district_id` INT NOT NULL,
  `name` VARCHAR(200) NOT NULL UNIQUE,
  `hospital_type` VARCHAR(100) DEFAULT 'Teaching Hospital',
  `address` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `emergency_hotline` VARCHAR(30) NULL,
  `lat` DECIMAL(9,6) NOT NULL,
  `lng` DECIMAL(9,6) NOT NULL,
  `is_verified` BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (`district_id`) REFERENCES `districts`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Users
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(50) PRIMARY KEY,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `phone` VARCHAR(30) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'donor', 'requester') NOT NULL DEFAULT 'donor',
  `district_id` INT NULL,
  `city` VARCHAR(150) NOT NULL,
  `address` VARCHAR(255) NULL,
  `avatar_url` VARCHAR(500) NULL,
  `is_verified` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`district_id`) REFERENCES `districts`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Donor Profiles
CREATE TABLE IF NOT EXISTS `donor_profiles` (
  `id` VARCHAR(50) PRIMARY KEY,
  `user_id` VARCHAR(50) NOT NULL UNIQUE,
  `blood_group` ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
  `gender` VARCHAR(20) NULL,
  `date_of_birth` DATE NULL,
  `is_available` BOOLEAN DEFAULT TRUE,
  `preferred_locations` JSON NULL,
  `last_donation_date` DATE NULL,
  `total_donations` INT DEFAULT 0,
  `lives_helped` INT DEFAULT 0,
  `community_points` INT DEFAULT 20,
  `consent_given` BOOLEAN DEFAULT TRUE,
  `is_verified` BOOLEAN DEFAULT TRUE,
  `is_suspended` BOOLEAN DEFAULT FALSE,
  `approx_lat` DECIMAL(9,6) DEFAULT 9.6615,
  `approx_lng` DECIMAL(9,6) DEFAULT 80.0255,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Emergency Blood Requests
CREATE TABLE IF NOT EXISTS `blood_requests` (
  `id` VARCHAR(50) PRIMARY KEY,
  `requester_id` VARCHAR(50) NOT NULL,
  `requester_name` VARCHAR(150) NOT NULL,
  `requester_phone` VARCHAR(30) NOT NULL,
  `patient_name` VARCHAR(150) NOT NULL,
  `patient_age` INT NOT NULL,
  `blood_group` ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
  `units_needed` INT NOT NULL DEFAULT 1,
  `hospital_name` VARCHAR(200) NOT NULL,
  `district_id` INT NOT NULL,
  `hospital_location` VARCHAR(255) NOT NULL,
  `required_date` DATE NOT NULL,
  `urgency` ENUM('normal', 'urgent', 'emergency') DEFAULT 'urgent',
  `additional_notes` TEXT NULL,
  `status` ENUM('Pending Verification', 'Verified', 'Active', 'Donor Responded', 'Fulfilled', 'Cancelled', 'Expired') DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `verified_at` TIMESTAMP NULL,
  `fulfilled_at` TIMESTAMP NULL,
  FOREIGN KEY (`district_id`) REFERENCES `districts`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Contact Messages
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` VARCHAR(50) PRIMARY KEY,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(30) NULL,
  `subject` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `is_read` BOOLEAN DEFAULT FALSE,
  `status` ENUM('new', 'in_progress', 'resolved') DEFAULT 'new',
  `reply_notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Campaigns
CREATE TABLE IF NOT EXISTS `blood_campaigns` (
  `id` VARCHAR(50) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `organizer` VARCHAR(255) NOT NULL,
  `venue` VARCHAR(255) NOT NULL,
  `district_id` INT NOT NULL,
  `city` VARCHAR(150) NOT NULL,
  `date` DATE NOT NULL,
  `start_time` VARCHAR(20) NOT NULL,
  `end_time` VARCHAR(20) NOT NULL,
  `description` TEXT NOT NULL,
  `target_units` INT DEFAULT 100,
  `registered_count` INT DEFAULT 0,
  `contact_number` VARCHAR(30) NOT NULL,
  `is_published` BOOLEAN DEFAULT TRUE,
  `image_url` VARCHAR(500) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`district_id`) REFERENCES `districts`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Audit Logs
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` VARCHAR(50) PRIMARY KEY,
  `actor_email` VARCHAR(150) NOT NULL,
  `actor_role` VARCHAR(50) NOT NULL,
  `action` VARCHAR(100) NOT NULL,
  `target_resource` VARCHAR(100) NOT NULL,
  `details` TEXT NOT NULL,
  `ip_address` VARCHAR(45) NULL,
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
