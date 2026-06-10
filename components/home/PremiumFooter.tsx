import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Facebook, Instagram, Mail, Twitter } from 'lucide-react-native';
import React from 'react';
import { Linking, Text, TouchableOpacity, View } from 'react-native';

export const PremiumFooter = () => {
    return (
        <View className="px-6 py-8 mb-20 items-center">
            <TouchableOpacity
                className="w-full mb-8 active:opacity-90"
                onPress={() => router.push('/contact')}
            >
                <LinearGradient
                    colors={['#3b82f6', '#c084fc', '#e879f9']} // Blue -> Purple -> Pink gradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="w-full rounded-[32px] py-4 px-6 items-center shadow-lg"
                >
                    <Text className="text-white text-lg font-bold mb-1 text-center">
                        Need help getting started?
                    </Text>
                    <Text className="text-white/90 text-sm font-medium text-center">
                        Contact us for support, questions, and feedback.
                    </Text>
                </LinearGradient>
            </TouchableOpacity>

            {/* Learn More Section */}
            <Text className="text-gray-400 text-lg font-semibold mb-1">Learn More</Text>
            <Text className="text-gray-500 text-base mb-6">about us on social media</Text>

            {/* Social Icons */}
            <View className="flex-row gap-6 mb-8">
                <TouchableOpacity onPress={() => Linking.openURL('mailto:support@mydailytherapy.app')}>
                    <Mail size={32} color="#f3f4f6" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => Linking.openURL('https://twitter.com/mydailytherapyapp')}>
                    <Twitter size={32} color="#0ea5e9" fill="#0ea5e9" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => Linking.openURL('https://facebook.com/mydailytherapyapp')}>
                    <Facebook size={32} color="#3b82f6" fill="#3b82f6" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => Linking.openURL('https://instagram.com/mydailytherapyapp')}>
                    <Instagram size={32} color="#f43f5e" />
                </TouchableOpacity>
            </View>

            <Text className="text-gray-600 text-sm">
                My Daily Therapy © 2025
            </Text>
        </View>
    );
};
