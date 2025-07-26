import { LayoutDashboard, Search } from "lucide-react-native";
import { Image, Text, TextInput, View } from 'react-native';


export default function HomeScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      {/* Top Navigation */}
      <View className="bg-white pt-14 pb-6 px-6 flex-row justify-between items-center shadow-sm">
        <LayoutDashboard size={28} color="#6b7280" />
        <Image
          source={require('@/assets/images/profile.jpg')}
          className="w-10 h-10 rounded-full"
        />
      </View>

      {/* Search Component */}
      <View className="bg-white px-6 pb-4">
        <View className="bg-gray-100 rounded-2xl px-4 py-2 flex-row items-center">
          <Search size={20} color="#6b7280" />
          <TextInput
            placeholder="Search for quiz..."
            placeholderTextColor="#9ca3af"
            className="flex-1 ml-3 text-gray-800 text-base "
          />
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 px-6 py-4">
        {/* Blue Card */}
        <View className="bg-blue-600 rounded-3xl p-8 mb-6 shadow-lg">
          <View className="flex-row justify-between items-start mb-6">
            <View className="flex-1">
              <Text className="text-white text-lg font-medium mb-1">
                Your Progress
              </Text>
              <Text className="text-blue-100 text-sm">
                Keep going, you're doing great!
              </Text>
            </View>
            <View className="bg-white/10 rounded-full p-3">
              <Text className="text-white text-xs font-bold">85%</Text>
            </View>
          </View>

          <View className="bg-white/10 rounded-full h-2 mb-4">
            <View className="bg-white rounded-full h-2 w-4/5" />
          </View>

          <Text className="text-white/80 text-sm">
            12 of 15 lessons completed
          </Text>
        </View>

        <Text className="text-xl font-bold text-blue-500">
          Welcome to Nativewind!
        </Text>
      </View>
    </View>
  );
}

