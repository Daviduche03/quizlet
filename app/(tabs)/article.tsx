import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Share } from 'lucide-react-native';
import React from 'react';
import {
    ImageBackground,
    Share as NativeShare,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ARTICLE_DATA: Record<string, { title: string; image: string; author: string; content: string }> = {
    '1': {
        title: 'Personality Disorders: Understanding and Managing Complex Patterns of Behavior',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop',
        author: 'RENE GEORGES',
        content: `People possess unique personalities that shape their perceptions of the world and their interactions with others. These personality traits form early in life and remain relatively stable throughout adulthood.\n\nHowever, when these traits become rigid and inflexible, causing distress or impairment in social, occupational, or other important areas of functioning, they may constitute a personality disorder.\n\nUnderstanding personality disorders is crucial for both those affected and their loved ones. It helps in recognizing the signs, seeking appropriate treatment, and fostering empathy and support.\n\nThere are several types of personality disorders, grouped into three clusters based on similar characteristics and symptoms. Cluster A includes paranoid, schizoid, and schizotypal personality disorders, often characterized by odd or eccentric behavior. Cluster B includes antisocial, borderline, histrionic, and narcissistic personality disorders, marked by dramatic, emotional, or erratic behavior. Cluster C includes avoidant, dependent, and obsessive-compulsive personality disorders, involving anxious or fearful behavior.`
    },
    'default': {
        title: 'The Psychology of Design',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop',
        author: 'Sarah Smith',
        content: 'Design influences our emotions and behaviors in subtle yet profound ways...'
    }
};

export default function ArticleScreen() {
    const insets = useSafeAreaInsets();
    const { id } = useLocalSearchParams();
    const article = ARTICLE_DATA[id as string] || ARTICLE_DATA['1']; // Fallback to 1
    const handleShare = async () => {
        await NativeShare.share({
            message: `${article.title}\n\n${article.content.slice(0, 160)}...`,
            title: article.title,
        });
    };

    return (
        <View className="flex-1 bg-[#1c1c1e]">
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} bounces={false}>
                {/* Hero Image */}
                <View className="h-[450px] w-full relative">
                    <ImageBackground
                        source={{ uri: article.image }}
                        className="flex-1"
                        resizeMode="cover"
                    >
                        <LinearGradient
                            colors={['rgba(0,0,0,0.3)', 'transparent', '#1c1c1e']}
                            className="absolute inset-0"
                            locations={[0, 0.6, 1]}
                        />

                        {/* Header Buttons */}
                        <View
                            style={{ paddingTop: insets.top + 10 }}
                            className="flex-row justify-between px-6"
                        >
                            <TouchableOpacity
                                onPress={() => router.back()}
                                className="w-10 h-10 rounded-full bg-black/40 items-center justify-center backdrop-blur-md"
                            >
                                <ChevronLeft size={24} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleShare}
                                className="w-10 h-10 rounded-full bg-[#E8B042] items-center justify-center"
                            >
                                <Share size={20} color="black" />
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </View>

                {/* Content Container */}
                <View className="-mt-8 px-6 pb-20">
                    {/* Pull handle visual */}
                    <View className="self-center w-10 h-1 bg-gray-600 rounded-full mb-6 opacity-50" />

                    <Text className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-3">
                        WRITTEN BY {article.author}
                    </Text>

                    <Text className="text-white text-3xl font-bold leading-9 mb-8">
                        {article.title}
                    </Text>

                    {/* Article Body */}
                    <Text className="text-gray-300 text-lg leading-8">
                        {article.content}
                    </Text>
                </View>
            </ScrollView>

            {/* Bottom Tab Bar Placeholder/Home Button overlay if needed, 
                but usually redundant in detailed view. Layout handles tab bar visibility. */}
        </View>
    );
}
