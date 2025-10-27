# Database

This folder contains database schemas, scripts, and configurations for the RFID attendance system.

## Technologies
- MySQL/MariaDB
- HeidiSQL for management

## Tables
- students: student_id, rfid_id, name, grade
- events: event_id, event_name, event_date
- attendance_logs: log_id, student_id, event_id, scan_timestamp

## Setup
- Create database in MySQL.
- Run schema.sql to create tables.
