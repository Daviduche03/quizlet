import { router } from "expo-router";
import { Atom, BookOpen, Calculator, ChevronRight, Clock, Globe, LayoutDashboard, Palette, Search } from "lucide-react-native";
import { useEffect } from "react";
import { Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from "react-native-reanimated";

const AnimatedCategoryCard = ({ children, index, onPress }: { children: React.ReactNode; index: number; onPress?: () => void }) => {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    // Staggered entrance animation
    const delay = index * 100;
    setTimeout(() => {
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 200,
      });
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 150,
      });
    }, delay);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateY: translateY.value }
      ],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95, {
      damping: 15,
      stiffness: 200,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 200,
    });
  };

  const handlePress = () => {
    scale.value = withSpring(0.9, {
      damping: 20,
      stiffness: 300,
    });
    setTimeout(() => {
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 200,
      });
      onPress?.();
    }, 100);
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
    >
      <Animated.View style={animatedStyle}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

export default function HomeScreen() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95, {
      damping: 15,
      stiffness: 150,
    });
    opacity.value = withTiming(0.8, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
    opacity.value = withTiming(1, { duration: 100 });
  };

  const handlePress = () => {
    // Add haptic feedback
    scale.value = withSpring(0.98, {
      damping: 20,
      stiffness: 200,
    });
    setTimeout(() => {
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 150,
      });
    }, 100);
  };

  interface CategoryCardProps {
    icon: React.ReactNode;
    title: string;
    color: string;
    topic: string;
    quizCount: number;
  }

  interface SubjectCardProps {
    icon: React.ReactNode;
    subject: string;
    color: string;
    topic: string;
    quizCount: number;
    duration: string;
    completed: string;
  }

  const categories: CategoryCardProps[] = [
    {
      icon: <Atom size={24} color="#10b981" />,
      title: "Science",
      color: "#fde047",
      topic: "Physics & Chemistry",
      quizCount: 12
    },
    {
      icon: <Calculator size={24} color="#f97316" />,
      title: "Mathematics",
      color: "#f43f5e",
      topic: "Algebra & Geometry",
      quizCount: 9
    },
    {
      icon: <Globe size={24} color="#3b82f6" />,
      title: "Geography",
      color: "#f59e0b",
      topic: "World & Countries",
      quizCount: 20
    },
    {
      icon: <Palette size={24} color="#8b5cf6" />,
      title: "Art History",
      color: "#14b8a6",
      topic: "Renaissance & Modern",
      quizCount: 18
    },
    {
      icon: <BookOpen size={24} color="#ec4899" />,
      title: "Literature",
      color: "#3b82f6",
      topic: "Classic & Poetry",
      quizCount: 12
    },
    {
      icon: <Clock size={24} color="#6366f1" />,
      title: "Philosophy",
      color: "#10b981",
      topic: "Ethics & Logic",
      quizCount: 12
    },
  ];

  const subjects: SubjectCardProps[] = [
    {
      icon: <Atom size={24} color="#10b981" />,
      subject: "Physics",
      color: "#fde047",
      topic: "Quantum particles",
      quizCount: 12,
      duration: "5 hours",
      completed: "50%"
    },
    {
      icon: <Calculator size={24} color="#f97316" />,
      subject: "Mathematics",
      color: "#f43f5e",
      topic: "Algebra & Geometry",
      quizCount: 9,
      duration: "5 hours",
      completed: "50%"
    },
    {
      icon: <Globe size={24} color="#3b82f6" />,
      subject: "Geography",
      color: "#f59e0b",
      topic: "World & Countries",
      quizCount: 20,
      duration: "5 hours",
      completed: "50%"
    },
    {
      icon: <Palette size={24} color="#8b5cf6" />,
      subject: "Art History",
      color: "#14b8a6",
      topic: "Renaissance & Modern",
      quizCount: 18,
      duration: "5 hours",
      completed: "50%"
    },
    {
      icon: <BookOpen size={24} color="#ec4899" />,
      subject: "Literature",
      color: "#3b82f6",
      topic: "Classic & Poetry",
      quizCount: 12,
      duration: "5 hours",
      completed: "50%"
    },
    {
      icon: <Clock size={24} color="#6366f1" />,
      subject: "Philosophy",
      color: "#10b981",
      topic: "Ethics & Logic",
      quizCount: 12,
      duration: "5 hours",
      completed: "50%"
    },

  ]

  return (
    <View className="flex-1 bg-gray-50">
      {/* Top Navigation */}
      <View className="bg-white pt-14 pb-6 px-6 flex-row justify-between items-center shadow-sm">
        <LayoutDashboard size={28} color="#6b7280" />
        <Image
          source={require('@/assets/images/profile.avif')}
          className="w-10 h-10 rounded-full border border-blue-600 "
        />
      </View>

      {/* Search Component */}
      <View className="bg-white px-6 pb-4">
        <View className="bg-gray-100 rounded-3xl px-4 py-2 flex-row items-center">
          <Search size={20} color="#6b7280" />
          <TextInput
            placeholder="Search for quiz..."
            placeholderTextColor="#9ca3af"
            className="flex-1 ml-3 text-gray-800 text-base "
          />
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-4">
          {/* Blue Card */}
          <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
          >
            <Animated.View
              style={animatedStyle}
              className="bg-blue-600 rounded-3xl p-8 mb-6 shadow-lg"
            >
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
            </Animated.View>
          </Pressable>

          {/* Categories Section */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-800">Categories</Text>
              <Text className="text-base font-semibold text-blue-600">See all</Text>
            </View>

            <Animated.ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 24 }}
              onScroll={scrollHandler}
              scrollEventThrottle={16}
              decelerationRate="fast"
              snapToInterval={180}
              snapToAlignment="start"
            >
              {categories.map((category: CategoryCardProps, index) => (
                <AnimatedCategoryCard 
                  key={index} 
                  index={index}
                  onPress={() => router.push('/quiz')}
                >
                  <View className="bg-white rounded-3xl p-6 mr-4 shadow-sm border border-gray-100 min-w-[160px]">
                    <View className="flex-row items-center justify-between mb-4">
                      {category.icon}
                      <Text className="text-sm text-gray-400">{category.quizCount}</Text>
                    </View>
                    <Text className="text-gray-800 font-semibold text-lg">{category.title}</Text>
                    <Text className="text-gray-500 text-base">{category.topic}</Text>
                  </View>
                </AnimatedCategoryCard>
              ))}
            </Animated.ScrollView>
          </View>

          {/* Recent Subjects Section */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-800">Recent Subjects</Text>
              <Text className="text-base font-semibold text-blue-600">View all</Text>
            </View>

            <View className="space-y-3 gap-3">
              {subjects.map((subject: SubjectCardProps, index) => (
                <Pressable 
                  className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100" 
                  key={index}
                  onPress={() => router.push('/quiz')}
                >
                  <View className="flex-row items-center">
                    <View className="bg-orange-100 rounded-xl p-3 mr-4">
                      {subject.icon}
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-800 font-semibold text-base mb-1">
                        {subject.topic}
                      </Text>
                      <Text className="text-gray-500 text-sm mb-2">
                        {subject.subject} • {subject.quizCount} questions
                      </Text>
                      <View className="flex-row items-center">
                        <Clock size={14} color="#6b7280" />
                        <Text className="text-gray-400 text-xs ml-1">{subject.duration}</Text>
                      </View>
                    </View>
                    <View className="items-center">
                      <Text className="text-green-600 font-bold text-sm mb-1">{subject.completed}</Text>
                      <ChevronRight size={16} color="#9ca3af" />
                    </View>
                  </View>
                </Pressable>

              ))
              }
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

