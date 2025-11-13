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
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Schools"
        component={SchoolsScreen}
        options={{ title: "Escolas" }}
      />
      <Tab.Screen
        name="Classes"
        component={ClassesScreen}
        options={{ title: "Turmas" }}
      />
    </Tab.Navigator>
  );
}
