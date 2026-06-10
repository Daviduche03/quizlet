import { useEffect, useState } from 'react';
import { CustomerInfo, PurchasesOfferings, PurchasesPackage } from 'react-native-purchases';
import {
  configureRevenueCat,
  getOfferings,
  getCustomerInfo,
  isPremium as checkPremium,
  onCustomerInfoUpdate,
  purchasePackage as purchase,
  restorePurchases as restore,
} from '@/lib/purchases';

export const usePurchases = () => {
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = async () => {
    const [offers, info] = await Promise.all([getOfferings(), getCustomerInfo()]);
    setOfferings(offers);
    setCustomerInfo(info);
    setIsLoading(false);
  };

  useEffect(() => {
    configureRevenueCat();
    refresh();

    onCustomerInfoUpdate((info) => {
      setCustomerInfo(info);
    });
  }, []);

  const purchasePackage = async (pkg: PurchasesPackage) => {
    const info = await purchase(pkg);
    if (info) {
      setCustomerInfo(info);
    }
    return info;
  };

  const restorePurchases = async () => {
    const info = await restore();
    if (info) {
      setCustomerInfo(info);
    }
    return info;
  };

  return {
    offerings,
    currentOffering: offerings?.current,
    customerInfo,
    isPremium: checkPremium(customerInfo),
    isLoading,
    purchasePackage,
    restorePurchases,
    refresh,
  };
};
