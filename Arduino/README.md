# Arduino Firmware

This folder contains the ESP32 firmware for the RFID attendance scanner.

## Files
- Place Arduino (.ino) sketches here for ESP32 platform.
- Use MFRC522 library for RFID reading.
- Implement Wi-Fi hotspot, API communication to FastAPI, feedback mechanisms as per MasterPlan.

## Getting Started
- Open Arduino IDE, select ESP32 board.
- Install necessary libraries: MFRC522, WiFi, HTTPClient, etc.
- Upload code to ESP32 with connected RC522 module.
- Ensure IP address of FastAPI server is configured for HTTP requests.
