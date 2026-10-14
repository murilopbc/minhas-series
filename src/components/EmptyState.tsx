import { View, Text } from 'react-native';

export function EmptyState() {
  return (
    <View className="items-center justify-center py-16">
      <Text className="text-6xl mb-4">📺</Text>
      <Text className="text-xl font-bold text-gray-700">Nenhuma série aqui</Text>
      <Text className="text-sm text-gray-400 mt-1">Toque no + para adicionar.</Text>
    </View>
  );
}