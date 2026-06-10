import { router } from 'expo-router';
import { Lock } from 'lucide-react-native';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';

export const JournalCard = ({ onLockedPress }: { onLockedPress?: () => void }) => {
    return (
        <TouchableOpacity
            className="px-6 mb-8"
            activeOpacity={0.9}
            onPress={onLockedPress ?? (() => router.push('/journal'))}
        >
            <View className="h-[320px] w-full rounded-[32px] overflow-hidden bg-gray-800 relative">
                <ImageBackground
                    source={{ uri: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=2070&auto=format&fit=crop' }}
                    className="flex-1 justify-center items-center"
                    resizeMode="cover"
                >
                    <View className="absolute inset-0 bg-black/20" />

                    <View className="items-center justify-center">
                        <Text className="text-white/90 text-5xl font-bold tracking-tighter opacity-80">Journal</Text>
                    </View>

                    <View className="absolute bottom-6 left-6 flex-row items-center">
                        <Text className="text-white text-xl font-semibold mr-2">Journal</Text>
                        <Lock size={16} color="white" strokeWidth={3} />
                    </View>
                </ImageBackground>
            </View>
        </TouchableOpacity>
    );
};
