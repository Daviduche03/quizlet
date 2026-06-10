import { AudioPlayerModal } from '@/components/AudioPlayerModal';
import { Stack, router } from 'expo-router';
import { ChevronLeft, Music } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const FILTER_TABS = ['All', 'Meditation', 'Soundscapes'];

const MOCK_AUDIO_DATA = [
    {
        id: '1',
        title: 'Guided Meditation to End Your Day',
        description: '5 Minutes before you Sleep Guided Meditation to End Your Day',
        duration: '5 min',
        type: 'Meditation',
        image: require('@/assets/images/meditation-1.png'),
    },
    {
        id: '2',
        title: 'Forest',
        description: 'Forest ambience for deep focus and calm',
        duration: '15 min',
        type: 'Soundscapes',
        image: require('@/assets/images/forest.png'),
        uri: 'https://pub-fd1c39001c8042ce990acec57b22b34d.r2.dev/mp3/Forest%2015%20minutes.mp3',
    },
    {
        id: '3',
        title: 'Birds',
        description: 'Birdsong to help you reset and breathe',
        duration: '15 min',
        type: 'Soundscapes',
        image: require('@/assets/images/forest.png'),
        uri: 'https://pub-fd1c39001c8042ce990acec57b22b34d.r2.dev/mp3/Birds%2015%20minutes.mp3',
    },
    {
        id: '4',
        title: 'Forest Birds',
        description: 'Mixed forest and birds ambience',
        duration: '15 min',
        type: 'Soundscapes',
        image: require('@/assets/images/forest.png'),
        uri: 'https://pub-fd1c39001c8042ce990acec57b22b34d.r2.dev/mp3/Forest%20birds%2015%20minutes.mp3',
    },
    {
        id: '5',
        title: 'Forest Rain',
        description: 'Rainfall layered with forest ambience',
        duration: '15 min',
        type: 'Soundscapes',
        image: require('@/assets/images/rain.png'),
        uri: 'https://pub-fd1c39001c8042ce990acec57b22b34d.r2.dev/mp3/Forest%20rain%2015%20minutes.mp3',
    },
    {
        id: '6',
        title: 'Heavy Rain',
        description: 'Heavy rain sounds for focus and sleep',
        duration: '15 min',
        type: 'Soundscapes',
        image: require('@/assets/images/rain.png'),
        uri: 'https://pub-fd1c39001c8042ce990acec57b22b34d.r2.dev/mp3/Heavy%20Rain%2015%20minutes.mp3',
    },
    {
        id: '7',
        title: 'Ocean Wave',
        description: 'Calming waves washing over the shore',
        duration: '15 min',
        type: 'Soundscapes',
        image: require('@/assets/images/ocean.png'),
        uri: 'https://pub-fd1c39001c8042ce990acec57b22b34d.r2.dev/mp3/Ocean%20wave%2015%20minutes.mp3',
    },
    {
        id: '8',
        title: 'Rain',
        description: 'Steady rain to quiet racing thoughts',
        duration: '15 min',
        type: 'Soundscapes',
        image: require('@/assets/images/rain.png'),
        uri: 'https://pub-fd1c39001c8042ce990acec57b22b34d.r2.dev/mp3/Rain%2015%20minutes.mp3',
    },
    {
        id: '9',
        title: 'Stream',
        description: 'Soft stream flow for grounding and calm',
        duration: '15 min',
        type: 'Soundscapes',
        image: require('@/assets/images/forest.png'),
        uri: 'https://pub-fd1c39001c8042ce990acec57b22b34d.r2.dev/mp3/Stream%2015%20minutes.mp3',
    },
    {
        id: '10',
        title: 'Waterfall',
        description: 'Powerful waterfall ambience for deep focus',
        duration: '15 min',
        type: 'Soundscapes',
        image: require('@/assets/images/forest.png'),
        uri: 'https://pub-fd1c39001c8042ce990acec57b22b34d.r2.dev/mp3/Waterfall%2015%20minutes.mp3',
    },
    {
        id: '11',
        title: '3 Minute Meditation',
        description: 'Quick reset for your mind',
        duration: '3 min',
        type: 'Meditation',
        image: require('@/assets/images/meditation-2.png'),
    }
];

export default function AudioScreen() {
    const [activeTab, setActiveTab] = useState('All');
    const [selectedTrack, setSelectedTrack] = useState<any>(null);

    const filteredData = activeTab === 'All'
        ? MOCK_AUDIO_DATA
        : MOCK_AUDIO_DATA.filter(item => item.type === activeTab);

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <View className="flex-1 bg-[#1c1c1e]">
                {/* Header */}
                <View className="flex-row items-center pt-14 pb-4 px-6">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full bg-[#2c2c2e] items-center justify-center"
                    >
                        <ChevronLeft size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="flex-1 text-center text-white text-lg font-bold mr-10">Audio</Text>
                </View>

                {/* Filter Tabs */}
                <View className="flex-row px-6 mb-6">
                    <View className="flex-1 flex-row bg-[#2c2c2e] rounded-full p-1">
                        {FILTER_TABS.map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                onPress={() => setActiveTab(tab)}
                                className={`flex-1 py-1.5 rounded-full items-center ${activeTab === tab ? 'bg-[#636366]' : ''}`}
                            >
                                <Text className={`text-sm font-semibold ${activeTab === tab ? 'text-white' : 'text-gray-400'}`}>
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Audio List */}
                <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                    {filteredData.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            onPress={() => setSelectedTrack(item)}
                            className="bg-[#2c2c2e] rounded-2xl p-4 mb-4 flex-row items-center"
                        >
                            <Image
                                source={item.image}
                                className="w-16 h-16 rounded-xl bg-gray-700"
                            />
                            <View className="flex-1 ml-4 mr-2">
                                <Text className="text-white text-base font-bold mb-1 leading-5">
                                    {item.title}
                                </Text>
                                <Text className="text-gray-400 text-xs font-medium mb-1 line-clamp-2">
                                    {item.description}
                                </Text>
                                <Text className="text-[#636366] text-[10px] font-bold uppercase">
                                    MP3 File
                                </Text>
                            </View>

                            <Music size={20} color="#636366" />
                        </TouchableOpacity>
                    ))}
                    <View className="h-20" />
                </ScrollView>

                <AudioPlayerModal
                    visible={!!selectedTrack}
                    track={selectedTrack}
                    onClose={() => setSelectedTrack(null)}
                />
            </View>
        </>
    );
}
