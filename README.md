# RFID Attendance

*Wireless ESP32 RFID Scanner for School Event Attendance with FastAPI Backend*

This project implements a wireless RFID attendance system for school events using an ESP32 and RC522 RFID module. Scans are sent to a FastAPI backend server that manages the SQLite database, with first-time scans prompting registration through the UI. The student council can manage events and view attendance through a mobile app.

---

## Features

- Wireless ESP32 hotspot for independent operation
- Reads RFID cards with RC522
- Sends scan data via HTTP to FastAPI backend (SQLite database)
- First-time scan registration workflow via UI
- Visual and audio feedback (LED/buzzer)
- Event-based attendance management
- Optional offline scan storage and sync

---

## Hardware

- ESP32 Development Board
- RC522 RFID Reader
- LED and Buzzer for feedback
- Server device (Raspberry Pi or computer) for FastAPI backend
- Optional: small OLED display

---

## Software / Libraries

### ESP32 Firmware
- Arduino IDE or PlatformIO
- MFRC522 library for RFID reading
- WiFi.h for hotspot functionality
- HTTPClient.h for API requests to FastAPI
- EEPROM.h or SPIFFS.h for offline storage (optional)

### Backend
- Python 3.x
- FastAPI for REST API
- Uvicorn for server
- SQLite3 for database
- SQLAlchemy or Peewee for ORM (optional)

### UI
- React Native / Expo for mobile app

---

## Database Schema

*students*
| student_id | rfid_id | name | grade |

*events*
| event_id | event_name | event_date |

*attendance_logs*
| log_id | student_id | event_id | scan_timestamp |

*Note:* All tables use SQLite-specific syntax. See Database/schema.sql for full schema.

---

## Folder Structure

- **UI/**: Mobile app for event management and attendance viewing (React Native/Expo)
- **Arduino/**: ESP32 firmware code for RFID scanning
- **Backend/**: FastAPI server code (Python)
- **Database/**: SQLite schemas and initialization scripts
- **Hardware/**: Wiring diagrams and hardware setup notes
- **Documentation/**: MasterPlan and project documentation
- **Config/**: Configuration files and credentials

## Setup

### Hardware & Firmware
1. Connect ESP32 and RC522 as per Hardware/README.md wiring diagram.
2. Upload Arduino sketch from Arduino/ folder to ESP32 (update with API integration).
3. Configure Wi-Fi hotspot on ESP32 as per Config/.

### Backend Setup
4. On the server device (e.g., Raspberry Pi), set up Python virtual environment.
5. Install dependencies: pip install fastapi uvicorn sqlmodel sqlite3  # or preferred ORM
6. Run Database/schema.sql to initialize SQLite database (see Backend/ for code to run it).
7. Start FastAPI server: uvicorn main:app --host 0.0.0.0 --port 8000  (replace main:app with your app instance)

### Mobile UI
8. Install dependencies: cd UI/ && npm install
9. Start the app: npm start
10. Connect to ESP32 hotspot to access FastAPI server for registration and viewing attendance.

### Testing
11. Run tests for individual components as described in MasterPlan.md in Documentation/.

---

## License

MIT License
