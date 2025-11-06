import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Alert,
} from "react-native";
import RNPickerSelect from 'react-native-picker-select';
import { router } from 'expo-router';
import styles from "./styles";

const API_BASE_URL = "http://13.214.102.163:8000"; // Replace with your backend URL

const courses = ["BSCS", "BSIT", "BSIS"];

const courseYearOptions = {
  BSCS: ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B'],
  BSIT: ['1A', '1B', '1C', '2A', '2B', '2C', '3A', '3B', '3C', '4A', '4B', '4C'],
  BSIS: ['1A', '2A', '3A', '4A']
};

export default function RegisterScreen() {
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [uid, setUid] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [courseYear, setCourseYear] = useState("");

  // ✅ Build courseYear when course and section changes
  useEffect(() => {
    if (selectedCourse && selectedSection) {
      setCourseYear(`${selectedCourse} ${selectedSection}`);
    } else {
      setCourseYear("");
    }
  }, [selectedCourse, selectedSection]);

  // ✅ Validation
  const validateInputs = () => {
    if (!studentId || !name.trim() || !uid.trim() || !courseYear.trim()) {
      Alert.alert("Please fill the registration form.");
      return false;
    }

    const idPattern = /^\d{3}-\d{4}$/;
    const uidPattern = /^[A-Fa-f0-9]{8}$/; // 8-character hex UID

    if (!idPattern.test(studentId)) {
      Alert.alert("Invalid ID format", "Example: 123-4567");
      return false;
    }

    if (!uidPattern.test(uid.trim())) {
      Alert.alert("Invalid UID format", "UID should be 8 hexadecimal characters (e.g. 56EEC2B8)");
      return false;
    }
    return true;
  };

  // ✅ Register student
  const handleRegister = async () => {
    if (!validateInputs()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rfid_id: uid.trim().toUpperCase(),
          name: name.trim(),
          course_year: courseYear,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("✅ Success", "Student registered successfully!");
        setStudentId("");
        setName("");
        setUid("");
        setSelectedCourse("");
        setSelectedSection("");
        setCourseYear("");
      } else {
        Alert.alert("Registration Failed", data.detail || "An error occurred.");
      }
    } catch (error) {
      console.error("Error registering student:", error);
      Alert.alert("Error", "Could not connect to the server.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container, { padding: 0 }]}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20 }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            <Text style={styles.title}>📘 Student Registration</Text>

            <TextInput
              style={styles.input}
              placeholder="Student ID (e.g. 231-1234)"
              value={studentId}
              onChangeText={setStudentId}
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.input}
              placeholder="Full Names"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.input}
              placeholder="RFID UID (e.g. 56EEC2B8)"
              value={uid}
              onChangeText={setUid}
              autoCapitalize="characters"
              placeholderTextColor="#999"
            />
            <RNPickerSelect
              value={selectedCourse}
              onValueChange={(value) => { setSelectedCourse(value); setSelectedSection(""); }}
              items={courses.map((course) => ({ label: course, value: course }))}
              placeholder={{ label: 'Select Course', value: null }}
              style={{
                placeholder: styles.input,
                inputIOS: styles.input,
                inputAndroid: styles.input,
              }}
            />
            <RNPickerSelect
              value={selectedSection}
              onValueChange={(value) => setSelectedSection(value)}
              items={selectedCourse ? courseYearOptions[selectedCourse].map((section) => ({ label: section, value: section })) : []}
              placeholder={{ label: 'Select Section', value: null }}
              style={{
                placeholder: styles.input,
                inputIOS: styles.input,
                inputAndroid: styles.input,
              }}
              disabled={!selectedCourse}
            />

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#2196F3", marginTop: 10 }]}
              onPress={() => router.push('/view-students')}
            >
              <Text style={styles.buttonText}>View Registered Students</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
