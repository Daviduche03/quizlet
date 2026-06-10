import { db } from '@/firebaseConfig';
import {
  doc,
  setDoc,
  collection,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  type DocumentData,
  type DocumentSnapshot,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';

const USERS_COLLECTION = 'users';
const INTAKES_COLLECTION = 'intakes';

export interface HrvUser {
  id: string;
  userId: string;
  latest: number;
  sevenDayHrv: number[];
  fourteenDayHrv: number[];
  fourteenDayAvg: number;
  fourteenDayMin: number;
  fourteenDayMax: number;
}

export interface IntakeResponse {
  label: string;
  value: string;
}

export interface IntakeReview {
  id: string;
  review: string;
  responses: IntakeResponse[];
}

export interface FirestoreOverview {
  hrvUserCount: number;
  intakeCount: number;
  featuredUserId: string | null;
}

function toNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function toNumberArray(value: unknown): number[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((entry): entry is number => typeof entry === 'number' && Number.isFinite(entry));
}

function mapHrvUser(snapshot: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>): HrvUser {
  const data = snapshot.data() ?? {};

  return {
    id: snapshot.id,
    userId: typeof data.user_id === 'string' ? data.user_id : snapshot.id,
    latest: toNumber(data.latest),
    sevenDayHrv: toNumberArray(data['7_day_hrv']),
    fourteenDayHrv: toNumberArray(data['14_day_hrv']),
    fourteenDayAvg: toNumber(data['14_day_avg']),
    fourteenDayMin: toNumber(data['14_day_min']),
    fourteenDayMax: toNumber(data['14_day_max']),
  };
}

export function parseIntakeReview(review: string): IntakeResponse[] {
  return review
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf(':');

      if (separatorIndex === -1) {
        return {
          label: 'Note',
          value: line.replace(/\.$/, ''),
        };
      }

      return {
        label: line.slice(0, separatorIndex).trim(),
        value: line.slice(separatorIndex + 1).trim().replace(/\.$/, ''),
      };
    });
}

function mapIntakeReview(snapshot: QueryDocumentSnapshot<DocumentData>): IntakeReview {
  const data = snapshot.data();
  const review = typeof data.review === 'string' ? data.review : '';

  return {
    id: snapshot.id,
    review,
    responses: parseIntakeReview(review),
  };
}

export async function listHrvUsers(): Promise<HrvUser[]> {
  const snapshot = await getDocs(collection(db, USERS_COLLECTION));
  return snapshot.docs.map(mapHrvUser);
}

export async function getHrvUserById(userId: string): Promise<HrvUser | null> {
  const docRef = doc(db, USERS_COLLECTION, userId);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return null;
  }

  return mapHrvUser(snapshot);
}

export function subscribeToHrvUser(
  userId: string,
  callback: (user: HrvUser | null) => void,
  onError?: (error: Error) => void
) {
  const docRef = doc(db, USERS_COLLECTION, userId);

  return onSnapshot(
    docRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }

      callback(mapHrvUser(snapshot));
    },
    (error) => {
      onError?.(error);
    }
  );
}

export async function getFeaturedHrvUser(): Promise<HrvUser | null> {
  const featuredQuery = query(collection(db, USERS_COLLECTION), orderBy('latest', 'desc'), limit(1));
  const snapshot = await getDocs(featuredQuery);

  if (snapshot.empty) {
    return null;
  }

  return mapHrvUser(snapshot.docs[0]);
}

export async function listIntakeReviews(limitCount = 20): Promise<IntakeReview[]> {
  const snapshot = await getDocs(collection(db, INTAKES_COLLECTION));
  return snapshot.docs.slice(0, limitCount).map(mapIntakeReview);
}

export async function getFirestoreOverview(): Promise<FirestoreOverview> {
  const [userCountSnapshot, intakeCountSnapshot, featuredUser] = await Promise.all([
    getCountFromServer(collection(db, USERS_COLLECTION)),
    getCountFromServer(collection(db, INTAKES_COLLECTION)),
    getFeaturedHrvUser(),
  ]);

  return {
    hrvUserCount: userCountSnapshot.data().count,
    intakeCount: intakeCountSnapshot.data().count,
    featuredUserId: featuredUser?.id ?? null,
  };
}

function createReviewId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID().toUpperCase();
  }

  const segment = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).slice(1).toUpperCase();
  return `${segment()}${segment()}-${segment()}-${segment()}-${segment()}-${segment()}${segment()}${segment()}`;
}

export async function createIntakeReview(review: string) {
  const id = createReviewId();
  await setDoc(doc(collection(db, INTAKES_COLLECTION), id), { review });
  return id;
}
