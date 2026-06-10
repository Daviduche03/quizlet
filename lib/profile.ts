import { db } from '@/firebaseConfig';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

const PROFILES_COLLECTION = 'profiles';

export interface UserProfile {
  name: string;
  birthday: string;
  email?: string;
}

export async function getProfile(uid: string): Promise<UserProfile | null> {
  const ref = doc(db, PROFILES_COLLECTION, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

export async function saveProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  const ref = doc(db, PROFILES_COLLECTION, uid);
  await setDoc(ref, data, { merge: true });
}
