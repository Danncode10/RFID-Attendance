-- SQLite schema for RFID Attendance

-- Students table
CREATE TABLE IF NOT EXISTS students (
    student_id INTEGER PRIMARY KEY AUTOINCREMENT,
    rfid_id TEXT UNIQUE NOT NULL,
    name TEXT,
    grade TEXT
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
    event_id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_name TEXT NOT NULL,
    event_date TEXT NOT NULL  -- Store as ISO date string (YYYY-MM-DD HH:MM:SS)
);

-- Attendance logs table
CREATE TABLE IF NOT EXISTS attendance_logs (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    event_id INTEGER,
    scan_timestamp TEXT DEFAULT CURRENT_TIMESTAMP,  -- Store as ISO datetime string
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id)
);
