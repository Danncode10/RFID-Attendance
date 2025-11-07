import React, { useState, useEffect, useRef } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles";



export default function RegisterScreen({ navigation, route }) {
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [uid, setUid] = useState("");
  const [courseYear, setCourseYear] = useState("");
  const [students, setStudents] = useState([]);

  // ✅ Load saved students on app start
  useEffect(() => {
    const loadStudents = async () => {
      try {
        const saved = await AsyncStorage.getItem("students");
        if (saved) setStudents(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading students", error);
      }
    };
    loadStudents();
  }, []);

  // ✅ Reload list when returning from ViewStudentsScreen (after delete)
  useEffect(() => {
    if (route.params?.updatedStudents) {
      setStudents(route.params.updatedStudents);
      saveStudents(route.params.updatedStudents);
    }
  }, [route.params?.updatedStudents]);

  // WebSocket connection for RFID UID
  useEffect(() => {
    const ws = new WebSocket('ws://13.214.102.163:8000/ws');

    ws.onopen = () => console.log('✅ WebSocket Connected');

    ws.onmessage = (event) => {
      console.log('📡 Received UID:', event.data);
      setUid(event.data); // ✅ This updates your input box automatically
    };

    ws.onerror = (err) => console.error('❌ WebSocket Error:', err);
    ws.onclose = () => console.log('🔌 WebSocket Closed');

    return () => {
      ws.close();
    };
  }, []);

  // ✅ Save students permanently
  const saveStudents = async (list) => {
    try {
      await AsyncStorage.setItem("students", JSON.stringify(list));
    } catch (error) {
      console.error("Error saving students", error);
    }
  };

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

    const trimmedStudentId = studentId.trim();

    // Check if ID already exists
    const exists = students.some(s => s.studentId === trimmedStudentId);
    if (exists) {
      Alert.alert("Cannot register because this ID is already registered.");
      return;
    }

    // Check if UID already exists
    const uidExists = students.some(s => s.uid === uid.trim().toUpperCase());
    if (uidExists) {
      Alert.alert("Cannot register because this UID is already registered.");
      return;
    }

    const newStudent = {
      id: Date.now().toString(),
      studentId: trimmedStudentId,
      name: name.trim(),
      uid: uid.trim().toUpperCase(),
      courseYear,
    };

    const updatedList = [...students, newStudent];
    setStudents(updatedList);
    await saveStudents(updatedList);

    Alert.alert("✅ Success", "Student registered successfully!");
    setStudentId("");
    setName("");
    setUid("");
    setCourseYear("");
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
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.input}
              placeholder="RFID UID (e.g. 56EEC2B8)"
              value={uid}               // <-- controlled by state
              onChangeText={setUid}     // <-- user can still edit manually
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
              onPress={() => navigation.navigate("ViewStudents", { students })}
            >
              <Text style={styles.buttonText}>View Registered Students</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
