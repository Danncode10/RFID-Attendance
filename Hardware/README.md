# Hardware Setup

This folder contains diagrams, schematics, and instructions for the ESP32 and RC522 hardware setup.

## Components
- ESP32 development board (Wi-Fi enabled)
- RC522 RFID module (SPI interface)
- LEDs (Green for success, Red for new registration)
- Buzzer for audio feedback (optional)

## Wiring Diagram
- RC522 to ESP32 (SPI):
  - SDA (RC522) -> GPIO 21 (ESP32)
  - SCK -> GPIO 18
  - MOSI -> GPIO 23
  - MISO -> GPIO 19
  - RST -> GPIO 22
- LEDs and Buzzer: Connect to appropriate GPIO pins on ESP32 (e.g., GPIO 12 for Green LED, GPIO 13 for Red LED, GPIO 14 for Buzzer)

## Power
- Power ESP32 via USB or battery module.
- Ensure stable power for RFID reading accuracy.

## Testing
- Verify connections with RC522 example sketch.
- Test LED/buzzer feedback.
