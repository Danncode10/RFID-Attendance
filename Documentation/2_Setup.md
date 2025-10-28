# Setup Guide

This guide walks through setting up the RFID Attendance System components.

## Hardware & Firmware Setup

### ESP32 and RC522 Wiring

1. **Connect RC522 to ESP32 (SPI interface):**

   - RC522 pins: SDA, SCK, MOSI, MISO, RST
   - ESP32 pins: choose SPI-compatible pins (e.g., SDA = 21, SCK = 18, MOSI = 23, MISO = 19, RST = 22)
   - Ensure wiring is secure to prevent read errors.

2. **Connect LEDs and buzzer for feedback:**

   - Green LED: successful scan
   - Red LED: new registration needed
   - Buzzer: optional sound feedback

3. **Power and Test:**

   - Power ESP32 via USB or battery module
   - Run a simple RC522 example sketch to verify UID reading

### ESP32 Firmware

- Upload Arduino sketch from Arduino/ folder to ESP32 (update with API integration).
- Configure Wi-Fi hotspot on ESP32 as per Config/.

## Backend Setup

1. On the server device (e.g., Raspberry Pi), set up Python virtual environment.
2. Install dependencies: `pip install fastapi uvicorn sqlmodel sqlite3` (or preferred ORM)
3. Run Database/schema.sql to initialize SQLite database (see Backend/ for code to run it).
4. Start FastAPI server: `uvicorn main:app --host 0.0.0.0 --port 8000` (replace main:app with your app instance)

## Mobile UI Setup

1. Install dependencies: `cd UI/ && npm install`
2. Start the app: `npm start`
3. Connect to ESP32 hotspot to access FastAPI server for registration and viewing attendance.

## Configuration

- See Config/ directory for configuration files and credentials.
- Set SSID and password for ESP32 hotspot security.
