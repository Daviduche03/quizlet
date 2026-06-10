import { db } from '@/firebaseConfig';
import { collection, doc, getDoc, getDocs, query, where, onSnapshot } from 'firebase/firestore';

// User data structure (to be updated based on actual Firebase fields)
export interface User {
  id: string;
  email?: string;
  displayName?: string;
  createdAt?: Date;
  // Add other fields as discovered
}

// Intake data structure (to be updated based on actual Firebase fields)
export interface Intake {
  id: string;
  userId?: string;
  responses?: any;
  submittedAt?: Date;
  // Add other fields as discovered
}

/**
 * Fetch all users from Firestore
 * Safe - READ ONLY, no deletions
 */
export async function getAllUsers(): Promise<User[]> {
  const snapshot = await getDocs(collection(db, 'users'));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as User));
}

/**
 * Fetch a single user by ID
 * Safe - READ ONLY
 */
export async function getUserById(userId: string): Promise<User | null> {
  const docRef = doc(db, 'users', userId);
  const snapshot = await getDoc(docRef);
  
  if (!snapshot.exists()) return null;
  
  return {
    id: snapshot.id,
    ...snapshot.data()
  } as User;
}

/**
 * Subscribe to user data updates (real-time)
 * Safe - READ ONLY
 */
export function subscribeToUser(userId: string, callback: (user: User | null) => void) {
  const docRef = doc(db, 'users', userId);
  return onSnapshot(docRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback(null);
      return;
    }
    callback({
      id: snapshot.id,
      ...snapshot.data()
    } as User);
  });
}

/**
 * Fetch all intakes from Firestore
 * Safe - READ ONLY
 */
export async function getAllIntakes(): Promise<Intake[]> {
  const snapshot = await getDocs(collection(db, 'intakes'));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Intake));
}

/**
 * Fetch intakes for a specific user
 * Safe - READ ONLY
 */
export async function getIntakesByUser(userId: string): Promise<Intake[]> {
  const q = query(collection(db, 'intakes'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Intake));
}

/**
 * Fetch a single intake by ID
 * Safe - READ ONLY
 */
export async function getIntakeById(intakeId: string): Promise<Intake | null> {
  const docRef = doc(db, 'intakes', intakeId);
  const snapshot = await getDoc(docRef);
  
  if (!snapshot.exists()) return null;
  
  return {
    id: snapshot.id,
    ...snapshot.data()
  } as Intake;
}
