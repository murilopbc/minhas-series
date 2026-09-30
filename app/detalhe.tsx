import { useCallback, useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import {
  deleteSerie,
  getSerieById,
  toggleSerieConcluida,
} from '../src/database/serieRepository';
import { Serie } from '../src/types/serie';

export default function Detalhe() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [serie, setSerie] = useState<Serie | null>(null);

  useFocusEffect(
    useCallback(() => {
      getSerieById(Number(id)).then(setSerie);
    }, [id])
  );

  async function alternarConcluida() {
    await toggleSerieConcluida(Number(id));
    setSerie(await getSerieById(Number(id)));
  }

  function confirmarExclusao() {
    Alert.alert('Excluir', 'Tem certeza que deseja excluir esta série?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await deleteSerie(Number(id));
          router.back();
        },
      },
    ]);
  }

  if (!serie) {
    return <Text className="mt-16 text-center text-gray-500">Carregando...</Text>;
  }

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <View className="mb-6 rounded-xl bg-white p-4">
        <Text className="mb-2 text-2xl font-bold">{serie.titulo}</Text>
        <Text className="text-gray-700">Plataforma: {serie.plataforma}</Text>
        <Text className="text-gray-700">Temporadas: {serie.temporadas}</Text>
        <Text className="text-gray-700">
          Nota: {serie.nota !== null ? `★ ${serie.nota}` : 'Sem nota'}
        </Text>
        <Text className="text-gray-700">
          Status: {serie.concluida === 1 ? 'Concluída' : 'Assistindo'}
        </Text>
        <Text className="text-xs text-gray-400">
          Cadastrada em {new Date(serie.createdAt).toLocaleDateString('pt-BR')}
        </Text>
      </View>

      <Pressable onPress={alternarConcluida} className="mb-3 items-center rounded-full bg-green-600 py-4">
        <Text className="font-bold text-white">
          {serie.concluida === 1 ? 'Voltar para assistindo' : 'Marcar como concluída'}
        </Text>
      </Pressable>

      <Pressable onPress={() => router.push(`/form?id=${serie.id}`)} className="mb-3 items-center rounded-full bg-blue-600 py-4">
        <Text className="font-bold text-white">Editar</Text>
      </Pressable>

      <Pressable onPress={confirmarExclusao} className="items-center rounded-full bg-red-600 py-4">
        <Text className="font-bold text-white">Excluir</Text>
      </Pressable>
    </View>
  );
}