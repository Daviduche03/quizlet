import { AudioPlayerModal } from '@/components/AudioPlayerModal';
import { Lock, Play } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const SoundscapeCard = ({
    title,
    imageUri,
    isLocked,
    onPress
}: {
    title: string;
    imageUri: string;
    isLocked?: boolean;
    onPress?: () => void;
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className="mr-4 bg-white/5 rounded-[32px] p-0 w-[280px] overflow-hidden border border-white/5"
        >
            <View className="h-[200px] w-full relative">
                <Image
                    source={{ uri: imageUri }}
                    className="w-full h-full"
                    resizeMode="cover"
                />
                <View className="absolute inset-0 items-center justify-center bg-black/10">
                    <View className="w-16 h-16 bg-white rounded-full items-center justify-center shadow-lg">
                        {isLocked ? (
                            <Lock size={24} color="black" strokeWidth={2.6} />
                        ) : (
                            <Play size={24} color="black" fill="black" style={{ marginLeft: 3 }} />
                        )}
                    </View>
                </View>
            </View>
            <View className="p-5">
                <Text className="text-white/90 text-2xl font-semibold">{title}</Text>
            </View>
        </TouchableOpacity>
    );
};

export const SoundscapesRail = ({ onLockedPress }: { onLockedPress?: () => void }) => {
    const items = [
        {
            title: "Forest",
            imageUri: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000&auto=format&fit=crop",
            isLocked: true,
            uri: "https://pub-fd1c39001c8042ce990acec57b22b34d.r2.dev/mp3/Forest%2015%20minutes.mp3"
        },
        {
            title: "Birds",
            imageUri: "https://images.unsplash.com/photo-1444464666168-49d633b86797?q=80&w=2000&auto=format&fit=crop",
            isLocked: true,
            uri: "https://pub-fd1c39001c8042ce990acec57b22b34d.r2.dev/mp3/Birds%2015%20minutes.mp3"
        },
        {
            title: "Forest Birds",
            imageUri: "https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=2000&auto=format&fit=crop",
            isLocked: true,
            uri: "https://pub-fd1c39001c8042ce990acec57b22b34d.r2.dev/mp3/Forest%20birds%2015%20minutes.mp3"
        },
        {
            title: "Forest Rain",
            imageUri: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000&auto=format&fit=crop",
            isLocked: true,
            uri: "https://pub-fd1c39001c8042ce990acec57b22b34d.r2.dev/mp3/Forest%20rain%2015%20minutes.mp3"
        },
        {
            title: "Heavy Rain",
            imageUri: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=2000&auto=format&fit=crop",
            isLocked: true,
            uri: "https://pub-fd1c39001c8042ce990acec57b22b34d.r2.dev/mp3/Heavy%20Rain%2015%20minutes.mp3"
        },
        {
            title: "Ocean Wave",
            imageUri: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop",
            isLocked: true,
            uri: "https://pub-fd1c39001c8042ce990acec57b22b34d.r2.dev/mp3/Ocean%20wave%2015%20minutes.mp3"
        },
        {
            title: "Rain",
            imageUri: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=2000&auto=format&fit=crop",
            isLocked: true,
            uri: "https://pub-fd1c39001c8042ce990acec57b22b34d.r2.dev/mp3/Rain%2015%20minutes.mp3"
        },
        {
            title: "Stream",
            imageUri: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2000&auto=format&fit=crop",
            isLocked: true,
            uri: "https://pub-fd1c39001c8042ce990acec57b22b34d.r2.dev/mp3/Stream%2015%20minutes.mp3"
        },
        {
            title: "Waterfall",
            imageUri: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=2000&auto=format&fit=crop",
            isLocked: true,
            uri: "https://pub-fd1c39001c8042ce990acec57b22b34d.r2.dev/mp3/Waterfall%2015%20minutes.mp3"
        }
    ];

    const [selectedTrack, setSelectedTrack] = React.useState<any>(null);

    return (
        <View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: 24, paddingRight: 8 }}
                className="mb-8"
                decelerationRate="fast"
                snapToInterval={296} // 280 width + 16 margin
            >
                {items.map((item, index) => (
                    <SoundscapeCard
                        key={index}
                        {...item}
                        onPress={
                            item.isLocked
                                ? onLockedPress
                                : () => setSelectedTrack({
                                    id: `s-${index}`,
                                    title: item.title,
                                    description: 'Relaxing sounds',
                                    image: { uri: item.imageUri },
                                    uri: item.uri,
                                    duration: '∞',
                                })
                        }
                    />
                ))}
            </ScrollView>

            <AudioPlayerModal
                visible={!!selectedTrack}
                track={selectedTrack}
                onClose={() => setSelectedTrack(null)}
            />
        </View>
    );
};
