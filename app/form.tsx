import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as SerieRepository from '../src/database/serieRepository';

export default function Form() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id; 

  const [titulo, setTitulo] = useState('');
  const [plataforma, setPlataforma] = useState('');
  const [temporadas, setTemporadas] = useState('');
  const [nota, setNota] = useState('');

  useEffect(() => {
    if (!isEditing) return;
    (async () => {
      const serie = await SerieRepository.getSerieById(Number(id));
      if (serie) {
        setTitulo(serie.titulo);
        setPlataforma(serie.plataforma);
        setTemporadas(String(serie.temporadas));
        setNota(serie.nota !== null ? String(serie.nota) : '');
      }
    })();
  }, [id, isEditing]);

  async function handleSave() {
    const temp = parseInt(temporadas, 10);
    const notaNum = nota.trim() === '' ? null : parseInt(nota, 10);

    if (titulo.trim() === '' || plataforma.trim() === '') {
      Alert.alert('Atenção', 'Preencha título e plataforma.');
      return;
    }
    if (isNaN(temp) || temp < 1) {
      Alert.alert('Atenção', 'Informe um número de temporadas válido (mínimo 1).');
      return;
    }
    if (notaNum !== null && (isNaN(notaNum) || notaNum < 0 || notaNum > 10)) {
      Alert.alert('Atenção', 'A nota deve ser um número de 0 a 10 (ou deixe vazio).');
      return;
    }

    const data = {
      titulo: titulo.trim(),
      plataforma: plataforma.trim(),
      temporadas: temp,
      nota: notaNum,
    };

    if (isEditing) {
      await SerieRepository.updateSerie(Number(id), data);
    } else {
      await SerieRepository.createSerie(data);
    }
    router.back(); // a lista recarrega sozinha por causa do useFocusEffect
  }

  const inputClass = 'bg-white border border-gray-300 rounded-lg p-3 mb-3';

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4" keyboardShouldPersistTaps="handled">
      <Text className="text-lg font-bold mb-3">{isEditing ? 'Editar série' : 'Nova série'}</Text>

      <TextInput className={inputClass} placeholder="Título" value={titulo} onChangeText={setTitulo} />
      <TextInput
        className={inputClass}
        placeholder="Plataforma (Netflix, Max...)"
        value={plataforma}
        onChangeText={setPlataforma}
      />
      <TextInput
        className={inputClass}
        placeholder="Temporadas"
        value={temporadas}
        onChangeText={setTemporadas}
        keyboardType="numeric"
      />
      <TextInput
        className={inputClass}
        placeholder="Nota de 0 a 10 (opcional)"
        value={nota}
        onChangeText={setNota}
        keyboardType="numeric"
      />

      <TouchableOpacity className="bg-indigo-600 p-3 rounded-lg mt-2" onPress={handleSave}>
        <Text className="text-white text-center font-bold">Salvar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}