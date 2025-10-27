# RFID Attendance

*Wireless ESP32 RFID Scanner for School Event Attendance*

This project implements a wireless RFID attendance system for school events using an ESP32 and RC522 RFID module. Each scan is logged directly to a MySQL/MariaDB database, with first-time scans prompting registration. The student council can manage events and view attendance through a simple UI.

---

## Features

- Wireless ESP32 hotspot for independent operation
- Reads RFID cards with RC522
- Logs attendance directly to MySQL/MariaDB
- First-time scan registration workflow
- Visual and audio feedback (LED/buzzer)
- Event-based attendance management
- Optional offline scan storage and sync

---

## Hardware

- ESP32 Development Board
- RC522 RFID Reader
- LED and Buzzer for feedback
- Optional: small OLED display

---

## Software / Libraries

- Arduino IDE or PlatformIO
- MFRC522 library for RFID
- WiFi.h for hotspot functionality
- MySQL_Connection & MySQL_Cursor libraries for SQL access
- EEPROM.h or SPIFFS.h for offline storage (optional)

---

## Database Schema

*students*
| student_id | rfid_id | name | grade/class |

*events*
| event_id | event_name | event_date | location | time_in_enabled | time_out_enabled |

*attendance_logs*
| log_id | student_id | event_id | scan_timestamp |

---

## Folder Structure

- **UI/**: Mobile app for event management and attendance viewing (React Native/Expo)
- **Arduino/**: ESP32 firmware code for RFID scanning
- **Database/**: MySQL schemas, scripts, and configurations
- **Hardware/**: Wiring diagrams and hardware setup notes
- **Documentation/**: MasterPlan and project documentation
- **Config/**: Configuration files and credentials

## Setup

### Hardware & Firmware
1. Connect ESP32 and RC522 as per Hardware/README.md wiring diagram.
2. Upload Arduino sketch from Arduino/ folder to ESP32.
3. Configure Wi-Fi hotspot on ESP32 as per Config/.

### Database
4. Create MySQL database and run Database/schema.sql using HeidiSQL.

### Mobile UI
5. Install dependencies: cd UI/ && npm install
6. Start the app: npm start
7. Connect to ESP32 hotspot for registration and scanning interactions.

### Testing
8. Run tests for individual components as described in MasterPlan.md in Documentation/.

---

## License

MIT License
