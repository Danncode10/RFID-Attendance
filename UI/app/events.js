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
import { useFocusEffect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import styles from "./styles";

const API_BASE_URL = "http://13.214.102.163:8000"; // Replace with your backend URL

export default function EventsScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/events`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEvents(data);
    } catch (e) {
      console.error("Error fetching events:", e);
      setError("Failed to load events. Please try again later.");
      Alert.alert("Error", "Failed to load events. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.eventItem}
      onPress={() => router.push({ pathname: '/event-attendance', params: { eventId: item.event_id, eventName: item.event_name } })}
    >
      <View style={styles.eventContent}>
        <Text style={styles.eventName}>{item.event_name}</Text>
        <Text style={styles.eventDate}>{new Date(item.event_date).toLocaleDateString()}</Text>
        <Text style={styles.tapHint}>Tap to view attendance</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#999" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ textAlign: "center", marginTop: 10 }}>Loading events...</Text>
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
        <Text style={styles.titleText}>Events</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#4CAF50", marginBottom: 15 }]}
        onPress={() => router.push('/create-event')}
      >
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <Text style={styles.buttonTextWithIcon}>Create New Event</Text>
      </TouchableOpacity>

      <FlatList
        data={events}
        keyExtractor={(item) => item.event_id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="information-circle-outline" size={50} color="#999" />
            <Text style={styles.emptyText}>
              No events created yet. Tap "Create New Event" to add one.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
