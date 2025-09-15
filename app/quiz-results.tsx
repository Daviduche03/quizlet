import { router } from 'expo-router';
import {
  CheckCircle,
  Home,
  RotateCcw,
  Share
} from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function QuizResultsScreen() {
  const score = 85;
  const correctAnswers = 21;
  const totalQuestions = 25;

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-6 py-12" showsVerticalScrollIndicator={false}>
        {/* Score Display */}
        <View className="items-center mb-12">
          <View className="bg-green-100 w-24 h-24 rounded-full items-center justify-center mb-6">
            <CheckCircle size={48} color="#10b981" />
          </View>
          
          <Text className="text-4xl font-bold text-gray-900 mb-2">{score}%</Text>
          <Text className="text-gray-600 text-lg mb-4">Great job!</Text>
          <Text className="text-gray-500 text-center">
            You got {correctAnswers} out of {totalQuestions} questions correct
          </Text>
        </View>

        {/* Simple Stats */}
        <View className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-gray-700">Correct Answers</Text>
            <Text className="text-gray-900 font-semibold">{correctAnswers}/{totalQuestions}</Text>
          </View>
          
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-gray-700">Score</Text>
            <Text className="text-green-600 font-semibold">{score}%</Text>
          </View>
          
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-700">Quiz</Text>
            <Text className="text-gray-900 font-semibold">Advanced Mathematics</Text>
          </View>
        </View>

        {/* Message */}
        <View className="bg-blue-50 rounded-2xl p-6 mb-8">
          <Text className="text-blue-900 font-medium text-center">
            Excellent work! You have a solid understanding of the material.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View className="bg-white px-6 py-3 shadow-lg">
        <View className="flex-row space-x-3 gap-2">
          <Pressable 
            className="flex-1 bg-gray-100 rounded-xl py-2 items-center"
            onPress={() => router.push('/quiz')}
          >
            <RotateCcw size={18} color="#6b7280" />
            <Text className="text-gray-700 font-medium mt-1">Retake</Text>
          </Pressable>
        
          
          <Pressable 
            className="flex-1 bg-blue-600 rounded-xl py-2 items-center"
            onPress={() => router.push('/(tabs)')}
          >
            <Home size={18} color="white" />
            <Text className="text-white font-medium mt-1">Home</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}