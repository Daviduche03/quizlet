import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Bot, Heart, House, UserRound } from "lucide-react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3b82f6', // blue-500
        tabBarInactiveTintColor: '#6b7280', // gray-500
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: () => null, // Remove default background
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: '#ffffff', // plain white
          borderTopWidth: 0, // Remove the black top border
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          paddingBottom: Platform.OS === 'ios' ? 35 : 25,
          paddingTop: 15,
          paddingHorizontal: 30,
          height: Platform.OS === 'ios' ? 105 : 85,
          left: 0,
          right: 0,
          bottom: 0,
          // shadowColor: '#000000',
          // shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarShowLabel: false,
        tabBarItemStyle: {
          paddingHorizontal: 15,
          paddingVertical: 8,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <House
              size={focused ? 30 : 26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="ai-chat"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Bot
              size={focused ? 30 : 26}
              color={color}
            />
          ),
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="favorite"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Heart
              size={focused ? 30 : 26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <UserRound
              size={focused ? 30 : 26}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
