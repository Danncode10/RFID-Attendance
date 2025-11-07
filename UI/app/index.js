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
import { router } from 'expo-router';
import styles from "./styles";

const API_BASE_URL = "http://13.214.102.163:8000"; // Replace with your backend URL

export default function RegisterScreen() {
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [uid, setUid] = useState("");
  const [courseYear, setCourseYear] = useState("");

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
          student_id: studentId.trim(),
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
            <TextInput
              style={styles.input}
              placeholder="Course and Section (e.g. BSCS 3B)"
              value={courseYear}
              onChangeText={setCourseYear}
              autoCapitalize="characters"
              placeholderTextColor="#999"
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
