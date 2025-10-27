import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import styles from "./styles";

export default function ViewStudentsScreen() {
  const [students, setStudents] = useState([]);
  const [recentlyDeleted, setRecentlyDeleted] = useState(null);
  const [undoTimeout, setUndoTimeout] = useState(null);

  // ✅ Load saved students
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

  // ✅ Save to AsyncStorage
  const saveStudents = async (list) => {
    try {
      await AsyncStorage.setItem("students", JSON.stringify(list));
    } catch (error) {
      console.error("Error saving students", error);
    }
  };

  // ✅ Delete a student with Undo option
  const handleDelete = (id) => {
    const deletedStudent = students.find((s) => s.id === id);
    const updatedList = students.filter((s) => s.id !== id);

    setStudents(updatedList);
    saveStudents(updatedList);
    setRecentlyDeleted(deletedStudent);

    // Auto-clear Undo after 5 seconds
    const timeout = setTimeout(() => {
      setRecentlyDeleted(null);
    }, 5000);
    setUndoTimeout(timeout);
  };

  // ✅ Undo deletion
  const handleUndo = () => {
    if (recentlyDeleted) {
      const restoredList = [...students, recentlyDeleted];
      setStudents(restoredList);
      saveStudents(restoredList);
      setRecentlyDeleted(null);
      if (undoTimeout) clearTimeout(undoTimeout);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, { flex: 1 }]}>{item.studentId}</Text>
      <Text style={[styles.tableCell, { flex: 2 }]}>{item.name}</Text>
      <Text style={[styles.tableCell, { flex: 1 }]}>{item.courseYear}</Text>

      <TouchableOpacity
        style={[styles.deleteButton, { marginLeft: 10 }]}
        onPress={() =>
          Alert.alert(
            "Delete Student",
            `Are you sure you want to delete ${item.name}?`,
            [
              { text: "Cancel", style: "cancel" },
              { text: "Delete", style: "destructive", onPress: () => handleDelete(item.id) },
            ]
          )
        }
      >
        <Ionicons name="trash-outline" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#FF5722", marginBottom: 10 }]}
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>Back to Registration</Text>
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Ionicons name="list-outline" size={24} color="#4CAF50" />
        <Text style={styles.titleText}>Registered Students</Text>
      </View>

      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, { flex: 1 }]}>ID</Text>
        <Text style={[styles.tableHeaderText, { flex: 2 }]}>Name</Text>
        <Text style={[styles.tableHeaderText, { flex: 1 }]}>Course & Year</Text>
        <Text style={[styles.tableHeaderText, { flex: 0.5 }]}></Text>
      </View>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No students registered yet.
          </Text>
        }
      />

      {recentlyDeleted && (
        <View style={styles.undoContainer}>
          <Text style={{ color: "#fff" }}>
            Deleted {recentlyDeleted.name}
          </Text>
          <TouchableOpacity onPress={handleUndo}>
            <Text style={{ color: "#FFD700", fontWeight: "bold", marginLeft: 10 }}>
              UNDO
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
