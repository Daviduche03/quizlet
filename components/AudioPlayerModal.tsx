import { Ionicons } from '@expo/vector-icons';
import { Audio, AVPlaybackStatus } from 'expo-av';
import React, { useEffect, useState } from 'react';
import {
    Image,
    Modal,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AudioTrack {
    id: string;
    title: string;
    description?: string;
    image: any;
    uri?: string; // Optional for now, will fallback to a default if missing
    duration?: string;
    type?: string;
}

interface AudioPlayerModalProps {
    visible: boolean;
    track: AudioTrack | null;
    onClose: () => void;
    onNext?: () => void;
    onPrevious?: () => void;
}

// Sample audio for testing since we don't have local assets yet
const DEFAULT_AUDIO_URI = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

export function AudioPlayerModal({ visible, track, onClose, onNext, onPrevious }: AudioPlayerModalProps) {
    const insets = useSafeAreaInsets();
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const canGoPrevious = typeof onPrevious === 'function';
    const canGoNext = typeof onNext === 'function';

    useEffect(() => {
        if (!visible) return;
        StatusBar.setHidden(true, 'fade');
        return () => {
            StatusBar.setHidden(false, 'fade');
        };
    }, [visible]);

    useEffect(() => {
        if (visible && track) {
            loadAudio();
        } else {
            stopAudio();
        }
    }, [visible, track]);

    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);


    async function loadAudio() {
        try {
            if (sound) {
                await sound.unloadAsync();
            }

            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                staysActiveInBackground: true,
            });

            const uri = track?.uri || DEFAULT_AUDIO_URI;

            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri },
                { shouldPlay: true },
                onPlaybackStatusUpdate
            );

            setSound(newSound);
            setIsPlaying(true);
        } catch (error) {
            console.error('Error loading audio:', error);
        }
    }

    async function stopAudio() {
        if (sound) {
            await sound.stopAsync();
            await sound.unloadAsync();
            setSound(null);
            setIsPlaying(false);
            setPosition(0);
        }
    }

    const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        if (status.isLoaded) {
            setPosition(status.positionMillis);
            setDuration(status.durationMillis || 0);
            setIsPlaying(status.isPlaying);
            if (status.didJustFinish) {
                setIsPlaying(false);
                // Optional: Auto-play next
            }
        }
    };

    async function togglePlayback() {
        if (!sound) return;
        if (isPlaying) {
            await sound.pauseAsync();
        } else {
            await sound.playAsync();
        }
    }

    if (!track) return null;

    return (
        <Modal
            animationType="slide"
            presentationStyle="fullScreen"
            transparent={false}
            visible={visible}
            statusBarTranslucent={Platform.OS === 'android'}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View
                    className="flex-1 justify-center items-center px-6"
                    style={{
                        paddingTop: insets.top,
                        paddingBottom: Math.max(insets.bottom, 16),
                    }}
                >

                    {/* Close Button */}
                    <TouchableOpacity
                        onPress={onClose}
                        className="absolute right-6 w-10 h-10 bg-white/10 rounded-full items-center justify-center"
                        style={{ top: Math.max(insets.top, 12) + 8 }}
                    >
                        <Ionicons name="close" size={24} color="white" />
                    </TouchableOpacity>

                    {/* Album Art */}
                    <View className="w-full aspect-square bg-gray-800 rounded-2xl overflow-hidden mb-8 shadow-xl">
                        <Image source={track.image} className="w-full h-full" resizeMode="cover" />
                    </View>

                    {/* Info */}
                    <View className="items-center mb-8">
                        <Text className="text-white text-2xl font-bold text-center mb-2">{track.title}</Text>
                        <Text className="text-gray-400 text-base text-center">{track.description}</Text>
                    </View>

                    {/* Progress Bar (Visual Only for now) */}
                    <View className="w-full h-1 bg-white/20 rounded-full mb-2 overflow-hidden">
                        <View
                            className="h-full bg-white rounded-full"
                            style={{ width: `${duration > 0 ? (position / duration) * 100 : 0}%` }}
                        />
                    </View>
                    <View className="w-full flex-row justify-between mb-10">
                        <Text className="text-xs text-gray-400">{formatTime(position)}</Text>
                        <Text className="text-xs text-gray-400">{formatTime(duration)}</Text>
                    </View>

                    {/* Controls */}
                    <View className="flex-row items-center justify-center space-x-12 w-full">
                        <TouchableOpacity onPress={onPrevious} disabled={!canGoPrevious} style={!canGoPrevious ? styles.disabledControl : undefined}>
                            <Ionicons name="play-skip-back" size={32} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={togglePlayback}
                            className="w-20 h-20 bg-blue-500 rounded-full items-center justify-center shadow-lg"
                        >
                            <Ionicons name={isPlaying ? "pause" : "play"} size={40} color="white" style={{ marginLeft: isPlaying ? 0 : 4 }} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onNext} disabled={!canGoNext} style={!canGoNext ? styles.disabledControl : undefined}>
                            <Ionicons name="play-skip-forward" size={32} color="white" />
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>
    );
}

function formatTime(millis: number) {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (Number(seconds) < 10 ? '0' : '') + seconds;
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: '#111214',
    },
    disabledControl: {
        opacity: 0.35,
    },
});
