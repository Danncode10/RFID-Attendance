CREATE DATABASE rfid_attendance IF NOT EXISTS;

USE rfid_attendance;

-- Students table
CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    rfid_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100),
    grade VARCHAR(20)
);

-- Events table
CREATE TABLE events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(100) NOT NULL,
    event_date DATETIME NOT NULL
);

-- Attendance logs table
CREATE TABLE attendance_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    event_id INT,
    scan_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id)
);
