import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import styles from "./styles";

export default function RegisterScreen() {
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
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

  // ✅ No route params in this setup
  // Effects removed simplified

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
    if (!studentId || !name.trim() || !courseYear.trim()) {
      Alert.alert("Please fill the registration form.");
      return false;
    }

    const idPattern = /^\d{3}-\d{4}$/;
    const courseYearPattern = /^[A-Z]{2,4}\s\d{1,2}[A-Z]$/;

    if (!idPattern.test(studentId)) {
      Alert.alert("Invalid ID format", "Example: 231-1234");
      return false;
    }
    if (!courseYearPattern.test(courseYear)) {
      Alert.alert("Invalid Course & Year", "Example: BSCS 3B");
      return false;
    }
    return true;
  };

  // ✅ Register student
  const handleRegister = async () => {
    if (!validateInputs()) return;

    // allow re-registering deleted students (no permanent restriction)
    const exists = students.some(
      (s) =>
        s.studentId === studentId &&
        s.name.trim().toLowerCase() === name.trim().toLowerCase()
    );
    if (exists) {
      Alert.alert("Already Registered", "This student already exists.");
      return;
    }

    const newStudent = {
      id: Date.now().toString(),
      studentId,
      name,
      courseYear,
    };

    const updatedList = [...students, newStudent];
    setStudents(updatedList);
    await saveStudents(updatedList);

    Alert.alert("✅ Success", "Student registered successfully!");
    setStudentId("");
    setName("");
    setCourseYear("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Ionicons name="person-outline" size={28} color="#4CAF50" />
        <Text style={styles.titleText}>Student Registration</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Student ID (e.g. 231-1234)"
        value={studentId}
        onChangeText={setStudentId}
      />
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Course & Year (e.g. BSCS 3B)"
        value={courseYear}
        onChangeText={setCourseYear}
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

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#FF9800", marginTop: 10 }]}
        onPress={() => router.push('/events')}
      >
        <View style={styles.buttonContent}>
          <Ionicons name="calendar-outline" size={20} color="#fff" />
          <Text style={styles.buttonTextWithIcon}>Manage Events</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
