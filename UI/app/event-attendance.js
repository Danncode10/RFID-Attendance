import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import styles from "./styles";

export default function EventAttendanceScreen() {
  const { eventId, eventName } = useLocalSearchParams();
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Mock attendance data - students who tapped RFID for this event
  const mockAttendance = [
    { log_id: 1, student_id: 1, event_id: parseInt(eventId), scan_timestamp: "2025-10-30 10:15:23" },
    { log_id: 2, student_id: 2, event_id: parseInt(eventId), scan_timestamp: "2025-10-30 10:22:45" },
    { log_id: 3, student_id: 3, event_id: parseInt(eventId), scan_timestamp: "2025-10-30 10:30:12" },
  ];

  // Mock students data - need to match with attendance
  const mockStudents = [
    { student_id: 1, rfid_id: "123456789", name: "John Doe", grade: "BSCS 3" },
    { student_id: 2, rfid_id: "987654321", name: "Jane Smith", grade: "BSIT 2" },
    { student_id: 3, rfid_id: "555666777", name: "Bob Johnson", grade: "BSCS 1" },
    { student_id: 4, rfid_id: "111222333", name: "Alice Brown", grade: "BSIT 4" },
  ];

  useEffect(() => {
    loadAttendance();
  }, [eventId]);

  const loadAttendance = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API calls to FastAPI backend
      // const attendanceResponse = await fetch(`http://<backend-ip>:8000/attendance?event_id=${eventId}`);
      // const attendanceData = await attendanceResponse.json();
      // setAttendance(attendanceData);

      // const studentsResponse = await fetch('http://<backend-ip>:8000/students');
      // const studentsData = await studentsResponse.json();
      // setStudents(studentsData);

      // Using mock data for now
      setAttendance(mockAttendance);
      setStudents(mockStudents);
    } catch (error) {
      console.error("Error loading attendance", error);
      Alert.alert("Error", "Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAttendance().then(() => setRefreshing(false));
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getStudentById = (studentId) => {
    return students.find(student => student.student_id === studentId);
  };

  const getAttendanceWithStudents = () => {
    return attendance.map(log => {
      const student = getStudentById(log.student_id);
      return {
        ...log,
        student_name: student?.name || "Unknown Student",
        student_rfid: student?.rfid_id || "Unknown RFID",
        student_grade: student?.grade || "Unknown",
      };
    });
  };

  const attendanceWithStudents = getAttendanceWithStudents();

  const renderItem = ({ item }) => (
    <View style={styles.attendanceItem}>
      <View style={styles.attendanceContent}>
        <Text style={styles.studentName}>{item.student_name}</Text>
        <Text style={styles.studentDetails}>RFID: {item.student_rfid}</Text>
        <Text style={styles.studentDetails}>Grade: {item.student_grade}</Text>
        <Text style={styles.scanTime}>Scanned: {formatTimestamp(item.scan_timestamp)}</Text>
      </View>
      <View style={styles.statusIndicator}>
        <Ionicons name="checkmark-circle" size={24} color="#fff" />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#FF5722", marginBottom: 10 }]}
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>← Back to Events</Text>
      </TouchableOpacity>

      <Text style={styles.eventTitle}>{eventName}</Text>
      <Text style={styles.attendanceCount}>
        Attendance: {attendanceWithStudents.length} student{attendanceWithStudents.length !== 1 ? 's' : ''}
      </Text>

      <FlatList
        data={attendanceWithStudents}
        keyExtractor={(item) => item.log_id.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No students have tapped their RFID yet.{'\n\n'}
              When students scan their RFID cards at the event,{'\n'}
              they will appear here with green LED confirmation.
            </Text>
          </View>
        }
        contentContainerStyle={attendanceWithStudents.length === 0 ? { flex: 1, justifyContent: 'center' } : null}
      />
    </SafeAreaView>
  );
}
