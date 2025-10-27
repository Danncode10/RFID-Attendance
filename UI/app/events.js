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
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import styles from "./styles";

export default function EventsScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for events since we don't have backend connection yet
  const mockEvents = [
    { event_id: 1, event_name: "School Fair 2025", event_date: "2025-10-30 10:00:00" },
    { event_id: 2, event_name: "Basketball Game", event_date: "2025-11-05 14:00:00" },
    { event_id: 3, event_name: "Science Fair", event_date: "2025-11-10 09:00:00" },
  ];

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call to FastAPI backend
      // const response = await fetch('http://<backend-ip>:8000/events');
      // const data = await response.json();
      // setEvents(data);

      // Using mock data for now
      setEvents(mockEvents);
    } catch (error) {
      console.error("Error loading events", error);
      Alert.alert("Error", "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadEvents().then(() => setRefreshing(false));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const handleEventPress = (event) => {
    router.push({
      pathname: '/event-attendance',
      params: { eventId: event.event_id, eventName: event.event_name }
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.eventItem} onPress={() => handleEventPress(item)}>
      <View style={styles.eventContent}>
        <Text style={styles.eventName}>{item.event_name}</Text>
        <Text style={styles.eventDate}>{formatDate(item.event_date)}</Text>
        <Text style={styles.tapHint}>Tap to view attendance</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Ionicons name="calendar-outline" size={28} color="#4CAF50" />
        <Text style={styles.titleText}>Events</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#2196F3", marginBottom: 20 }]}
        onPress={() => router.push('/create-event')}
      >
        <View style={styles.buttonContent}>
          <Ionicons name="add-outline" size={20} color="#fff" />
          <Text style={styles.buttonTextWithIcon}>Create New Event</Text>
        </View>
      </TouchableOpacity>

      <FlatList
        data={events}
        keyExtractor={(item) => item.event_id.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No events created yet.{'\n'}Create your first event above!
          </Text>
        }
        contentContainerStyle={events.length === 0 ? { flex: 1, justifyContent: 'center' } : null}
      />
    </SafeAreaView>
  );
}
