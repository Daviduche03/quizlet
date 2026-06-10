import { ChevronRight } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

interface SectionHeaderProps {
    title: string;
    onPress?: () => void;
}

export const SectionHeader = ({ title, onPress }: SectionHeaderProps) => {
    return (
        <View className="flex-row justify-between items-center px-6 mb-4">
            <Text className="text-white/90 text-2xl font-bold tracking-tight">{title}</Text>
            <TouchableOpacity onPress={onPress} className="flex-row items-center">
                <Text className="text-blue-400 text-base font-semibold mr-1">See All</Text>
                <ChevronRight size={16} color="#60a5fa" />
            </TouchableOpacity>
        </View>
    );
};
