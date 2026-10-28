import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { runMigrations } from '../src/database/database';
import '../global.css'; 

export default function Layout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    runMigrations()
      .then(() => setReady(true))
      .catch((e) => console.error('Erro nas migrations:', e));
  }, []);

  if (!ready) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Minhas Séries' }} />
      <Stack.Screen name="form" options={{ title: 'Série', presentation: 'modal' }} />
      <Stack.Screen name="detalhe" options={{ title: 'Detalhes' }} />
      <Stack.Screen name="profile" options={{ title: 'Perfil' }} />
    </Stack>
  );
}