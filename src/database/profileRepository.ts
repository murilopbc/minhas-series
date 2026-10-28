import { getDatabase } from './database';
import { UserProfile } from '../types/profiles';

interface ProfileRow {
  id: number;
  name: string;
  email: string;
  photo_uri: string | null;
}

export async function getProfile(): Promise<UserProfile | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<ProfileRow>(
    'SELECT * FROM profile WHERE id = 1'
  );
  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    photoUri: row.photo_uri,
  };
}

// Se existe, atualiza; se não, insere
export async function saveProfile(
  data: Omit<UserProfile, 'id'>
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO profile (id, name, email, photo_uri)
     VALUES (1, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       name = excluded.name,
       email = excluded.email,
       photo_uri = excluded.photo_uri`,
    data.name,
    data.email,
    data.photoUri
  );
}