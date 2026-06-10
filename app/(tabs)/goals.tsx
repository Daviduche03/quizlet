import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { ChevronLeft, Search, Target } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function GoalsScreen() {
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('All Goals');

    const filters = [
        { label: 'All Goals', count: 1 },
        { label: 'Active', count: 1 },
        { label: 'Completed', count: 0 },
    ];

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
            </View>

            <View className="flex-1 px-6">
                {/* Search Bar */}
                <View className="bg-[#2c2c2e] rounded-xl flex-row items-center px-4 h-12 mb-6">
                    <Search size={20} color="#8e8e93" />
                    <TextInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search goals..."
                        placeholderTextColor="#8e8e93"
                        className="flex-1 text-white ml-3 text-base"
                    />
                </View>

                {/* Filters */}
                <View className="flex-row mb-12">
                    {filters.map((filter) => (
                        <TouchableOpacity
                            key={filter.label}
                            onPress={() => setSelectedFilter(filter.label)}
                            className={`flex-row items-center px-4 py-2 rounded-full mr-3 ${selectedFilter === filter.label ? 'bg-white' : 'bg-[#2c2c2e]'
                                }`}
                        >
                            <Text className={`text-sm font-bold mr-2 ${selectedFilter === filter.label ? 'text-black' : 'text-white'
                                }`}>
                                {filter.label}
                            </Text>
                            {filter.count > 0 && (
                                <View className={`rounded-full px-1.5 py-0.5 ${selectedFilter === filter.label ? 'bg-black/10' : 'bg-white/10'
                                    }`}>
                                    <Text className={`text-xs font-bold ${selectedFilter === filter.label ? 'text-black' : 'text-gray-400'
                                        }`}>
                                        {filter.count}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Empty State */}
                <View className="flex-1 items-center justify-center -mt-20">
                    <View className="w-24 h-24 rounded-full bg-[#2c2c2e] items-center justify-center mb-6">
                        <Target size={48} color="#636366" strokeWidth={1.5} />
                    </View>

                    <Text className="text-white text-2xl font-bold mb-3">No Goals Yet</Text>
                    <Text className="text-gray-400 text-center text-base px-8 mb-8 leading-6">
                        Set your therapy goals from the intake form to track your progress
                    </Text>

                    <TouchableOpacity
                        className="shadow-lg shadow-purple-500/30"
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#8b5cf6', '#ec4899']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{
                                paddingHorizontal: 35,
                                paddingVertical: 12,
                                borderRadius: 30,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Text className="text-white font-bold text-lg">Add Your First Goal</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
