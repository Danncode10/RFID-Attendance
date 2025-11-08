import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import styles from "./styles";

const API_BASE_URL = "http://13.214.102.163:8000"; // Replace with your backend URL

export default function EventAttendanceScreen() {
  const { eventId, eventName } = useLocalSearchParams();
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAttendance = async () => {
    if (!eventId) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/attendance?event_id=${eventId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAttendanceLogs(data);
    } catch (e) {
      console.error("Error fetching attendance:", e);
      setError("Failed to load attendance. Please try again later.");
      Alert.alert("Error", "Failed to load attendance. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAttendance();
    }, [eventId])
  );

  const renderItem = ({ item }) => (
    <View style={styles.attendanceItem}>
      <View style={styles.attendanceContent}>
        <Text style={styles.studentName}>{item.name}</Text>
        <Text style={styles.studentDetails}>{item.course_year}</Text>
        <Text style={styles.scanTime}>{new Date(item.scan_timestamp).toLocaleString()}</Text>
        {item.duplicate && (
          <Text style={styles.duplicateText}>⚠️ Duplicate scan - already recorded today</Text>
        )}
      </View>
      <View style={[styles.statusIndicator, item.duplicate && styles.duplicateIndicator]}>
        <Ionicons
          name={item.duplicate ? "warning" : "checkmark-circle"}
          size={24}
          color="#fff"
        />
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ textAlign: "center", marginTop: 10 }}>Loading attendance...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: "center", color: "red", marginTop: 20 }}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Ionicons name="calendar-outline" size={24} color="#4CAF50" />
        <Text style={styles.titleText}>{eventName || "Event Attendance"}</Text>
      </View>
      <Text style={styles.attendanceCount}>Total Scans: {attendanceLogs.length}</Text>

      <FlatList
        data={attendanceLogs}
        keyExtractor={(item) => item.log_id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="information-circle-outline" size={50} color="#999" />
            <Text style={styles.emptyText}>
              No attendance recorded for this event yet.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
