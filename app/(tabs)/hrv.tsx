import { Stack, router } from 'expo-router';
import { Activity, ChevronLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFeaturedHrvUser } from '@/hooks/useTherapyData';

function formatMetric(value: number) {
    return Math.round(value).toString();
}

function summarize(values: number[]) {
    if (values.length === 0) {
        return { min: 0, max: 0, avg: 0 };
    }

    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((sum, value) => sum + value, 0) / values.length;

    return { min, max, avg };
}

function describeEnergy(latest: number, average: number) {
    if (latest === 0 && average === 0) {
        return 'No HRV samples are available for this user yet.';
    }

    if (latest > average) {
        return 'Your latest HRV is above the recent average, which usually points to stronger recovery and available energy.';
    }

    if (latest < average) {
        return 'Your latest HRV is below the recent average, which can suggest lower recovery and energy today.';
    }

    return 'Your latest HRV is matching the recent average, which suggests a steady recovery baseline.';
}

const SimpleGauge = ({ value, maxValue }: { value: number; maxValue: number }) => (
    <View className="items-center justify-center my-8">
        <View className="flex-row items-center justify-center mb-8">
            <Activity size={24} color="#4ade80" />
            <Text className="text-white text-6xl font-bold ml-3">{formatMetric(value)}</Text>
            <Text className="text-gray-400 text-xl font-semibold ml-2 mt-4">HRV</Text>
        </View>

        <View className="w-64">
            <View className="h-4 bg-[#2c2c2e] rounded-full overflow-hidden">
                <View
                    className="h-full rounded-full bg-blue-500"
                    style={{
                        width: `${Math.max(4, Math.min(100, (value / Math.max(maxValue, 1)) * 100))}%`,
                    }}
                />
            </View>
        </View>

        <View className="flex-row justify-between w-64 mt-2 px-2">
            <Text className="text-gray-500 font-semibold">Low</Text>
            <Text className="text-gray-500 font-semibold">High</Text>
        </View>
    </View>
)

const TrendsChart = ({ values }: { values: number[] }) => {
    const maxValue = Math.max(...values, 1);
    const labels = values.map((_, index) => `${index + 1}`);

    return (
    <View className="mt-8 px-4 h-64 flex-row items-end justify-between w-full">
        {values.map((value, index) => (
            <View key={`${labels[index]}-${index}`} className="items-center w-8">
                <Text className="text-gray-500 text-xs mb-2">{formatMetric(value)}</Text>
                <View className="w-1.5 h-32 bg-[#2c2c2e] rounded-full relative justify-end">
                    <View
                        className="w-full bg-blue-500 rounded-full"
                        style={{ height: `${Math.max(4, (value / maxValue) * 100)}%` }}
                    />
                </View>
                <Text className="text-gray-500 text-xs mt-2">{labels[index]}</Text>
            </View>
        ))}
    </View>
    );
};

export default function HRVScreen() {
    const insets = useSafeAreaInsets();
    const { user, loading, error } = useFeaturedHrvUser();
    const [viewMode, setViewMode] = useState<'Overview' | 'Trends'>('Overview');
    const [trendRange, setTrendRange] = useState<'7 DAYS' | '14 DAYS'>('7 DAYS');
    const trendValues = trendRange === '7 DAYS' ? (user?.sevenDayHrv ?? []) : (user?.fourteenDayHrv ?? []);
    const trendSummary = summarize(trendValues);

    return (
        <View className="flex-1 bg-[#1c1c1e]">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View
                style={{ paddingTop: insets.top + 10 }}
                className="flex-row items-center px-6 pb-6"
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 rounded-full bg-[#2c2c2e] items-center justify-center absolute left-6 top-[54px] z-10"
                >
                    <ChevronLeft size={24} color="white" />
                </TouchableOpacity>
                <View className="flex-1 items-center">
                    <Text className="text-gray-400 text-lg font-bold">My Biometrics</Text>
                    <Text className="text-gray-500 text-xs font-semibold mt-0.5">
                        {loading ? 'Loading live Firestore data...' : user ? `Document ${user.id}` : 'No Firestore user available'}
                    </Text>
                </View>
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                {/* Top Stats */}
                <View className="flex-row justify-between px-8 mb-8">
                    <View className="items-center">
                        <Text className="text-gray-500 text-xs font-bold mb-1">Min</Text>
                        <Text className="text-white text-2xl font-bold">{formatMetric(trendSummary.min)}</Text>
                    </View>
                    <View className="items-center">
                        <Text className="text-gray-500 text-xs font-bold mb-1">Avg</Text>
                        <Text className="text-white text-2xl font-bold">{formatMetric(trendSummary.avg)}</Text>
                    </View>
                    <View className="items-center">
                        <Text className="text-gray-500 text-xs font-bold mb-1">Max</Text>
                        <Text className="text-white text-2xl font-bold">{formatMetric(trendSummary.max)}</Text>
                    </View>
                </View>

                {/* Main Card */}
                <View className="bg-[#121213] rounded-[32px] p-6 min-h-[420px] items-center relative overflow-hidden">
                    {/* Mode Toggle (Invisible touch areas or just visual separation based on scroll/tab?) 
                        Screenshots show "Heart Rate Variability" title with blue underline in overview, 
                        and "TRENDS" with tab selector in trends. We'll toggle based on state.
                    */}

                    {/* Toggle Buttons (simulated) */}
                    <View className="flex-row mb-6 bg-[#2c2c2e] rounded-full p-1 opacity-0 h-0 w-0 absolute">
                        {/* Hidden for now to match exact UI of separate screenshots, will use a tap to switch for demo */}
                    </View>

                    <TouchableOpacity
                        className="mb-6 w-full items-center"
                        onPress={() => setViewMode(viewMode === 'Overview' ? 'Trends' : 'Overview')}
                        activeOpacity={1}
                    >
                        {viewMode === 'Overview' ? (
                            <View className="items-center">
                                <Text className="text-white text-lg font-bold">Heart Rate</Text>
                                <Text className="text-white text-lg font-bold">Variability</Text>
                                <View className="h-1 w-24 bg-blue-600 mt-2 rounded-full" />
                            </View>
                        ) : (
                            <Text className="text-gray-400 text-sm font-bold tracking-widest uppercase">TRENDS</Text>
                        )}
                    </TouchableOpacity>

                    {viewMode === 'Trends' && (
                        <View className="flex-row w-full justify-between px-8 border-b border-white/10 mb-4 pb-0">
                            <TouchableOpacity onPress={() => setTrendRange('7 DAYS')} className={`pb-3 border-b-2 ${trendRange === '7 DAYS' ? 'border-blue-500' : 'border-transparent'}`}>
                                <Text className={`text-xs font-bold ${trendRange === '7 DAYS' ? 'text-white' : 'text-gray-500'}`}>7 DAYS</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setTrendRange('14 DAYS')} className={`pb-3 border-b-2 ${trendRange === '14 DAYS' ? 'border-blue-500' : 'border-transparent'}`}>
                                <Text className={`text-xs font-bold ${trendRange === '14 DAYS' ? 'text-white' : 'text-gray-500'}`}>14 DAYS</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {viewMode === 'Overview' ? (
                        <>
                            <Text className="text-gray-300 text-center font-semibold px-4 mb-4 leading-6">
                                {error ? error.message : describeEnergy(user?.latest ?? 0, user?.fourteenDayAvg ?? 0)}
                            </Text>
                            <SimpleGauge value={user?.latest ?? 0} maxValue={Math.max(user?.fourteenDayMax ?? 0, 1)} />
                            <Text className="text-gray-500 text-xs font-bold mt-12 mb-2">All-Time Average</Text>
                            <Text className="text-white text-2xl font-bold">{formatMetric(user?.fourteenDayAvg ?? 0)}</Text>
                        </>
                    ) : (
                        <>
                            <TrendsChart values={trendValues.length > 0 ? trendValues : [0, 0, 0, 0, 0, 0, 0]} />
                            <View className="flex-row justify-between w-full mt-12 px-2">
                                <View className="items-center">
                                    <Text className="text-gray-500 text-xs font-bold mb-1">Min HRV</Text>
                                    <Text className="text-white text-2xl font-bold">{formatMetric(trendSummary.min)}</Text>
                                </View>
                                <View className="items-center">
                                    <Text className="text-gray-500 text-xs font-bold mb-1">Avg HRV</Text>
                                    <Text className="text-white text-2xl font-bold">{formatMetric(trendSummary.avg)}</Text>
                                </View>
                                <View className="items-center">
                                    <Text className="text-gray-500 text-xs font-bold mb-1">Max HRV</Text>
                                    <Text className="text-white text-2xl font-bold">{formatMetric(trendSummary.max)}</Text>
                                </View>
                            </View>
                        </>
                    )}
                </View>

            </ScrollView>
        </View>
    );
}
