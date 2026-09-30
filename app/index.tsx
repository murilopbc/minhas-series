import { useCallback, useState } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { getSeries } from '../src/database/serieRepository';
import { Serie, SerieFilter } from '../src/types/serie';

const FILTROS: { valor: SerieFilter; rotulo: string }[] = [
  { valor: 'todas', rotulo: 'Todas' },
  { valor: 'assistindo', rotulo: 'Assistindo' },
  { valor: 'concluidas', rotulo: 'Concluídas' },
];

export default function Index() {
  const router = useRouter();
  const [filtro, setFiltro] = useState<SerieFilter>('todas');
  const [series, setSeries] = useState<Serie[]>([]);

  useFocusEffect(
    useCallback(() => {
      getSeries(filtro).then(setSeries);
    }, [filtro])
  );

  return (
    <View className="flex-1 bg-gray-100">
      <View className="flex-row gap-2 p-4">
        {FILTROS.map((f) => (
          <Pressable
            key={f.valor}
            onPress={() => setFiltro(f.valor)}
            className={`flex-1 items-center rounded-full py-2 ${
              filtro === f.valor ? 'bg-blue-600' : 'bg-white'
            }`}
          >
            <Text
              className={
                filtro === f.valor ? 'font-bold text-white' : 'text-gray-700'
              }
            >
              {f.rotulo}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={series}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        ListEmptyComponent={
          <Text className="mt-16 text-center text-gray-500">
            Nenhuma série por aqui ainda.
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/detalhe?id=${item.id}`)}
            className={`mb-3 rounded-xl p-4 ${
              item.concluida === 1
                ? 'border border-green-300 bg-green-100'
                : 'bg-white'
            }`}
          >
            <Text className="text-lg font-bold">{item.titulo}</Text>
            <Text className="text-gray-600">{item.plataforma}</Text>
            <Text className="text-gray-600">
              {item.temporadas} temporada(s)
            </Text>
            <Text className="mt-1 text-yellow-600">
              {item.nota !== null ? `★ ${item.nota}` : 'Sem nota'}
            </Text>
            {item.concluida === 1 && (
              <Text className="mt-1 text-xs font-bold text-green-700">
                CONCLUÍDA
              </Text>
            )}
          </Pressable>
        )}
      />

      <Pressable
        onPress={() => router.push('/form')}
        className="absolute bottom-6 left-4 right-4 items-center rounded-full bg-blue-600 py-4"
      >
        <Text className="font-bold text-white">+ Nova série</Text>
      </Pressable>
    </View>
  );
}