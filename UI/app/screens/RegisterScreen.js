import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles";

const courses = ["BSCS", "BSIT", "BSIS"];

const courseYearOptions = {
  BSCS: ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B'],
  BSIT: ['1A', '1B', '1C', '2A', '2B', '2C', '3A', '3B', '3C', '4A', '4B', '4C'],
  BSIS: ['1A', '2A', '3A', '4A']
};

export default function RegisterScreen({ navigation, route }) {
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [courseYear, setCourseYear] = useState("");
  const [students, setStudents] = useState([]);

  // ✅ Build courseYear when course and section changes
  useEffect(() => {
    if (selectedCourse && selectedSection) {
      setCourseYear(`${selectedCourse} ${selectedSection}`);
    } else {
      setCourseYear("");
    }
  }, [selectedCourse, selectedSection]);

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

    if (!idPattern.test(studentId)) {
      Alert.alert("Invalid ID format", "Example: 123-4567");
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

    const newStudent = {
      id: Date.now().toString(),
      studentId: trimmedStudentId,
      name: name.trim(),
      courseYear,
    };

    const updatedList = [...students, newStudent];
    setStudents(updatedList);
    await saveStudents(updatedList);

    Alert.alert("✅ Success", "Student registered successfully!");
    setStudentId("");
    setName("");
    setSelectedCourse("");
    setSelectedSection("");
    setCourseYear("");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <Text style={styles.title}>📘 Student Registration</Text>

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
            onPress={() => navigation.navigate("ViewStudents", { students })}
          >
            <Text style={styles.buttonText}>View Registered Students</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
