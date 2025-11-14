import { MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import ClassesScreen from "../features/classes/ClassesScreen";
import SchoolsScreen from "../features/schools/SchoolsScreen";

export type RootTabParamList = {
  Schools: undefined;
  Classes: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2E7D32",
        tabBarInactiveTintColor: "#777",
      }}
    >
      <Tab.Screen
        name="Schools"
        component={SchoolsScreen}
        options={{
          title: "Escolas",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="location-city" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Classes"
        component={ClassesScreen}
        options={{
          title: "Turmas",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="people" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
