import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterScreen from "./screens/RegisterScreen";
import ViewStudentsScreen from "./screens/ViewStudentsScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
  
      <Stack.Navigator
        initialRouteName="Register"
        screenOptions={{
          headerStyle: { backgroundColor: "#4CAF50" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: "Student Registration" }}
        />
        <Stack.Screen
          name="ViewStudents"
          component={ViewStudentsScreen}
          options={{ title: "Registered Students" }}
        />
      </Stack.Navigator>
  
  );
}
