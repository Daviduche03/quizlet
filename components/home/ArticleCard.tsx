import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';

export const ArticleCard = () => {
    return (
        <TouchableOpacity
            className="px-6 pb-32"
            activeOpacity={0.9}
            onPress={() => router.push('/discover')}
        >
            <View className="h-[240px] w-full rounded-[32px] overflow-hidden relative shadow-lg bg-[#2c2c2e]">
                <ImageBackground
                    source={{ uri: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2000&auto=format&fit=crop' }}
                    className="flex-1"
                    resizeMode="cover"
                >
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '50%',
                            justifyContent: 'flex-end',
                            padding: 24
                        }}
                    >
                        <Text className="text-white text-lg font-bold leading-6 mb-1">
                            Why Processed Meat Poses a Significant Risk to Heart...
                        </Text>
                        <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                            Nutrition • 5 min read
                        </Text>
                    </LinearGradient>
                </ImageBackground>
            </View>
        </TouchableOpacity>
    );
};
