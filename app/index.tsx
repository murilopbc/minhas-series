import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSeries } from '../src/hooks/useSeries';
import { SerieItem } from '../src/components/SerieItem';
import { FilterBar } from '../src/components/FilterBar';
import { EmptyState } from '../src/components/EmptyState';

export default function Home() {
  const router = useRouter();
  const { series, counts, filter, setFilter, loading, toggleSerie, removeSerie } = useSeries();

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
        className="absolute bottom-6 right-6 w-16 h-16 bg-indigo-600 rounded-full items-center justify-center shadow-lg"
        onPress={() => router.push('/form')}
      >
        <Text className="text-white text-3xl">+</Text>
      </TouchableOpacity>
    </View>
  );
}