# Database

This folder contains database schemas, scripts, and configurations for the RFID attendance system.

## Technologies
- SQLite

## Tables
- students: student_id, rfid_id, name, grade
- events: event_id, event_name, event_date
- attendance_logs: log_id, student_id, event_id, scan_timestamp

## Setup
- SQLite database is file-based. No separate creation step needed.
- Run schema.sql (or initialize via FastAPI code) to create tables in the SQLite file (e.g., rfid_attendance.db).
