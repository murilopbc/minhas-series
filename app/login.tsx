import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthContext } from '../src/contexts/AuthContext';

export default function Login() {
  const router = useRouter();
  const { signIn } = useAuthContext();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    if (!email.trim() || senha.length < 6) {
      Alert.alert(
        'Atenção',
        'Informe um email e uma senha de ao menos 6 caracteres.',
      );
      return;
    }
    try {
      setCarregando(true);
      await signIn(email.trim(), senha);
      // Não navegamos aqui: o _layout redireciona sozinho.
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View className="flex-1 justify-center bg-gray-50 p-6">
      <Text className="text-3xl font-bold text-indigo-600 mb-8 text-center">
        Entrar
      </Text>

      <TextInput
        className="bg-white border border-gray-300 rounded-lg p-3 mb-3"
        placeholder="email@exemplo.com"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        className="bg-white border border-gray-300 rounded-lg p-3 mb-6"
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity
        className="bg-indigo-600 p-4 rounded-lg mb-6"
        disabled={carregando}
        onPress={entrar}
      >
        <Text className="text-white text-center font-bold">
          {carregando ? 'Aguarde...' : 'Entrar'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/register')}>
        <Text className="text-indigo-600 text-center">
          Não tem conta? Cadastre-se
        </Text>
      </TouchableOpacity>
    </View>
  );
}