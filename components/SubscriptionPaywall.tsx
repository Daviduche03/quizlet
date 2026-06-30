import { LinearGradient } from 'expo-linear-gradient';
import { Check, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Dimensions, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { PurchasesPackage } from 'react-native-purchases';

const { width } = Dimensions.get('window');

type SubscriptionPaywallProps = {
  visible: boolean;
  onClose: () => void;
  loading?: boolean;
  offerings?: PurchasesPackage[] | null;
  onPurchase: (pkg: PurchasesPackage) => Promise<void>;
  onRestore: () => Promise<void>;
};

const benefitLabels = [
  '7 Day Free Trial',
  'All Articles Unlocked',
  'All Meditations',
  'Soundscapes Unlocked',
  'AI Journaling',
  'Goals',
  'HRV',
];

export const SubscriptionPaywall = ({
  visible,
  onClose,
  loading,
  offerings,
  onPurchase,
  onRestore,
}: SubscriptionPaywallProps) => {
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const handlePurchase = async () => {
    const pkg = offerings?.[selectedIndex];
    if (!pkg) return;
    setPurchasing(true);
    await onPurchase(pkg);
    setPurchasing(false);
  };

  const handleRestore = async () => {
    setRestoring(true);
    await onRestore();
    setRestoring(false);
  };

  const getPeriodLabel = (pkg: PurchasesPackage) => {
    const id = pkg.identifier;
    if (id.includes('annual') || id.includes('year')) return '/year';
    if (id.includes('month')) return '/month';
    if (id.includes('week')) return '/week';
    return '';
  };

  const getDurationLabel = (pkg: PurchasesPackage) => {
    const id = pkg.identifier;
    if (id.includes('annual') || id.includes('year')) return { duration: '12', unit: 'months' };
    if (id.includes('month')) return { duration: '1', unit: 'month' };
    if (id.includes('week')) return { duration: '1', unit: 'week' };
    if (id.includes('6month')) return { duration: '6', unit: 'months' };
    return { duration: '1', unit: 'month' };
  };

  const getBadge = (pkg: PurchasesPackage, index: number) => {
    const id = pkg.identifier;
    if (id.includes('annual') || id.includes('year')) return 'FREE TRIAL';
    if (index === 1) return 'BEST VALUE';
    return undefined;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/70">
        <Pressable className="absolute inset-0" onPress={onClose} />

        <View
          className="bg-[#1c1c1e] border border-white/10 px-6 pb-7 pt-9 shadow-2xl"
          style={{
            width,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
          }}
        >
          <View className="absolute -top-12 right-6">
            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
              activeOpacity={0.8}
            >
              <X size={24} color="#D1D5DB" />
            </TouchableOpacity>
          </View>

          <View className="self-center w-12 h-1 rounded-full bg-white/25 mb-7" />

          <Text className="text-[#d4d4d8] text-2xl font-extrabold tracking-tight">
            Get All Access To App
          </Text>
          <Text className="text-[#a1a1aa] text-base font-semibold mt-1">
            Unlock the full potential of My Daily Therapy
          </Text>

          {loading ? (
            <View className="items-center justify-center py-16">
              <ActivityIndicator size="large" color="#a1a1aa" />
            </View>
          ) : !offerings?.length ? (
            <View className="items-center justify-center py-16">
              <Text className="text-[#a1a1aa] text-base font-semibold">No subscription plans available.</Text>
            </View>
          ) : (
            <>
              <View className="flex-row justify-between mt-8 mb-6">
                {offerings.map((pkg, index) => {
                  const { duration, unit } = getDurationLabel(pkg);
                  const badge = getBadge(pkg, index);
                  const isFeatured = index === 1;
                  const isSelected = selectedIndex === index;

                  return (
                    <TouchableOpacity
                      key={pkg.identifier}
                      activeOpacity={0.8}
                      onPress={() => setSelectedIndex(index)}
                      className={`relative items-center justify-between bg-[#18181b] border ${
                        isSelected
                          ? 'border-blue-500'
                          : isFeatured
                            ? 'border-blue-500/40'
                            : 'border-transparent'
                      }`}
                      style={{
                        width: (width - 72) / 3,
                        minHeight: 220,
                        borderRadius: 22,
                        paddingTop: 34,
                        paddingBottom: 22,
                      }}
                    >
                      {badge ? (
                        <LinearGradient
                          colors={['#5f86d9', '#d23eea']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          className="absolute -top-3 px-3 py-1 rounded-full"
                        >
                          <Text className="text-white text-xs font-extrabold">{badge}</Text>
                        </LinearGradient>
                      ) : null}

                      <View className="items-center">
                        <Text className="text-white text-5xl font-light">{duration}</Text>
                        <Text className="text-[#a1a1aa] text-sm font-bold mt-2">{unit}</Text>
                      </View>

                      <View className="items-center px-1">
                        <Text className="text-white text-xl font-extrabold text-center">
                          {pkg.product.priceString}
                        </Text>
                        <Text className="text-white text-xl font-extrabold text-center leading-5">
                          {getPeriodLabel(pkg)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View className="mb-8">
                {benefitLabels.map((label) => (
                  <View key={label} className="flex-row items-center mb-1.5">
                    <Check size={14} color="#22c55e" strokeWidth={3} />
                    <Text className="text-[#a1a1aa] text-sm font-medium ml-2">{label}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                className="rounded-[32px] overflow-hidden border border-white/10"
                onPress={handlePurchase}
                disabled={purchasing}
              >
                <LinearGradient
                  colors={['#4d8ccc', '#d936e5']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    paddingVertical: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: purchasing ? 0.6 : 1,
                  }}
                >
                  {purchasing ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text className="text-white text-lg font-extrabold">Continue</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <View className="flex-row justify-center items-center mt-7">
                <TouchableOpacity onPress={handleRestore} disabled={restoring}>
                  <Text className="text-[#a1a1aa] text-sm font-bold underline">
                    {restoring ? 'Restoring...' : 'Restore purchases'}
                  </Text>
                </TouchableOpacity>
                <Text className="text-[#a1a1aa] text-sm mx-3">•</Text>
                <TouchableOpacity>
                  <Text className="text-[#a1a1aa] text-sm font-bold underline">
                    Terms and Conditions
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};
