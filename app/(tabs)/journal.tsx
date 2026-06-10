import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { ChevronLeft, ChevronRight, Edit2, Plus } from 'lucide-react-native';
import React from 'react';
import {
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const JOURNAL_HISTORY = [
    {
        month: 'february, 2026',
        items: [
            { id: '1', date: 'FEB 11', time: '06:57', title: 'New Chat' },
            { id: '2', date: 'FEB 7', time: '04:03', title: 'New Chat' },
        ]
    },
    {
        month: 'january, 2026',
        items: [
            { id: '3', date: 'JAN 24', time: '21:21', title: 'Untitled Chat' },
        ]
    }
];

const HistoryCard = ({ date, time, title }: { date: string, time: string, title: string }) => (
    <TouchableOpacity
        className="bg-[#2c2c2e] rounded-3xl p-6 mb-4 flex-row items-center border border-white/5 shadow-sm"
        activeOpacity={0.7}
        onPress={() => router.push('/(tabs)/ai-chat')}
    >
        <View className="items-center pr-6 border-r border-white/10">
            <Text className="text-gray-400 text-sm font-bold tracking-tighter">{date}</Text>
            <Text className="text-gray-500 text-xs font-semibold">{time}</Text>
        </View>
        <View className="flex-1 pl-6 flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
                <Text className="text-white text-lg font-bold mr-2" numberOfLines={1}>{title}</Text>
                <TouchableOpacity
                    className="p-2 bg-white/5 rounded-full"
                    onPress={() => Alert.alert('Journal entry', 'Renaming saved chats is not available in this version yet.')}
                >
                    <Edit2 size={14} color="#636366" />
                </TouchableOpacity>
            </View>
            <ChevronRight size={20} color="#3a3a3c" />
        </View>
    </TouchableOpacity>
);

export default function JournalScreen() {
    const insets = useSafeAreaInsets();

    return (
        <View className="flex-1 bg-[#1c1c1e]">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View
                style={{ paddingTop: insets.top + 10 }}
                className="flex-row items-center px-6 pb-6"
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 rounded-full bg-[#2c2c2e] items-center justify-center"
                >
                    <ChevronLeft size={24} color="white" />
                </TouchableOpacity>
                <Text className="flex-1 text-center text-white text-xl font-bold mr-10">My Journal</Text>
            </View>

            <ScrollView
                className="flex-1 px-6"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {JOURNAL_HISTORY.map((group, idx) => (
                    <View key={idx} className="mb-6">
                        <Text className="text-gray-400 text-lg font-bold mb-4 ml-1">{group.month}</Text>
                        {group.items.map(item => (
                            <HistoryCard key={item.id} {...item} />
                        ))}
                    </View>
                ))}
            </ScrollView>

            {/* Floating Plus Button */}
            <TouchableOpacity
                onPress={() => router.push('/(tabs)/ai-chat')}
                className="absolute right-6 bottom-32 shadow-2xl"
                style={{
                    shadowColor: '#ec4899',
                    shadowOpacity: 0.3,
                    shadowRadius: 10,
                    borderRadius: 32, // Explicit border radius for container
                }}
            >
                <LinearGradient
                    colors={['#8b5cf6', '#ec4899']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="w-20 h-20 rounded-full items-center justify-center"
                    style={{ borderRadius: 32 }} // Explicit border radius for gradient
                >
                    <Plus size={32} color="white" strokeWidth={3} />
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
}
