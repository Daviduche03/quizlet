import {
  Award,
  BarChart3,
  Bell,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit3,
  HelpCircle,
  LogOut,
  Settings,
  Shield,
  TrendingUp
} from 'lucide-react-native';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white pt-14 pb-6 px-6 flex-row justify-between items-center shadow-sm">
        <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
          <ChevronLeft size={20} color="#6b7280" />
        </View>
        <Text className="text-lg font-semibold text-gray-800">Profile</Text>
        <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
          <Settings size={20} color="#6b7280" />
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View className="bg-white mx-6 mt-6 rounded-3xl p-6 shadow-sm border border-gray-100">
          <View className="items-center mb-6">
            <View className="relative">
              <Image 
                source={require('@/assets/images/profile.avif')} 
                className="w-24 h-24 rounded-full border-4 border-blue-100"
              />
              <View className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-2">
                <Edit3 size={14} color="white" />
              </View>
            </View>
            <Text className="text-xl font-bold text-gray-800 mt-4">Sarah Johnson</Text>
            <Text className="text-gray-500 text-base">sarah.johnson@email.com</Text>
            <View className="bg-blue-100 px-4 py-2 rounded-full mt-3">
              <Text className="text-blue-600 font-semibold text-sm">Premium Member</Text>
            </View>
          </View>

          {/* Stats */}
          <View className="flex-row justify-between">
            <View className="items-center flex-1">
              <View className="bg-orange-100 rounded-full p-3 mb-2">
                <Award size={20} color="#f97316" />
              </View>
              <Text className="text-gray-800 font-bold text-lg">24</Text>
              <Text className="text-gray-500 text-sm">Achievements</Text>
            </View>
            <View className="items-center flex-1">
              <View className="bg-green-100 rounded-full p-3 mb-2">
                <BookOpen size={20} color="#10b981" />
              </View>
              <Text className="text-gray-800 font-bold text-lg">156</Text>
              <Text className="text-gray-500 text-sm">Quizzes</Text>
            </View>
            <View className="items-center flex-1">
              <View className="bg-purple-100 rounded-full p-3 mb-2">
                <TrendingUp size={20} color="#8b5cf6" />
              </View>
              <Text className="text-gray-800 font-bold text-lg">89%</Text>
              <Text className="text-gray-500 text-sm">Avg Score</Text>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View className="bg-white mx-6 mt-6 rounded-3xl p-6 shadow-sm border border-gray-100">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</Text>
          
          <View className="space-y-4 gap-3">
            <View className="flex-row items-center">
              <View className="bg-blue-100 rounded-full p-2 mr-3">
                <Award size={16} color="#3b82f6" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 font-medium">Earned "Math Master" badge</Text>
                <Text className="text-gray-500 text-sm">2 hours ago</Text>
              </View>
            </View>
            
            <View className="flex-row items-center">
              <View className="bg-green-100 rounded-full p-2 mr-3">
                <BookOpen size={16} color="#10b981" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 font-medium">Completed Chemistry Quiz</Text>
                <Text className="text-gray-500 text-sm">5 hours ago</Text>
              </View>
            </View>
            
            <View className="flex-row items-center">
              <View className="bg-orange-100 rounded-full p-2 mr-3">
                <Clock size={16} color="#f97316" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 font-medium">7-day streak milestone</Text>
                <Text className="text-gray-500 text-sm">1 day ago</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Menu Options */}
        <View className="bg-white mx-6 mt-6 rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <Pressable className="flex-row items-center px-6 py-4 border-b border-gray-100">
            <View className="bg-orange-100 rounded-full p-2 mr-4">
              <BarChart3 size={18} color="#f97316" />
            </View>
            <Text className="flex-1 text-gray-800 font-medium">Analytics</Text>
            <ChevronRight size={18} color="#9ca3af" />
          </Pressable>
          
          <Pressable className="flex-row items-center px-6 py-4 border-b border-gray-100">
            <View className="bg-blue-100 rounded-full p-2 mr-4">
              <Bell size={18} color="#3b82f6" />
            </View>
            <Text className="flex-1 text-gray-800 font-medium">Notifications</Text>
            <ChevronRight size={18} color="#9ca3af" />
          </Pressable>
          
          <Pressable className="flex-row items-center px-6 py-4 border-b border-gray-100">
            <View className="bg-purple-100 rounded-full p-2 mr-4">
              <Shield size={18} color="#8b5cf6" />
            </View>
            <Text className="flex-1 text-gray-800 font-medium">Privacy & Security</Text>
            <ChevronRight size={18} color="#9ca3af" />
          </Pressable>
          
          <Pressable className="flex-row items-center px-6 py-4 border-b border-gray-100">
            <View className="bg-green-100 rounded-full p-2 mr-4">
              <HelpCircle size={18} color="#10b981" />
            </View>
            <Text className="flex-1 text-gray-800 font-medium">Help & Support</Text>
            <ChevronRight size={18} color="#9ca3af" />
          </Pressable>
          
          <Pressable className="flex-row items-center px-6 py-4">
            <View className="bg-red-100 rounded-full p-2 mr-4">
              <LogOut size={18} color="#ef4444" />
            </View>
            <Text className="flex-1 text-red-600 font-medium">Sign Out</Text>
            <ChevronRight size={18} color="#9ca3af" />
          </Pressable>
        </View>

        {/* Bottom Spacing */}
        <View className="h-6" />
      </ScrollView>
    </View>
  );
}