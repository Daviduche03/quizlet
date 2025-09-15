import { router } from 'expo-router';
import {
  BookOpen,
  ChevronLeft,
  Heart,
  Play,
  Star
} from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function QuizScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white pt-14 pb-4 px-6 flex-row items-center justify-between">
        <Pressable
          className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
          onPress={() => router.back()}
        >
          <ChevronLeft size={20} color="#374151" />
        </Pressable>
        <View className="flex-row space-x-3">
          <Pressable className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
            <Heart size={18} color="#6b7280" />
          </Pressable>
          
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Quiz Hero Section */}
        <View className="px-6 pt-4 pb-8">
          <View className="mb-6">
            <View className="bg-orange-100 w-16 h-16 rounded-2xl items-center justify-center mb-4">
              <BookOpen size={28} color="#f97316" />
            </View>
            <Text className="text-gray-900 text-3xl font-bold mb-3">
              Advanced Mathematics
            </Text>
            <Text className="text-gray-600 text-lg leading-relaxed">
              Master calculus, algebra, and advanced mathematical concepts through interactive problems
            </Text>
          </View>

          {/* Stats Cards */}
          <View className="flex-row space-x-3 mb-8 gap-1.5">
            <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <Text className="text-gray-900 text-2xl font-bold mb-1">25</Text>
              <Text className="text-gray-500 text-sm">Questions</Text>
            </View>
            <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <Text className="text-gray-900 text-2xl font-bold mb-1">45</Text>
              <Text className="text-gray-500 text-sm">Minutes</Text>
            </View>
            <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <View className="flex-row items-center mb-1">
                <Star size={16} color="#fbbf24" />
                <Text className="text-gray-900 text-2xl font-bold ml-1">4.8</Text>
              </View>
              <Text className="text-gray-500 text-sm">Rating</Text>
            </View>
          </View>

          {/* Start Button */}
          <Pressable 
            className="bg-blue-600 rounded-2xl py-4 flex-row items-center justify-center shadow-lg"
            onPress={() => router.push('/quiz-taking')}
          >
            <Play size={22} color="white" />
            <Text className="text-white font-bold text-lg ml-3">Start Quiz</Text>
          </Pressable>
        </View>

       
        {/* Topics Covered */}
        <View className="bg-white mx-6 mt-2 rounded-3xl p-6 shadow-sm border border-gray-100">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Topics Covered</Text>

          <View className="flex-row flex-wrap gap-2">
            <View className="bg-blue-100 px-3 py-2 rounded-full">
              <Text className="text-blue-700 text-sm font-medium">Calculus</Text>
            </View>
            <View className="bg-green-100 px-3 py-2 rounded-full">
              <Text className="text-green-700 text-sm font-medium">Linear Algebra</Text>
            </View>
            <View className="bg-orange-100 px-3 py-2 rounded-full">
              <Text className="text-orange-700 text-sm font-medium">Derivatives</Text>
            </View>
            <View className="bg-purple-100 px-3 py-2 rounded-full">
              <Text className="text-purple-700 text-sm font-medium">Integrals</Text>
            </View>
            <View className="bg-pink-100 px-3 py-2 rounded-full">
              <Text className="text-pink-700 text-sm font-medium">Functions</Text>
            </View>
            <View className="bg-indigo-100 px-3 py-2 rounded-full">
              <Text className="text-indigo-700 text-sm font-medium">Limits</Text>
            </View>
          </View>
        </View>

      
      
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="bg-white px-6 py-4 shadow-lg">
        <Pressable 
          className="bg-blue-600 rounded-2xl py-4 flex-row items-center justify-center"
          onPress={() => router.push('/quiz-taking')}
        >
          <Play size={20} color="white" />
          <Text className="text-white font-bold text-lg ml-2">Start Quiz Now</Text>
        </Pressable>
      </View>
    </View>
  );
}