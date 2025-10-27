import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import styles from "./styles";

export default function CreateEventScreen() {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");

  const validateInputs = () => {
    if (!eventName.trim()) {
      Alert.alert("Please enter event name.");
      return false;
    }

    if (!eventDate) {
      Alert.alert("Please enter event date.");
      return false;
    }

    if (!eventTime) {
      Alert.alert("Please enter event time.");
      return false;
    }

    // Validate date format (YYYY-MM-DD)
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(eventDate)) {
      Alert.alert("Invalid Date Format", "Please use YYYY-MM-DD format (e.g., 2025-10-30)");
      return false;
    }

    // Validate time format (HH:MM)
    const timePattern = /^\d{2}:\d{2}$/;
    if (!timePattern.test(eventTime)) {
      Alert.alert("Invalid Time Format", "Please use HH:MM format (e.g., 14:30)");
      return false;
    }

    return true;
  };

  const handleCreateEvent = async () => {
    if (!validateInputs()) return;

    try {
      // Combine date and time
      const eventDateTime = `${eventDate} ${eventTime}:00`;

      // TODO: Replace with actual API call to FastAPI backend
      // const response = await fetch('http://<backend-ip>:8000/events', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     event_name: eventName.trim(),
      //     event_date: eventDateTime,
      //   }),
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to create event');
      // }

      // const newEvent = await response.json();

      // Show success and navigate back
      Alert.alert("✅ Success", "Event created successfully!", [
        {
          text: "OK",
          onPress: () => {
            setEventName("");
            setEventDate("");
            setEventTime("");
            router.back();
          },
        },
      ]);

    } catch (error) {
      console.error("Error creating event", error);
      Alert.alert("Error", "Failed to create event. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.titleContainer}>
          <Ionicons name="calendar-outline" size={28} color="#4CAF50" />
          <Text style={styles.titleText}>Create New Event</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Event Name (e.g., School Fair 2025)"
          value={eventName}
          onChangeText={setEventName}
        />

        <TextInput
          style={styles.input}
          placeholder="Event Date (YYYY-MM-DD)"
          value={eventDate}
          onChangeText={setEventDate}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Event Time (HH:MM)"
          value={eventTime}
          onChangeText={setEventTime}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.button} onPress={handleCreateEvent}>
          <Text style={styles.buttonText}>Create Event</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#FF5722", marginTop: 10 }]}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
