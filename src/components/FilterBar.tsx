import { View, Text, TouchableOpacity } from 'react-native';
import { SerieFilter } from '../types/serie';

interface FilterBarProps {
  filter: SerieFilter;
  counts: Record<SerieFilter, number>;
  onChange: (filter: SerieFilter) => void;
}

const OPTIONS: { key: SerieFilter; label: string }[] = [
  { key: 'todas', label: 'Todas' },
  { key: 'assistindo', label: 'Assistindo' },
  { key: 'concluidas', label: 'Concluídas' },
];

export function FilterBar({ filter, counts, onChange }: FilterBarProps) {
  return (
    <View className="flex-row mb-4">
      {OPTIONS.map(({ key, label }) => {
        const active = filter === key;
        return (
          <TouchableOpacity
            key={key}
            onPress={() => onChange(key)}
            className={`flex-1 py-2 mx-1 rounded-lg ${active ? 'bg-indigo-600' : 'bg-gray-200'}`}
          >
            <Text
              className={`text-center text-sm font-semibold ${active ? 'text-white' : 'text-gray-700'}`}
            >
              {label} ({counts[key]})
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}