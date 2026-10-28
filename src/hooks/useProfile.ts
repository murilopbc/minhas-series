import { useCallback, useEffect, useState } from 'react';
import { UserProfile } from '../types/profiles';
import { getProfile, saveProfile } from '../database/profileRepository';

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setProfile(await getProfile());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(
    async (data: Omit<UserProfile, 'id'>) => {
      await saveProfile(data);
      await load();
    },
    [load]
  );

  return { profile, loading, save };
}