import { useRef } from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

interface CameraCaptureProps {
  onCapture: (uri: string) => void;
  onClose: () => void;
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  // Estado 1 — consultando o sistema
  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white">Verificando permissões...</Text>
      </View>
    );
  }

  // Estado 2 — negada
  if (!permission.granted) {
    const bloqueada = !permission.canAskAgain;

    return (
      <View className="flex-1 items-center justify-center bg-black p-8">
        <Text className="text-6xl mb-4">📷</Text>
        <Text className="text-white text-center mb-6">
          Precisamos da câmera para você tirar sua foto de perfil.
          {bloqueada && ' Ative a permissão nos Ajustes do aparelho.'}
        </Text>

        <TouchableOpacity
          className="bg-indigo-600 px-6 py-3 rounded-lg mb-4"
          onPress={bloqueada ? () => Linking.openSettings() : requestPermission}
        >
          <Text className="text-white font-bold">
            {bloqueada ? 'Abrir Ajustes' : 'Conceder permissão'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onClose}>
          <Text className="text-gray-400">Cancelar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Estado 3 — liberada
  async function tirarFoto() {
    const foto = await cameraRef.current?.takePictureAsync({ quality: 0.7 });
    if (foto?.uri) onCapture(foto.uri);
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing="front" />

      <View className="flex-row justify-around items-center py-6 bg-black">
        <TouchableOpacity onPress={onClose}>
          <Text className="text-white text-lg">Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-20 h-20 rounded-full bg-white border-4 border-gray-400"
          onPress={tirarFoto}
        />
      </View>
    </View>
  );
}