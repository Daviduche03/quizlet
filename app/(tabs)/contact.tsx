import { Stack, router } from 'expo-router';
import { ChevronLeft, Facebook, Instagram, Mail, Twitter } from 'lucide-react-native';
import React from 'react';
import {
    Linking,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SocialButton = ({
    icon: Icon,
    label,
    bgColor,
    textColor = 'white',
    iconColor = 'white',
    onPress
}: {
    icon: any,
    label: string,
    bgColor: string,
    textColor?: string,
    iconColor?: string,
    onPress: () => void
}) => (
    <TouchableOpacity
        onPress={onPress}
        className="w-full h-14 rounded-full flex-row items-center justify-center mb-4"
        style={{ backgroundColor: bgColor }}
        activeOpacity={0.8}
    >
        <Icon size={20} color={iconColor} strokeWidth={2.5} />
        <Text className="text-base font-bold ml-3" style={{ color: textColor }}>{label}</Text>
    </TouchableOpacity>
);

export default function ContactScreen() {
    const insets = useSafeAreaInsets();

    const handlePress = (url: string) => {
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    };

    return (
        <View className="flex-1 bg-[#1c1c1e]">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Back Button */}
            <View
                style={{ paddingTop: insets.top + 10 }}
                className="flex-row items-center px-6"
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 rounded-full bg-[#2c2c2e] items-center justify-center"
                >
                    <ChevronLeft size={24} color="white" />
                </TouchableOpacity>
            </View>

            <View className="flex-1 px-8 items-center pt-10">
                {/* Logo / Icon Placeholder */}
                <View className="w-32 h-32 bg-white rounded-3xl items-center justify-center mb-6 shadow-lg">
                    {/* Simplified textual logo representation or actual logo if available */}
                    <Text className="text-black text-xs font-bold text-center tracking-widest leading-4">
                        D A I L Y{'\n'}THERAPY
                    </Text>
                    {/* Decorative arcs could be added via SVG if strictly needed, but text is fine for MVP */}
                </View>

                <Text className="text-white text-3xl font-bold mb-2">Contact us</Text>
                <Text className="text-gray-400 text-sm font-semibold mb-12">Feedback? Request? Get in touch?</Text>

                {/* Buttons */}
                <SocialButton
                    icon={Facebook}
                    label="Facebook"
                    bgColor="#007AFF" // System Blue or Facebook Blue
                    onPress={() => handlePress('https://facebook.com')}
                />

                <SocialButton
                    icon={Twitter}
                    label="Twitter"
                    bgColor="#00C7BE" // Cyan/Teal
                    onPress={() => handlePress('https://twitter.com')}
                />

                <SocialButton
                    icon={Instagram}
                    label="Instagram"
                    // Screenshot shows white text on light bg? Wait, screenshot has white/light button with white text? No, usually black text on light bg.
                    // Screenshot actually shows: White button, text is somewhat visible... wait.
                    // Ah, the text "Instagram" is White in the screenshot? No, it looks like the button is white, text is... hard to see or maybe light grey?
                    // Let's assume standard UI: White button -> Black Text.
                    // BUT current app theme is dark.
                    // Screenshot shows: White button. Let's use Black text for contrast.
                    // Wait, I see the screenshot text "Instagram" is slightly readable. It might be a gradient or just bad contrast in the mock.
                    // I'll make it White bg, Black text.
                    bgColor="#E5E5EA"
                    textColor="black"
                    iconColor="black"
                    onPress={() => handlePress('https://instagram.com')}
                />

                <SocialButton
                    icon={Mail}
                    label="Email"
                    bgColor="#007AFF"
                    onPress={() => handlePress('mailto:support@dailytherapy.com')}
                />

            </View>

            {/* Bottom Tab Bar Placeholder handled by layout */}
        </View>
    );
}
