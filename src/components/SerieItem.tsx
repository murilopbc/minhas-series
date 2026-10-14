import { View, Text, TouchableOpacity } from 'react-native';
import { Serie } from '../types/serie';

interface SerieItemProps {
  serie: Serie;
  onToggle: (id: number) => void;
  onPress: (id: number) => void;   
  onDelete: (id: number) => void;
}

export function SerieItem({ serie, onToggle, onPress, onDelete }: SerieItemProps) {
  const done = serie.concluida === 1;

  return (
    <View className="bg-white p-4 rounded-lg mb-2 flex-row items-center">
      <TouchableOpacity
        onPress={() => onToggle(serie.id)}
        className={`w-7 h-7 rounded-full border-2 items-center justify-center mr-3 ${
          done ? 'bg-indigo-600 border-indigo-600' : 'border-gray-400'
        }`}
      >
        {done && <Text className="text-white font-bold">✓</Text>}
      </TouchableOpacity>

      <TouchableOpacity className="flex-1" onPress={() => onPress(serie.id)}>
        <Text
          className={`text-base font-semibold ${done ? 'line-through text-gray-400' : 'text-gray-800'}`}
        >
          {serie.titulo}
        </Text>
        <Text className="text-sm text-gray-500 mt-0.5">
          {serie.plataforma} · {serie.temporadas}{' '}
          {serie.temporadas === 1 ? 'temporada' : 'temporadas'}
          {serie.nota !== null ? ` · ⭐ ${serie.nota}` : ''}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onDelete(serie.id)} className="p-2">
        <Text className="text-xl">🗑️</Text>
      </TouchableOpacity>
    </View>
  );
}