import '../global.css';
import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { runMigrations } from '../src/database/database';

export default function Layout() {
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    runMigrations().then(() => setPronto(true));
  }, []);

  if (!pronto) return null;

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Minhas Séries' }} />
      <Stack.Screen name="form" options={{ title: 'Série' }} />
      <Stack.Screen name="detalhe" options={{ title: 'Detalhe' }} />
    </Stack>
  );
}