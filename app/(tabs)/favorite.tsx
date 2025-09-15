import {
    BookOpen,
    ChevronRight,
    Clock,
    Heart,
    Search,
    Star
} from 'lucide-react-native';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

export default function FavoritesScreen() {
    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-white pt-14 pb-6 px-6 shadow-sm">
                <Text className="text-2xl font-bold text-gray-800 mb-4">Favorites</Text>

                {/* Search Bar */}
                <View className="bg-gray-100 rounded-2xl px-4 py-2 flex-row items-center">
                    <Search size={18} color="#6b7280" />
                    <TextInput
                        placeholder="Search your favorites..."
                        placeholderTextColor="#9ca3af"
                        className="flex-1 ml-3 text-gray-800"
                    />
                </View>
            </View>
            <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
                {/* Favorite Quizzes */}
                <Text className="text-lg font-semibold text-gray-800 mb-4">Saved Quizzes</Text>

                <View className="space-y-3 gap-2">
                    {/* Quiz Item 1 */}
                    <Pressable className="bg-white rounded-2xl p-4 shadow-sm flex-row items-center">
                        <View className="bg-orange-100 rounded-xl p-3 mr-4">
                            <BookOpen size={20} color="#f97316" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-800 font-semibold text-base mb-1">Advanced Mathematics</Text>
                            <Text className="text-gray-500 text-sm mb-1">Calculus & Algebra • 25 questions</Text>
                            <View className="flex-row items-center">
                                <Star size={12} color="#fbbf24" />
                                <Text className="text-gray-600 text-xs ml-1">4.8</Text>
                                <Clock size={12} color="#6b7280" className="ml-3" />
                                <Text className="text-gray-600 text-xs ml-1">45 min</Text>
                            </View>
                        </View>
                        <Heart size={18} color="#ef4444" />
                    </Pressable>

                    {/* Quiz Item 2 */}
                    <Pressable className="bg-white rounded-2xl p-4 shadow-sm flex-row items-center">
                        <View className="bg-blue-100 rounded-xl p-3 mr-4">
                            <BookOpen size={20} color="#3b82f6" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-800 font-semibold text-base mb-1">World History</Text>
                            <Text className="text-gray-500 text-sm mb-1">Ancient Civilizations • 20 questions</Text>
                            <View className="flex-row items-center">
                                <Star size={12} color="#fbbf24" />
                                <Text className="text-gray-600 text-xs ml-1">4.6</Text>
                                <Clock size={12} color="#6b7280" className="ml-3" />
                                <Text className="text-gray-600 text-xs ml-1">30 min</Text>
                            </View>
                        </View>
                        <Heart size={18} color="#ef4444" />
                    </Pressable>

                    {/* Quiz Item 3 */}
                    <Pressable className="bg-white rounded-2xl p-4 shadow-sm flex-row items-center">
                        <View className="bg-green-100 rounded-xl p-3 mr-4">
                            <BookOpen size={20} color="#10b981" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-800 font-semibold text-base mb-1">Science Fundamentals</Text>
                            <Text className="text-gray-500 text-sm mb-1">Physics & Chemistry • 18 questions</Text>
                            <View className="flex-row items-center">
                                <Star size={12} color="#fbbf24" />
                                <Text className="text-gray-600 text-xs ml-1">4.9</Text>
                                <Clock size={12} color="#6b7280" className="ml-3" />
                                <Text className="text-gray-600 text-xs ml-1">25 min</Text>
                            </View>
                        </View>
                        <Heart size={18} color="#ef4444" />
                    </Pressable>

                    {/* Quiz Item 4 */}
                    <Pressable className="bg-white rounded-2xl p-4 shadow-sm flex-row items-center">
                        <View className="bg-purple-100 rounded-xl p-3 mr-4">
                            <BookOpen size={20} color="#8b5cf6" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-800 font-semibold text-base mb-1">Literature Classics</Text>
                            <Text className="text-gray-500 text-sm mb-1">Shakespeare & Poetry • 15 questions</Text>
                            <View className="flex-row items-center">
                                <Star size={12} color="#fbbf24" />
                                <Text className="text-gray-600 text-xs ml-1">4.7</Text>
                                <Clock size={12} color="#6b7280" className="ml-3" />
                                <Text className="text-gray-600 text-xs ml-1">20 min</Text>
                            </View>
                        </View>
                        <Heart size={18} color="#ef4444" />
                    </Pressable>
                </View>

                {/* Recent Favorites */}
                <Text className="text-lg font-semibold text-gray-800 mb-4 mt-6">Recently Added</Text>

                <View className="space-y-3 gap-2">
                    <Pressable className="bg-white rounded-xl p-4 shadow-sm flex-row items-center">
                        <BookOpen size={20} color="#3b82f6" />
                        <View className="flex-1 ml-3">
                            <Text className="text-gray-800 font-medium">Literature Quiz</Text>
                            <Text className="text-gray-500 text-sm">Shakespeare & Poetry</Text>
                        </View>
                        <ChevronRight size={16} color="#9ca3af" />
                    </Pressable>

                    <Pressable className="bg-white rounded-xl p-4 shadow-sm flex-row items-center">
                        <BookOpen size={20} color="#10b981" />
                        <View className="flex-1 ml-3">
                            <Text className="text-gray-800 font-medium">Geography Challenge</Text>
                            <Text className="text-gray-500 text-sm">World Capitals</Text>
                        </View>
                        <ChevronRight size={16} color="#9ca3af" />
                    </Pressable>

                    <Pressable className="bg-white rounded-xl p-4 shadow-sm flex-row items-center">
                        <BookOpen size={20} color="#f97316" />
                        <View className="flex-1 ml-3">
                            <Text className="text-gray-800 font-medium">Art History</Text>
                            <Text className="text-gray-500 text-sm">Renaissance Masters</Text>
                        </View>
                        <ChevronRight size={16} color="#9ca3af" />
                    </Pressable>
                </View>

                {/* Bottom Spacing */}
                <View className="h-6" />
            </ScrollView>
        </View>
    );
}