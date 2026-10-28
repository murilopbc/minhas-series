import { useRef } from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CameraCaptureProps {
  onCapture: (uri: string) => void;
  onClose: () => void;
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const insets = useSafeAreaInsets();

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
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing="front" />

      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: insets.bottom + 24,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity onPress={onClose}>
          <Text style={{ color: 'white', fontSize: 18 }}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={tirarFoto}
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: 'white',
            borderWidth: 4,
            borderColor: '#9ca3af',
          }}
        />
      </View>
    </View>
  );
}