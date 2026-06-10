import { useEffect, useState } from 'react';
import {
  getFeaturedHrvUser,
  getFirestoreOverview,
  getHrvUserById,
  listHrvUsers,
  listIntakeReviews,
  subscribeToHrvUser,
  type FirestoreOverview,
  type HrvUser,
  type IntakeReview,
} from '@/lib/firestoreClient';

export function useHrvUsers() {
  const [users, setUsers] = useState<HrvUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    listHrvUsers()
      .then((data) => {
        if (mounted) {
          setUsers(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { users, loading, error };
}

export function useFeaturedHrvUser() {
  const [user, setUser] = useState<HrvUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    getFeaturedHrvUser()
      .then((data) => {
        if (mounted) {
          setUser(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { user, loading, error };
}

export function useHrvUser(userId: string | undefined) {
  const [user, setUser] = useState<HrvUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    let mounted = true;

    getHrvUserById(userId)
      .then((data) => {
        if (mounted) {
          setUser(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [userId]);

  return { user, loading, error };
}

export function useHrvUserRealtime(userId: string | undefined) {
  const [user, setUser] = useState<HrvUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToHrvUser(
      userId,
      (data) => {
        setUser(data);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { user, loading, error };
}

export function useIntakeReviews(limitCount = 12) {
  const [intakes, setIntakes] = useState<IntakeReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    listIntakeReviews(limitCount)
      .then((data) => {
        if (mounted) {
          setIntakes(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [limitCount]);

  return { intakes, loading, error };
}

export function useFirestoreOverview() {
  const [overview, setOverview] = useState<FirestoreOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    getFirestoreOverview()
      .then((data) => {
        if (mounted) {
          setOverview(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { overview, loading, error };
}
