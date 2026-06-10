import Constants from 'expo-constants';
import { Stack, router } from 'expo-router';
import {
  ChevronRight,
  FileText,
  Fingerprint, // For Privacy
  Hand,
  Info,
  MessageCircle,
  User
} from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';

// Reusable components for the settings list
const SettingsGroup = ({ title, children, footer }: { title?: string, children: React.ReactNode, footer?: string }) => (
  <View className="mb-6">
    {title && <Text className="text-gray-400 text-sm font-semibold ml-4 mb-2 uppercase tracking-wide">{title}</Text>}
    <View className="bg-[#2c2c2e] rounded-3xl overflow-hidden">
      {children}
    </View>
    {footer && <Text className="text-gray-500 text-xs ml-4 mt-2 pr-4">{footer}</Text>}
  </View>
);

const SettingsItem = ({
  icon: Icon,
  iconColor = "#3b82f6", // Default blue
  iconBgColor = "#3b82f6", // Background for the icon square
  label,
  value,
  isLast = false,
  hasToggle = false,
  isInteractive = true,
  isToggled = false,
  onToggle,
  onPress
}: {
  icon: any,
  iconColor?: string,
  iconBgColor?: string,
  label: string,
  value?: string,
  isLast?: boolean,
  hasToggle?: boolean,
  isInteractive?: boolean,
  isToggled?: boolean,
  onToggle?: (val: boolean) => void,
  onPress?: () => void
}) => (
  <TouchableOpacity
    activeOpacity={hasToggle || !isInteractive ? 1 : 0.7}
    onPress={hasToggle || !isInteractive ? undefined : onPress}
    className={`flex-row items-center px-4 py-3 bg-[#2c2c2e] ${!isLast ? 'border-b border-[#3a3a3c]' : ''}`}
  >
    <View className={`w-8 h-8 rounded-lg items-center justify-center`} style={{ backgroundColor: iconBgColor }}>
      <Icon size={18} color="white" />
    </View>

    <View className="flex-1 ml-4 flex-row justify-between items-center">
      <Text className="text-white text-base font-medium">{label}</Text>

      <View className="flex-row items-center">
        {value && <Text className="text-gray-400 text-base mr-2">{value}</Text>}

        {hasToggle ? (
          <Switch
            trackColor={{ false: "#3a3a3c", true: "#34c759" }}
            thumbColor={isToggled ? "#ffffff" : "#f4f3f4"}
            ios_backgroundColor="#3a3a3c"
            onValueChange={onToggle}
            value={isToggled}
          />
        ) : isInteractive ? (
          <ChevronRight size={20} color="#636366" />
        ) : null}
      </View>
    </View>
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const [touchIdEnabled, setTouchIdEnabled] = useState(true);
  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-[#1c1c1e]">
        <ScrollView className="flex-1 px-4 pt-16" showsVerticalScrollIndicator={false}>

          <Text className="text-white text-4xl font-bold mb-8 ml-2">Profile</Text>

          {/* Personal Section */}
          <SettingsGroup title="Personal">
            <SettingsItem
              icon={FileText}
              iconBgColor="#3b82f6" // Blue
              label="My Intake"
              onPress={() => router.push('/intake')}
            />
            <SettingsItem
              icon={User}
              iconBgColor="#3b82f6" // Blue
              label="Account Settings"
              isLast
              onPress={() => router.push('/account')}
            />
          </SettingsGroup>

          <Text className="text-gray-500 text-xs ml-4 mb-6 -mt-4">Manage your daily intake and account details.</Text>

          {/* Security Section */}
          <SettingsGroup title="Security">
            <SettingsItem
              icon={Fingerprint}
              iconBgColor="#3b82f6" // Blue
              label="Touch ID Unlock"
              isLast
              hasToggle
              isToggled={touchIdEnabled}
              onToggle={setTouchIdEnabled}
            />
          </SettingsGroup>

          <Text className="text-gray-500 text-xs ml-4 mb-6 -mt-4">Enable Touch ID to secure your app with biometric authentication.</Text>

          {/* Support Section */}
          <SettingsGroup title="Support">
            <SettingsItem
              icon={MessageCircle}
              iconBgColor="#3b82f6" // Blue
              label="Contact Us"
              isLast
              onPress={() => router.push('/contact')}
            />
          </SettingsGroup>

          <Text className="text-gray-500 text-xs ml-4 mb-6 -mt-4">Get help or share feedback with our team via Facebook, Twitter, Instagram, etc.</Text>

          {/* Legal Section */}
          <SettingsGroup title="Legal">
            <SettingsItem
              icon={FileText}
              iconBgColor="#3b82f6" // Blue
              label="Terms of Use"
              onPress={() => router.push('/terms')}
            />
            <SettingsItem
              icon={Hand} // Using Hand to mimic privacy/stop icon
              iconBgColor="#3b82f6" // Blue
              label="Privacy Policy"
              isLast
              onPress={() => router.push('/privacy')}
            />
          </SettingsGroup>

          {/* About Section */}
          <SettingsGroup title="About">
            <SettingsItem
              icon={Info}
              iconBgColor="#3b82f6" // Blue
              label="Version"
              value={appVersion}
              isLast
              isInteractive={false}
            />
          </SettingsGroup>

          {/* Medical Disclaimer */}
          <View className="mb-32 px-4 items-center">
            <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-2">Medical Disclaimer</Text>
            <Text className="text-gray-600 text-xs text-center leading-5">
              This app is for informational purposes only and does not provide medical advice, diagnosis, or treatment. For medical questions or concerns, please consult with a qualified healthcare professional.
            </Text>
          </View>

        </ScrollView>
      </View>
    </>
  );
}
