import { config } from "@gluestack-ui/config";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { AppDataProvider } from "./src/context/AppDataContext";
import { TabNavigator } from "./src/navigation/TabNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <GluestackUIProvider config={config}>
        <AppDataProvider>
          <TabNavigator />
        </AppDataProvider>
      </GluestackUIProvider>
    </NavigationContainer>
  );
}
