import { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ScrollView } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  createSerie,
  getSerieById,
  updateSerie,
} from '../src/database/serieRepository';

export default function Form() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const editando = id !== undefined;

  const [titulo, setTitulo] = useState('');
  const [plataforma, setPlataforma] = useState('');
  const [temporadas, setTemporadas] = useState('');
  const [nota, setNota] = useState<number | null>(null);

  useEffect(() => {
    if (!editando) return;
    getSerieById(Number(id)).then((serie) => {
      if (serie) {
        setTitulo(serie.titulo);
        setPlataforma(serie.plataforma);
        setTemporadas(String(serie.temporadas));
        setNota(serie.nota);
      }
    });
  }, [id, editando]);

  async function salvar() {
    if (!titulo.trim()) {
      Alert.alert('Atenção', 'Informe o título.');
      return;
    }
    if (!plataforma.trim()) {
      Alert.alert('Atenção', 'Informe a plataforma.');
      return;
    }
    const numTemporadas = Number(temporadas);
    if (
      temporadas.trim() === '' ||
      !Number.isInteger(numTemporadas) ||
      numTemporadas < 0
    ) {
      Alert.alert('Atenção', 'Temporadas deve ser um número maior ou igual a 0.');
      return;
    }

    const dados = {
      titulo: titulo.trim(),
      plataforma: plataforma.trim(),
      temporadas: numTemporadas,
      nota,
    };

    if (editando) {
      await updateSerie(Number(id), dados);
    } else {
      await createSerie(dados);
    }
    router.back();
  }

  return (
    <ScrollView className="flex-1 bg-gray-100" contentContainerStyle={{ padding: 16 }}>
      <Stack.Screen options={{ title: editando ? 'Editar série' : 'Nova série' }} />

      <Text className="mb-1 font-bold">Título</Text>
      <TextInput
        value={titulo}
        onChangeText={setTitulo}
        placeholder="Ex.: Dark"
        className="mb-4 rounded-lg bg-white p-3"
      />

      <Text className="mb-1 font-bold">Plataforma</Text>
      <TextInput
        value={plataforma}
        onChangeText={setPlataforma}
        placeholder="Ex.: Netflix"
        className="mb-4 rounded-lg bg-white p-3"
      />

      <Text className="mb-1 font-bold">Temporadas assistidas</Text>
      <TextInput
        value={temporadas}
        onChangeText={setTemporadas}
        keyboardType="numeric"
        placeholder="0"
        className="mb-4 rounded-lg bg-white p-3"
      />

      <Text className="mb-1 font-bold">Nota</Text>
      <View className="mb-6 flex-row gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <Pressable
            key={n}
            onPress={() => setNota(nota === n ? null : n)}
            className={`flex-1 items-center rounded-lg py-3 ${
              nota !== null && n <= nota ? 'bg-yellow-400' : 'bg-white'
            }`}
          >
            <Text className="font-bold">★ {n}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable onPress={salvar} className="items-center rounded-full bg-blue-600 py-4">
        <Text className="font-bold text-white">Salvar</Text>
      </Pressable>
    </ScrollView>
  );
}