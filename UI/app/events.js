import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import { useFocusEffect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import styles from "./styles";

const API_BASE_URL = "http://13.214.102.163:8000"; // Replace with your backend URL

export default function EventsScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editEventName, setEditEventName] = useState('');
  const [editEventDate, setEditEventDate] = useState('');

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

  const handleEdit = (event) => {
    setEditingEvent(event);
    setEditEventName(event.event_name);
    setEditEventDate(event.event_date);
    setEditModalVisible(true);
  };

  const handleDelete = async (event) => {
    Alert.alert(
      "Delete Event",
      `Are you sure you want to delete "${event.event_name}"? This will also delete all attendance records for this event.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(`${API_BASE_URL}/events/${event.event_id}`, {
                method: 'DELETE',
              });

              if (response.ok) {
                Alert.alert("Success", "Event deleted successfully");
                fetchEvents(); // Refresh the list
              } else {
                const errorData = await response.json();
                Alert.alert("Error", errorData.detail || "Failed to delete event");
              }
            } catch (error) {
              console.error("Error deleting event:", error);
              Alert.alert("Error", "Failed to delete event. Please try again.");
            }
          },
        },
      ]
    );
  };

  const handleSaveEdit = async () => {
    if (!editEventName.trim() || !editEventDate.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/events/${editingEvent.event_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_name: editEventName.trim(),
          event_date: editEventDate.trim(),
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "Event updated successfully");
        setEditModalVisible(false);
        setEditingEvent(null);
        setEditEventName('');
        setEditEventDate('');
        fetchEvents(); // Refresh the list
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.detail || "Failed to update event");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      Alert.alert("Error", "Failed to update event. Please try again.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.eventItem}>
      <TouchableOpacity
        style={styles.eventContent}
        onPress={() => router.push({ pathname: '/event-attendance', params: { eventId: item.event_id, eventName: item.event_name } })}
      >
        <Text style={styles.eventName}>{item.event_name}</Text>
        <Text style={styles.eventDate}>{new Date(item.event_date).toLocaleDateString()}</Text>
        <Text style={styles.tapHint}>Tap to view attendance</Text>
      </TouchableOpacity>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEdit(item)}
        >
          <Ionicons name="pencil" size={20} color="#007bff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDelete(item)}
        >
          <Ionicons name="trash" size={20} color="#ff5252" />
        </TouchableOpacity>
        <Ionicons name="chevron-forward" size={24} color="#999" />
      </View>
    </View>
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Event</Text>

            <TextInput
              style={styles.input}
              placeholder="Event Name"
              value={editEventName}
              onChangeText={setEditEventName}
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Event Date (YYYY-MM-DD)"
              value={editEventDate}
              onChangeText={setEditEventDate}
              placeholderTextColor="#999"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#4CAF50" }]}
                onPress={handleSaveEdit}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
