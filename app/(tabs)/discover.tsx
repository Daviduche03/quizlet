import { Stack, router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    FlatList,
    ImageBackground,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CATEGORIES = ['All', 'New', 'Intro', 'Topics'];

const ARTICLES = [
    {
        id: '1',
        title: 'Personality Disorders: Understanding and Managing Complex Patterns of Behavior',
        category: 'INTRODUCTION',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop', // Woman portrait from screenshot
        author: 'Rene Georges',
        readTime: '8 min'
    },
    {
        id: '2',
        title: 'The Psychology of Design',
        category: 'DESIGN',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop', // Fashion/Model
        author: 'Sarah Smith',
        readTime: '5 min'
    },
    {
        id: '3',
        title: 'Understanding Anxiety',
        category: 'MENTAL HEALTH',
        image: 'https://images.unsplash.com/photo-1474418397713-7ede21d49118?q=80&w=2053&auto=format&fit=crop',
        author: 'Dr. John Doe',
        readTime: '6 min'
    }
];

export default function DiscoverScreen() {
    const insets = useSafeAreaInsets();
    const [selectedCategory, setSelectedCategory] = useState('All');

    const renderItem = ({ item }: { item: typeof ARTICLES[0] }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push({ pathname: '/article', params: { id: item.id } })}
            className="mb-8"
        >
            <View className="h-[280px] w-full rounded-[32px] overflow-hidden bg-[#2c2c2e] mb-4">
                <ImageBackground
                    source={{ uri: item.image }}
                    className="flex-1"
                    resizeMode="cover"
                />
            </View>
            <Text className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-2">
                {item.category}
            </Text>
            <Text className="text-white text-xl font-bold leading-7 mb-1 pr-4">
                {item.title}
            </Text>
        </TouchableOpacity>
    );

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
                    className="w-10 h-10 rounded-full bg-[#2c2c2e] items-center justify-center mr-4"
                >
                    <ChevronLeft size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold">Discover</Text>
            </View>

            {/* Categories */}
            <View className="flex-row px-6 mb-6">
                {CATEGORIES.map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        onPress={() => setSelectedCategory(cat)}
                        className={`px-6 py-2 rounded-full mr-2 ${selectedCategory === cat ? 'bg-[#636366]' : 'bg-[#2c2c2e]'
                            }`}
                    >
                        <Text className={`font-semibold ${selectedCategory === cat ? 'text-white' : 'text-gray-400'
                            }`}>
                            {cat}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Article List */}
            <FlatList
                data={ARTICLES}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}
