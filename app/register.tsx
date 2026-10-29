import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthContext } from '../src/contexts/AuthContext';

export default function Register() {
  const router = useRouter();
  const { signUp } = useAuthContext();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function cadastrar() {
    if (!email.includes('@')) {
      Alert.alert('Atenção', 'Informe um email válido.');
      return;
    }
    if (senha.length < 6) {
      Alert.alert('Atenção', 'A senha precisa ter ao menos 6 caracteres.');
      return;
    }
    if (senha !== confirmar) {
      Alert.alert('Atenção', 'As senhas não conferem.');
      return;
    }
    try {
      setCarregando(true);
      await signUp(email.trim(), senha);
      // O _layout redireciona para a home sozinho.
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View className="flex-1 justify-center bg-gray-50 p-6">
      <Text className="text-3xl font-bold text-indigo-600 mb-8 text-center">
        Criar conta
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
        className="bg-white border border-gray-300 rounded-lg p-3 mb-3"
        placeholder="Senha (mín. 6 caracteres)"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TextInput
        className="bg-white border border-gray-300 rounded-lg p-3 mb-6"
        placeholder="Confirmar senha"
        secureTextEntry
        value={confirmar}
        onChangeText={setConfirmar}
      />

      <TouchableOpacity
        className="bg-indigo-600 p-4 rounded-lg mb-3"
        disabled={carregando}
        onPress={cadastrar}
      >
        <Text className="text-white text-center font-bold">
          {carregando ? 'Aguarde...' : 'Criar conta'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/login')}>
        <Text className="text-indigo-600 text-center">
          Já tenho conta. Entrar
        </Text>
      </TouchableOpacity>
    </View>
  );
}