import { router } from 'expo-router';
import { Bell, Phone } from 'lucide-react-native';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

export const GreetingHeader = () => {
    const currentDate = new Date();
    const dateString = currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
    });

    // Determine greeting based on time of day
    const hour = currentDate.getHours();
    let greeting = "Good Morning";
    if (hour >= 12 && hour < 17) {
        greeting = "Good Afternoon";
    } else if (hour >= 17) {
        greeting = "Good Night";
    }

    return (
        <View className="px-6 pt-14 pb-6">
            <View className="flex-row justify-between items-center mb-6">
                <TouchableOpacity
                    className="w-12 h-12 bg-white/5 rounded-full items-center justify-center border border-white/10"
                    onPress={() => router.push('/contact')}
                >
                    <Phone size={24} color="#9ca3af" />
                </TouchableOpacity>

                <TouchableOpacity
                    className="w-12 h-12 bg-white/5 rounded-full items-center justify-center border border-white/10"
                    onPress={() => Alert.alert('Notifications', 'Notifications are not available yet. You can contact support from the profile tab.')}
                >
                    <Bell size={24} color="#c084fc" />
                </TouchableOpacity>
            </View>

            <View>
                <Text className="text-white text-4xl font-bold mb-1 tracking-tight">{greeting}</Text>
                <Text className="text-gray-400 text-lg font-medium">{dateString}</Text>
            </View>
        </View>
    );
};
