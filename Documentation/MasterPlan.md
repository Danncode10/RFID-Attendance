## *App Master Plan: ESP32 Wireless RFID Firmware for Event Attendance* Test

*Objective:*
We are building a *wireless ESP32 device with RC522 RFID scanner* to track attendance for school events.

* Each scan is linked to a *specific event* created/managed by the Student Council.
* First-time scans trigger a *UI prompt to register the student*.
* The device creates its *own Wi-Fi hotspot*, and sends scanned data *directly to a SQL database*.
* Visual/audio feedback confirms successful scans or new registrations.
* Optional: store scans temporarily if Wi-Fi is down (for reliability).

---

## *Technologies and Components*

*Hardware:*

* ESP32 development board (Wi-Fi enabled)
* RC522 RFID module
* LEDs and/or buzzer for feedback

*Software / Libraries (Arduino / C++):*

* MFRC522 library for RFID reading
* WiFi.h (ESP32 Wi-Fi hotspot functionality)
* MySQL_Connection / MySQL_Cursor library for direct SQL access from ESP32
* Optional: EEPROM.h or SPIFFS.h for temporary offline storage

*Database:*

* MySQL / MariaDB managed via HeidiSQL
* Tables: students, events, attendance_logs



---

## *Step-by-Step Implementation Plan – Detailed*

---

### *Step 1: Hardware Setup*

*Goal:* Prepare the ESP32 and RC522 module for scanning RFID tags and provide feedback.

*Tasks & Details:*

1. *Connect RC522 to ESP32 (SPI interface):*

   * RC522 pins: SDA, SCK, MOSI, MISO, RST
   * ESP32 pins: choose SPI-compatible pins (e.g., SDA = 21, SCK = 18, MOSI = 23, MISO = 19, RST = 22)
   * Ensure wiring is secure to prevent read errors.

2. *Connect LEDs and buzzer for feedback:*

   * Green LED: successful scan
   * Red LED: new registration needed
   * Buzzer: optional sound feedback

3. *Test basic power & connectivity:*

   * Power ESP32 via USB or battery module
   * Run a *simple RC522 example sketch* to verify UID reading

*Why it matters:*

* Correct wiring is critical for accurate RFID reading.
* Feedback devices improve usability for students and council members.

---

### *Step 2: ESP32 Hotspot Setup*

*Goal:* Make the ESP32 act as a Wi-Fi hotspot so the student council app or device can connect to it directly.

*Tasks & Details:*

1. Use the WiFi.h library to configure an *access point (AP mode)*:

   
   WiFi.softAP("EventScanner_01", "password123");
   IPAddress IP = WiFi.softAPIP();
   Serial.print("AP IP address: ");
   Serial.println(IP);
   
2. Set SSID and password for security.
3. Test the hotspot using a mobile device or laptop to ensure it is visible and connectable.

*Why it matters:*

* Hotspot ensures wireless communication *without relying on school Wi-Fi*.
* Students or council members can scan and register offline from the network created by ESP32.

---

### *Step 3: RFID Reading Logic*

*Goal:* Detect and read RFID cards, determine if they are new, and prepare data for the database.

*Tasks & Details:*

1. Initialize the RC522 module with the MFRC522 library.
2. Read the UID of each scanned RFID card.
3. Convert UID to a readable string format for SQL storage.
4. Check the database for existing student ID:

   * If *exists*, prepare to log attendance.
   * If *new*, trigger registration prompt (LED/buzzer or app interface).

*Sample pseudo-flow:*

Scan RFID -> Read UID -> Convert UID -> Query students table
   -> If exists: log attendance
   -> Else: prompt for registration

*Why it matters:*

* Ensures first-time scans register students properly.
* Avoids duplicate entries in the database.

---

### *Step 4: SQL Database Connection*

*Goal:* Connect ESP32 directly to the MySQL/MariaDB database and perform queries.

*Tasks & Details:*

1. Include MySQL library for ESP32: MySQL_Connection & MySQL_Cursor.
2. Store *database credentials securely* in ESP32 code: host IP, port, username, password, database name.
3. On scan:

   * Check if student exists:

     
     SELECT student_id FROM students WHERE rfid_id = 'UID';
     
   * If new:

     
     INSERT INTO students(rfid_id, name, grade) VALUES('UID', '', '');
     
   * Log attendance:

     
     INSERT INTO attendance_logs(student_id, event_id, scan_timestamp) VALUES(..., ..., NOW());
     
4. Handle SQL connection errors gracefully (retry logic or feedback LED).

*Why it matters:*

* Direct SQL ensures *real-time attendance logging*.
* Proper error handling prevents data loss or duplication.

---

### *Step 5: UI / Registration Prompt*

*Goal:* Prompt student council members to register new RFID IDs on first scan.

*Tasks & Details:*

1. *LED/Buzzer feedback:*

   * Flash red LED + buzzer beep if first-time scan detected.
2. *Mobile app interaction (optional):*

   * Connect app to ESP32 hotspot
   * Show “New ID detected. Register?” prompt
   * Input name/grade/class, send SQL insert query via ESP32 hotspot

*Why it matters:*

* Makes first-time registration *user-friendly and controlled*.
* Prevents unregistered IDs from being used without council approval.

---

### *Step 6: Feedback Mechanism*

*Goal:* Provide real-time feedback to ensure smooth scanning.

*Tasks & Details:*

1. Green LED for successful scan
2. Red LED for first-time registration
3. Optional buzzer: different tones for success/failure
4. Can also display info on a small OLED screen (student name, event name)

*Why it matters:*

* Instant feedback reduces errors and confusion during events.

---

### *Step 7: Offline Handling (Optional but Recommended)*

*Goal:* Ensure scanning works even if Wi-Fi/database connection fails.

*Tasks & Details:*

1. Use *EEPROM or SPIFFS* to store temporary scans: UID + timestamp + event\_id
2. Once Wi-Fi is restored, *batch upload scans* to SQL database
3. Mark synced entries as completed to avoid duplicates

*Why it matters:*

* Avoids lost attendance records during network issues.
* Increases reliability for large school events.

---

### *Step 8: Testing & Debugging*

*Goal:* Validate the system for real-world use.

*Tasks & Details:*

1. Test *individual RFID scans* with known IDs
2. Test *first-time registration workflow*
3. Verify *attendance logging* to SQL database
4. Test *event-specific logging* (multiple events)
5. Test *LED/buzzer feedback*
6. Simulate *offline/online scenario* if implementing offline mode

*Why it matters:*

* Ensures robustness and usability.
* Identifies edge cases before deployment.

---

✅ *Result:* After completing these steps, the ESP32 RFID scanner will be fully functional for wireless event attendance, first-time registration, and direct SQL logging, with user-friendly feedback for the student council.