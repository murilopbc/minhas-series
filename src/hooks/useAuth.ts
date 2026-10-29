import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import type { AuthContextType } from '../types/auth';

WebBrowser.maybeCompleteAuthSession();

const MENSAGENS: Record<string, string> = {
  'auth/invalid-credential': 'Email ou senha incorretos.',
  'auth/invalid-email': 'Email inválido.',
  'auth/user-not-found': 'Email ou senha incorretos.',
  'auth/wrong-password': 'Email ou senha incorretos.',
  'auth/email-already-in-use': 'Este email já está cadastrado.',
  'auth/weak-password': 'A senha precisa ter ao menos 6 caracteres.',
  'auth/too-many-requests': 'Muitas tentativas. Tente novamente em instantes.',
  'auth/network-request-failed': 'Sem conexão com a internet.',
};

function traduzirErro(error: unknown): string {
  const code = (error as { code?: string })?.code ?? '';
  return MENSAGENS[code] ?? 'Não foi possível autenticar. Tente novamente.';
}

const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';

export function useAuth(): AuthContextType {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // O hook do Google exige um client ID para a plataforma atual e quebra o app
  // se vier vazio. O texto de fallback evita o crash;
  // signInWithGoogle avisa se não estiver configurado.
  const googleClientId = GOOGLE_WEB_CLIENT_ID || 'nao-configurado';

  const [request, googleResponse, promptGoogle] = Google.useIdTokenAuthRequest({
    webClientId: googleClientId,
    androidClientId: googleClientId,
    iosClientId: googleClientId,
  });

  // DIAGNÓSTICO: mostra no terminal o endereço de retorno enviado ao Google.
  // Pode apagar depois de resolver.
  useEffect(() => {
    if (request) console.log('Google redirectUri:', request.redirectUri);
  }, [request]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Quando o Google devolve o token, troca por uma credencial do Firebase
  useEffect(() => {
    if (googleResponse?.type !== 'success') return;

    const idToken = googleResponse.params.id_token;
    const credential = GoogleAuthProvider.credential(idToken);

    signInWithCredential(auth, credential).catch((error) =>
      Alert.alert('Erro', traduzirErro(error)),
    );
  }, [googleResponse]);

  const signIn = useCallback(async (email: string, senha: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, senha);
    } catch (error) {
      throw new Error(traduzirErro(error));
    }
  }, []);

  const signUp = useCallback(async (email: string, senha: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, senha);
    } catch (error) {
      throw new Error(traduzirErro(error));
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!GOOGLE_WEB_CLIENT_ID) {
      Alert.alert('Google', 'Login com Google não configurado no .env.');
      return;
    }
    await promptGoogle();
  }, [promptGoogle]);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
  }, []);

  return { user, loading, signIn, signUp, signInWithGoogle, signOut };
}