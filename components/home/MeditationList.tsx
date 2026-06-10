import { AudioPlayerModal } from '@/components/AudioPlayerModal';
import { Lock, Play } from 'lucide-react-native';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

// Using a reusable component for the list item
const MeditationCard = ({
    title,
    subtitle,
    imageUri,
    isLocked,
    duration,
    onPress
}: {
    title: string;
    subtitle: string;
    imageUri: string;
    isLocked?: boolean;
    duration?: string;
    onPress?: () => void;
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className="flex-row items-center bg-white/5 p-4 rounded-3xl mb-4 border border-white/5"
        >
            <View className="relative">
                <Image
                    source={{ uri: imageUri }}
                    className="w-16 h-16 rounded-2xl"
                    resizeMode="cover"
                />
                {isLocked && (
                    <View className="absolute bottom-[-4px] left-[-4px] bg-black/60 rounded-full p-1 border border-black/20">
                        <Lock size={10} color="white" />
                    </View>
                )}
            </View>

            <View className="flex-1 ml-4 justify-center">
                <Text className="text-white text-lg font-semibold mb-1 leading-tight">{title}</Text>
                <Text className="text-gray-400 text-sm font-medium" numberOfLines={1}>{subtitle}</Text>
            </View>

            <View className="w-10 h-10 bg-white/10 rounded-full items-center justify-center ml-2">
                <Play size={16} color="#3b82f6" fill="#3b82f6" style={{ marginLeft: 2 }} />
            </View>
        </TouchableOpacity>
    );
};

export const MeditationList = ({ onLockedPress }: { onLockedPress?: () => void }) => {
    const meditations = [
        {
            title: "Morning",
            subtitle: "Affirmations for Self Development",
            // Man in green sweater as seen in design
            imageUri: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2000&auto=format&fit=crop",
            isLocked: true,
            uri: "https://pub-fd1c39001c8042ce990acec57b22b34d.r2.dev/mp3/Forest%2015%20minutes.mp3"
        },
        {
            title: "A Fresh Morning",
            subtitle: "a New You!",
            // Woman stretching/yoga
            imageUri: "https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=2000&auto=format&fit=crop",
            isLocked: true,
            uri: "https://pub-fd1c39001c8042ce990acec57b22b34d.r2.dev/mp3/Birds%2015%20minutes.mp3"
        },
        {
            title: "Guided Meditation",
            subtitle: "to End Your Day",
            // Moody dark meditation
            imageUri: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?q=80&w=2000&auto=format&fit=crop",
            isLocked: true,
            uri: "https://pub-fd1c39001c8042ce990acec57b22b34d.r2.dev/mp3/Ocean%20wave%2015%20minutes.mp3"
        }
    ];

    const [selectedTrack, setSelectedTrack] = React.useState<any>(null);

    return (
        <View className="px-6 mb-4">
            {meditations.map((item, index) => (
                <MeditationCard
                    key={index}
                    {...item}
                    onPress={
                        item.isLocked
                            ? onLockedPress
                            : () => setSelectedTrack({
                                id: index.toString(),
                                title: item.title,
                                description: item.subtitle,
                                image: { uri: item.imageUri },
                                uri: item.uri,
                                duration: '5 min',
                            })
                    }
                />
            ))}

            <AudioPlayerModal
                visible={!!selectedTrack}
                track={selectedTrack}
                onClose={() => setSelectedTrack(null)}
            />
        </View>
    );
};
