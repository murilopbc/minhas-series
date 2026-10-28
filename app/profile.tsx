import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { File, Paths } from 'expo-file-system';
import { useProfile } from '../src/hooks/useProfile';
import { CameraCapture } from '../src/components/CameraCapture';

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, loading, save } = useProfile();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  // Preenche o formulário quando o perfil carregar do banco
  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
      setPhotoUri(profile.photoUri);
    }
  }, [profile]);

  function handleCapture(tempUri: string) {
    // uri da câmera é temporário: copiar para o diretório permanente
    const destino = new File(Paths.document, `perfil-${Date.now()}.jpg`);
    new File(tempUri).copy(destino);

    setPhotoUri(destino.uri);
    setShowCamera(false);
  }

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert('Atenção', 'Informe seu nome.');
      return;
    }
    if (!email.includes('@')) {
      Alert.alert('Atenção', 'Informe um email válido.');
      return;
    }

    await save({ name: name.trim(), email: email.trim(), photoUri });
    Alert.alert('Pronto', 'Perfil salvo!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  }

  if (showCamera) {
    return (
      <CameraCapture
        onCapture={handleCapture}
        onClose={() => setShowCamera(false)}
      />
    );
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerClassName="p-6 items-center"
      keyboardShouldPersistTaps="handled"
    >
      {photoUri ? (
        <Image
          source={{ uri: photoUri }}
          className="w-40 h-40 rounded-full mb-4"
        />
      ) : (
        <View className="w-40 h-40 rounded-full bg-gray-200 items-center justify-center mb-4">
          <Text className="text-5xl">👤</Text>
        </View>
      )}

      <TouchableOpacity
        className="bg-indigo-600 px-6 py-3 rounded-lg mb-8"
        onPress={() => setShowCamera(true)}
      >
        <Text className="text-white font-bold">
          {photoUri ? 'Trocar foto' : 'Tirar foto'}
        </Text>
      </TouchableOpacity>

      <View className="w-full mb-4">
        <Text className="text-gray-700 mb-1">Nome</Text>
        <TextInput
          className="bg-white border border-gray-300 rounded-lg px-4 py-3"
          value={name}
          onChangeText={setName}
          placeholder="Seu nome"
        />
      </View>

      <View className="w-full mb-8">
        <Text className="text-gray-700 mb-1">Email</Text>
        <TextInput
          className="bg-white border border-gray-300 rounded-lg px-4 py-3"
          value={email}
          onChangeText={setEmail}
          placeholder="voce@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity
        className="bg-green-600 w-full py-4 rounded-lg items-center"
        onPress={handleSave}
      >
        <Text className="text-white font-bold text-base">Salvar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}