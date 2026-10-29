import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { useSeries } from '../src/hooks/useSeries';
import { SerieItem } from '../src/components/SerieItem';
import { FilterBar } from '../src/components/FilterBar';
import { EmptyState } from '../src/components/EmptyState';
import { useAuthContext } from '../src/contexts/AuthContext';

export default function Home() {
  const { signOut } = useAuthContext();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { series, counts, filter, setFilter, loading, toggleSerie, removeSerie } = useSeries();

  function handleSignOut() {
    Alert.alert('Sair', 'Deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: signOut },
    ]);
  }

  function handleDelete(id: number) {
    Alert.alert('Excluir série', 'Tem certeza que deseja excluir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => removeSerie(id) },
    ]);
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <Stack.Screen
        options={{
          title: 'Minhas Séries',
          headerRight: () => (
            <View className="flex-row items-center" style={{ gap: 16 }}>
              <TouchableOpacity onPress={() => router.push('/profile')}>
                <Text className="text-2xl">👤</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSignOut}>
                <Text className="text-red-600 font-bold">Sair</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <FilterBar filter={filter} counts={counts} onChange={setFilter} />

      <FlatList
        data={series}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <SerieItem
            serie={item}
            onToggle={toggleSerie}
            onPress={(id) => router.push({ pathname: '/detalhe', params: { id } })}
            onDelete={handleDelete}
          />
        )}
        ListEmptyComponent={<EmptyState />}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity
        className="absolute right-6 w-16 h-16 bg-indigo-600 rounded-full items-center justify-center shadow-lg"
        style={{ bottom: insets.bottom + 24 }}
        activeOpacity={0.8}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        onPress={() => router.push('/form')}
      >
        <Text className="text-white text-3xl">+</Text>
      </TouchableOpacity>
    </View>
  );
}