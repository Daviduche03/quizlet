import { router } from 'expo-router';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag
} from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function QuizTakingScreen() {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const totalQuestions = 2;
  const timeRemaining = "42:15";

  const question = {
    id: 1,
    text: "What is the derivative of f(x) = x³ + 2x² - 5x + 3?",
    options: [
      "3x² + 4x - 5",
      "x⁴ + 2x³ - 5x² + 3x",
      "3x² + 4x + 5",
      "6x + 4"
    ]
  };

  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      // Quiz completed, navigate to results
      router.push('/quiz-results');
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white pt-14 pb-4 px-6 shadow-sm">
        <View className="flex-row items-center justify-between mb-4">
          <Pressable 
            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
            onPress={() => router.back()}
          >
            <ChevronLeft size={20} color="#374151" />
          </Pressable>
          
          <View className="flex-1 mx-4">
            <Text className="text-center text-gray-600 text-sm mb-1">
              Question {currentQuestion} of {totalQuestions}
            </Text>
            <View className="bg-gray-200 rounded-full h-2">
              <View 
                className="bg-blue-600 rounded-full h-2" 
                style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
              />
            </View>
          </View>

          <Pressable className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
            <Flag size={18} color="#6b7280" />
          </Pressable>
        </View>

        {/* Timer */}
        <View className="flex-row items-center justify-center">
          <Clock size={16} color="#f97316" />
          <Text className="text-orange-600 font-semibold ml-2">{timeRemaining}</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        {/* Question */}
        <View className="bg-white rounded-3xl p-6 mb-6 shadow-sm border border-gray-100">
          <Text className="text-gray-900 text-xl font-semibold leading-relaxed">
            {question.text}
          </Text>
        </View>

        {/* Answer Options */}
        <View className="space-y-4 mb-8 gap-2">
          {question.options.map((option, index) => (
            <Pressable
              key={index}
              className={`rounded-2xl p-5 border-2 ${
                selectedAnswer === index
                  ? 'bg-blue-50 border-blue-500'
                  : 'bg-white border-gray-200'
              }`}
              onPress={() => setSelectedAnswer(index)}
            >
              <View className="flex-row items-center">
                <View
                  className={`w-6 h-6 rounded-full border-2 mr-4 items-center justify-center ${
                    selectedAnswer === index
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedAnswer === index && (
                    <View className="w-2 h-2 bg-white rounded-full" />
                  )}
                </View>
                <Text
                  className={`text-base flex-1 ${
                    selectedAnswer === index ? 'text-blue-900 font-medium' : 'text-gray-800'
                  }`}
                >
                  {option}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View className="bg-white px-6 py-4 shadow-lg">
        <View className="flex-row space-x-4 gap-2">
          <Pressable className="flex-1 bg-gray-100 rounded-2xl py-4 items-center">
            <Text className="text-gray-700 font-semibold">Previous</Text>
          </Pressable>
          
          <Pressable 
            className={`flex-1 rounded-2xl py-4 flex-row items-center justify-center ${
              selectedAnswer !== null ? 'bg-blue-600' : 'bg-gray-300'
            }`}
            onPress={handleNextQuestion}
            disabled={selectedAnswer === null}
          >
            <Text className={`font-semibold mr-2 ${
              selectedAnswer !== null ? 'text-white' : 'text-gray-500'
            }`}>
              {currentQuestion === totalQuestions ? 'Finish' : 'Next'}
            </Text>
            <ChevronRight size={16} color={selectedAnswer !== null ? 'white' : '#6b7280'} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}