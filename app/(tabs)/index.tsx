import { ArticleCard } from '@/components/home/ArticleCard';
import { FeaturedRail } from '@/components/home/FeaturedRail';
import { GreetingHeader } from '@/components/home/GreetingHeader';
import { MeditationList } from '@/components/home/MeditationList';
import { PremiumFooter } from '@/components/home/PremiumFooter';
import { SectionHeader } from '@/components/home/SectionHeader';
import { SoundscapesRail } from '@/components/home/SoundscapesRail';
import { SubscriptionPaywall } from '@/components/SubscriptionPaywall';
import { usePurchases } from '@/hooks/usePurchases';
import { Stack, router } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';

export default function HomeScreen() {
  const [showPaywall, setShowPaywall] = React.useState(false);
  const { offerings, isLoading, isPremium, purchasePackage, restorePurchases } = usePurchases();

  const packages = offerings?.current?.availablePackages ?? null;

  const openPaywall = () => {
    if (!isPremium) {
      setShowPaywall(true);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-[#1c1c1e]">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <GreetingHeader />

          <FeaturedRail onLockedPress={openPaywall} />

          <SectionHeader title="Meditation" onPress={openPaywall} />
          <MeditationList onLockedPress={openPaywall} />

          <SectionHeader title="Soundscapes" onPress={openPaywall} />
          <SoundscapesRail onLockedPress={openPaywall} />

          <SectionHeader title="Articles" onPress={() => router.push('/discover')} />
          <ArticleCard />

          <PremiumFooter />
        </ScrollView>
        <SubscriptionPaywall
          visible={showPaywall}
          onClose={() => setShowPaywall(false)}
          loading={isLoading}
          offerings={packages}
          onPurchase={async (pkg) => {
            const info = await purchasePackage(pkg);
            if (info) {
              setShowPaywall(false);
            }
          }}
          onRestore={async () => {
            const info = await restorePurchases();
            if (info) {
              setShowPaywall(false);
            }
          }}
        />
      </View>
    </>
  );
}
