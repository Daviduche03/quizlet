import { Stack, router } from 'expo-router';
import { ChevronLeft, LogOut, Trash2 } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getAuthErrorMessage, useUser } from '@/lib/auth';
import { getProfile, saveProfile, type UserProfile } from '@/lib/profile';
import { deleteUser } from 'firebase/auth';

const InfoItem = ({
  label,
  value,
  isLast = false,
  onPress,
}: {
  label: string;
  value: string;
  isLast?: boolean;
  onPress?: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={onPress ? 0.6 : 1}
    className={`flex-row justify-between items-center py-4 px-4 ${!isLast ? 'border-b border-[#3a3a3c]' : ''}`}
  >
    <Text className="text-white text-base font-bold">{label}</Text>
    <Text className="text-gray-400 text-base font-medium max-w-[55%]" numberOfLines={1}>
      {value}
    </Text>
  </TouchableOpacity>
);

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit modal state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editField, setEditField] = useState<'name' | 'birthday'>('name');
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    if (!user) return;
    getProfile(user.uid).then((p) => {
      setProfile(p);
      setLoading(false);
    });
  }, [user]);

  const openEdit = (field: 'name' | 'birthday') => {
    setEditField(field);
    setEditValue(field === 'name' ? profile?.name ?? '' : profile?.birthday ?? '');
    setEditModalVisible(true);
  };

  const saveEdit = useCallback(async () => {
    if (!user) return;
    const trimmed = editValue.trim();
    const update = editField === 'name' ? { name: trimmed } : { birthday: trimmed };
    setProfile((prev) => ({ ...prev, ...update } as UserProfile));
    setEditModalVisible(false);
    await saveProfile(user.uid, update);
  }, [editField, editValue, user]);

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all associated data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Are you sure?',
              'Type DELETE to confirm.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Confirm Delete',
                  style: 'destructive',
                  onPress: async () => {
                    if (!user) return;
                    try {
                      await deleteUser(user);
                      await signOut();
                      router.replace('/login');
                    } catch (e: any) {
                      Alert.alert('Error', getAuthErrorMessage(e));
                    }
                  },
                },
              ],
            );
          },
        },
      ],
    );
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/login');
        },
      },
    ]);
  };

  const createdAt = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : 'Unknown';

  return (
    <View className="flex-1 bg-[#1c1c1e]">
      <Stack.Screen options={{ headerShown: false }} />

      <View
        style={{ paddingTop: insets.top + 10 }}
        className="flex-row items-center justify-between px-6 pb-6"
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-[#2c2c2e] items-center justify-center"
        >
          <ChevronLeft size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <Text className="text-white text-3xl font-bold mb-6">Account</Text>

        {/* Personal Information */}
        <Text className="text-gray-500 text-sm font-bold uppercase tracking-wide mb-3 pl-2">
          Personal Information
        </Text>

        <View className="bg-[#2c2c2e] rounded-2xl mb-8">
          <InfoItem
            label="Email"
            value={user?.email ?? '—'}
          />
          <InfoItem
            label="Full Name"
            value={loading ? '...' : (profile?.name || 'Tap to set')}
            onPress={() => openEdit('name')}
          />
          <InfoItem
            label="Birthday"
            value={loading ? '...' : (profile?.birthday || 'Tap to set')}
            isLast
            onPress={() => openEdit('birthday')}
          />
        </View>

        {/* Sign Out */}
        <TouchableOpacity
          onPress={handleSignOut}
          className="bg-[#2c2c2e] rounded-full py-4 flex-row items-center justify-center mb-4"
        >
          <LogOut size={20} color="#ff453a" />
          <Text className="text-[#ff453a] text-lg font-bold ml-3">Sign Out</Text>
        </TouchableOpacity>

        {/* Delete Account */}
        <TouchableOpacity
          onPress={handleDeleteAccount}
          className="bg-[#2c2c2e] rounded-full py-4 flex-row items-center justify-center mb-8"
        >
          <Trash2 size={20} color="#ff453a" />
          <Text className="text-[#ff453a] text-lg font-bold ml-3">Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View className="flex-1 bg-black/60 justify-center items-center px-8">
          <View className="bg-[#2c2c2e] rounded-3xl w-full p-6">
            <Text className="text-white text-xl font-bold mb-1">
              {editField === 'name' ? 'Full Name' : 'Birthday'}
            </Text>
            <Text className="text-gray-400 text-sm mb-4">
              {editField === 'birthday' ? 'Format: YYYY-MM-DD' : ''}
            </Text>

            <TextInput
              className="bg-[#3a3a3c] text-white rounded-2xl px-5 py-4 text-base font-semibold"
              style={{ textAlignVertical: 'center' }}
              placeholder={editField === 'name' ? 'Enter your name' : 'YYYY-MM-DD'}
              placeholderTextColor="#8e8e93"
              value={editValue}
              onChangeText={setEditValue}
              autoCapitalize={editField === 'name' ? 'words' : 'none'}
              autoFocus
            />

            <View className="flex-row justify-end mt-6 gap-3">
              <TouchableOpacity
                onPress={() => setEditModalVisible(false)}
                className="px-6 py-3 rounded-2xl bg-[#3a3a3c]"
              >
                <Text className="text-white text-base font-bold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={saveEdit}
                className="px-6 py-3 rounded-2xl bg-[#4677b1]"
              >
                <Text className="text-white text-base font-bold">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
