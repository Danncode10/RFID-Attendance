import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import styles from "./styles";

const API_BASE_URL = "http://13.214.102.163:8000"; // Replace with your backend URL

export default function CreateEventScreen() {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || eventDate;
    setShowDatePicker(Platform.OS === 'ios');
    setEventDate(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const handleCreateEvent = async () => {
    if (!eventName.trim()) {
      Alert.alert("Error", "Please enter an event name.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_name: eventName.trim(),
          event_date: eventDate.toISOString().split('T')[0], // YYYY-MM-DD
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("✅ Success", "Event created successfully!");
        setEventName("");
        setEventDate(new Date());
        router.back();
      } else {
        Alert.alert("Creation Failed", data.detail || "An error occurred.");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      Alert.alert("Error", "Could not connect to the server.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Ionicons name="add-circle-outline" size={24} color="#4CAF50" />
        <Text style={styles.titleText}>Create New Event</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Event Name"
        value={eventName}
        onChangeText={setEventName}
        placeholderTextColor="#999"
      />

      <TouchableOpacity onPress={showDatepicker} style={styles.input}>
        <Text style={{ color: eventDate ? "#000" : "#999", fontSize: 16 }}>
          {eventDate ? eventDate.toLocaleDateString() : "Select Event Date"}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={eventDate}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleCreateEvent}>
        <Text style={styles.buttonText}>Create Event</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
