import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { House, Plus, User } from "lucide-react-native";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TAB_BAR_WIDTH = SCREEN_WIDTH - 100; // 50px margin on each side

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { display: 'none' }, // Hide default tab bar
      }}
      tabBar={(props) => <CustomTabBar {...props} bottomInset={insets.bottom} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="ai-chat" />
      <Tabs.Screen name="journal" options={{ href: null }} />
      <Tabs.Screen name="goals" options={{ href: null }} />
      <Tabs.Screen name="hrv" options={{ href: null }} />
      <Tabs.Screen name="discover" options={{ href: null }} />
      <Tabs.Screen name="article" options={{ href: null }} />
      <Tabs.Screen name="contact" options={{ href: null }} />
      <Tabs.Screen name="terms" options={{ href: null }} />
      <Tabs.Screen name="privacy" options={{ href: null }} />
      <Tabs.Screen name="account" options={{ href: null }} />
      <Tabs.Screen name="intake" options={{ href: null }} />
      <Tabs.Screen name="favorite" options={{ href: null }} />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

function CustomTabBar({ state, descriptors, navigation, bottomInset }: any) {
  // Define the tabs we want to show by name
  const tabsToShow = ['index', 'ai-chat', 'profile'];

  const visibleRoutes = tabsToShow.map(name => {
    const index = state.routes.findIndex((r: any) => r.name === name);
    return {
      index,
      route: state.routes[index] // valid because we defined the screens
    };
  }).filter(item => item.index !== -1);

  const chatIndex = state.routes.findIndex((r: any) => r.name === 'ai-chat');

  // Hide tab bar on AI Chat screen
  if (state.index === chatIndex) {
    return null;
  }

  return (
    <View style={[styles.tabBarContainer, { bottom: Math.max(bottomInset, 20) }]}>
      <BlurView intensity={60} tint="dark" style={styles.blurBackground}>
        <View style={styles.tabBarContent}>
          {visibleRoutes.map(({ index, route }) => {
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={styles.tabButton}
                activeOpacity={0.7}
              >
                {route.name === 'index' && (
                  <View style={[styles.iconContainer, isFocused && styles.activeIconContainer]}>
                    <House
                      size={26}
                      color={isFocused ? '#3b82f6' : '#9ca3af'}
                      fill={isFocused ? '#3b82f6' : 'none'}
                      strokeWidth={2}
                    />
                  </View>
                )}
                {route.name === 'ai-chat' && (
                  <View style={styles.plusButton}>
                    <Plus size={24} color="#1c1c1e" strokeWidth={3} />
                  </View>
                )}
                {route.name === 'profile' && (
                  <View style={[styles.iconContainer, isFocused && styles.activeIconContainer]}>
                    <User
                      size={26}
                      color={isFocused ? '#3b82f6' : '#9ca3af'}
                      fill={isFocused ? '#3b82f6' : 'none'}
                      strokeWidth={2}
                    />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    width: TAB_BAR_WIDTH,
    height: 72,
    left: (SCREEN_WIDTH - TAB_BAR_WIDTH) / 2, // Center horizontally
    borderRadius: 40,
    overflow: 'hidden',
  },
  blurBackground: {
    flex: 1,
    borderRadius: 40,
    overflow: 'hidden',
  },
  tabBarContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
  },
  iconContainer: {
    width: 70,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  activeIconContainer: {
    backgroundColor: 'rgba(50, 50, 52, 0.9)',
  },
  plusButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
