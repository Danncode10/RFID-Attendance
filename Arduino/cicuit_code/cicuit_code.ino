#include <SPI.h>
#include <MFRC522.h>

// Edi wow

// RC522 pins
#define SS_PIN 22   // SDA (SS)
#define RST_PIN 21  // RST

// Active buzzer pin
#define BUZZER_PIN 14   

MFRC522 rfid(SS_PIN, RST_PIN);  // RFID object

// ✅ List of authorized card UIDs (you can add more)
byte validUids[][4] = {
  {0x56, 0xEE, 0xC2, 0xB8},  // Example UID #1
  {0xD5, 0x13, 0xF4, 0x5E}   // Example UID #2
};
int validUidCount = 2;

// Function to compare card UID with stored valid UIDs
bool isCardValid(MFRC522::Uid uid) {
  for (int i = 0; i < validUidCount; i++) {
    bool match = true;
    for (byte j = 0; j < uid.size; j++) {
      if (uid.uidByte[j] != validUids[i][j]) {
        match = false;
        break;
      }
    }
    if (match) return true;
  }
  return false;
}

// Function to beep active buzzer
void beepBuzzer(int duration) {
  digitalWrite(BUZZER_PIN, HIGH); // ON
  delay(duration);
  digitalWrite(BUZZER_PIN, LOW);  // OFF
}

void setup() {
  Serial.begin(115200);

  // Initialize SPI with ESP32 hardware pins
  SPI.begin(18, 19, 23, 22);  // SCK=18, MISO=19, MOSI=23, SS=22
  rfid.PCD_Init();     
  Serial.println("RFID system ready. Scan your card...");

  // Buzzer setup
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, HIGH);
}

void loop() {
  if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
    Serial.print("Card detected! UID: ");
    for (byte i = 0; i < rfid.uid.size; i++) {
      Serial.print(rfid.uid.uidByte[i], HEX);
      Serial.print(" ");
    }
    Serial.println();

    // ✅ Check if card is valid
    if (isCardValid(rfid.uid)) {
      Serial.println("✅ ACCESS GRANTED");
      // Beep pattern for granted access
      beepBuzzer(100);
      delay(100);
      beepBuzzer(200);
    } else {
      Serial.println("🚫 ACCESS DENIED");
      // Different beep pattern for denied access
      beepBuzzer(500);
      delay(200);
      beepBuzzer(500);
    }

    rfid.PICC_HaltA();
    delay(1000); // Small delay before next read
    digitalWrite(BUZZER_PIN, HIGH);
  }
}
