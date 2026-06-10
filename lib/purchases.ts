import Purchases, {
  CustomerInfo,
  PurchasesOfferings,
  PurchasesPackage,
} from 'react-native-purchases';

const RC_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY ?? '';

export const configureRevenueCat = () => {
  if (!RC_API_KEY) {
    console.warn('RevenueCat API key not configured');
    return;
  }
  Purchases.configure({ apiKey: RC_API_KEY });
};

export const getOfferings = async (): Promise<PurchasesOfferings | null> => {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings;
  } catch (e) {
    console.error('Failed to load offerings:', e);
    return null;
  }
};

export const purchasePackage = async (
  pkg: PurchasesPackage,
): Promise<CustomerInfo | null> => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return customerInfo;
  } catch (e: any) {
    if (e?.userCancelled) {
      console.log('User cancelled purchase');
    } else {
      console.error('Purchase failed:', e);
    }
    return null;
  }
};

export const restorePurchases = async (): Promise<CustomerInfo | null> => {
  try {
    const customerInfo = await Purchases.restorePurchases();
    return customerInfo;
  } catch (e) {
    console.error('Restore failed:', e);
    return null;
  }
};

export const getCustomerInfo = async (): Promise<CustomerInfo | null> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo;
  } catch (e) {
    console.error('Failed to get customer info:', e);
    return null;
  }
};

export const isPremium = (customerInfo: CustomerInfo | null): boolean => {
  return customerInfo?.entitlements.active['premium'] !== undefined;
};

export const onCustomerInfoUpdate = (
  listener: (customerInfo: CustomerInfo) => void,
) => {
  Purchases.addCustomerInfoUpdateListener(listener);
};
