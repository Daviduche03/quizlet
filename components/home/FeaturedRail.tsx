import { router } from 'expo-router';
import { Lock, NotebookText } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.89; // Cards take up a little more screen width

const FeatureCard = ({
    title,
    description,
    image,
    isLocked,
    openLabel,
    onPress
}: {
    title: string,
    description: string,
    image: any,
    isLocked?: boolean,
    openLabel?: string,
    onPress?: () => void
}) => (
    <View className="mr-4" style={{ width: CARD_WIDTH }}>
        <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
            <View className="h-[430px] rounded-[32px] overflow-hidden bg-gray-800 relative shadow-xl" style={{ width: CARD_WIDTH }}>
                <Image
                    source={image}
                    style={styles.image}
                    resizeMode="cover"
                />
                <View className="flex-1 justify-end">
                    <View className="absolute inset-0 bg-black/15" />
                    <View style={styles.bottomFade} />

                    <View className="px-5 pb-5">
                        <Text className="text-white text-4xl font-bold leading-tight">{title}</Text>
                        <Text className="text-white/90 text-[18px] leading-6 font-medium mb-3">{description}</Text>
                        <View className="flex-row items-center">
                            {isLocked && <Lock size={12} color="white" strokeWidth={2.8} />}
                            <Text className={`text-white/85 text-sm font-medium ${isLocked ? 'ml-2' : ''}`}>
                                {isLocked ? 'Unlock with Premium' : 'Included'}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>

        <TouchableOpacity
            activeOpacity={0.85}
            onPress={onPress}
            className="mt-3 rounded-[32px] border border-white/10 overflow-hidden"
        >
            <LinearGradient
                colors={['#3A3D46', '#25272E', '#1C1D22']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.openButtonGradient}
            >
                <NotebookText size={18} color="#FFFFFF" />
                <Text className="text-white text-base font-semibold ml-2">{`Open ${openLabel ?? title}`}</Text>
            </LinearGradient>
        </TouchableOpacity>
    </View>
);

export const FeaturedRail = ({ onLockedPress }: { onLockedPress?: () => void }) => {
    const features = [
        {
            title: "E-Mirror",
            description: "Reflect with AI therapy and capture what matters.",
            image: require('@/assets/images/emotion.png'),
            isLocked: false,
            onPress: () => router.push('/ai-chat')
        },
        {
            title: "Goals",
            description: "Set meaningful targets and track your wins.",
            image: require('@/assets/images/goals.png'),
            isLocked: true,
            onPress: onLockedPress
        },
        {
            title: "HRV",
            description: "See stress patterns and improve your recovery.",
            image: require('@/assets/images/HRV.png'),
            isLocked: true,
            onPress: onLockedPress
        },
        {
            title: "Journaling",
            description: "Reflect with AI therapy and capture what matters.",
            image: require('@/assets/images/journal.png'),
            isLocked: true,
            openLabel: "Journal",
            onPress: onLockedPress
        }
    ];

    return (
        <View className="mb-8">
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: 24, paddingRight: 8 }}
                decelerationRate="fast"
                snapToInterval={CARD_WIDTH + 16} // Card width + margin
                snapToAlignment="start"
            >
                {features.map((feature, index) => (
                    <FeatureCard key={index} {...feature} />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    bottomFade: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        opacity: 0.65,
    },
    openButtonGradient: {
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
});
