import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useAuth } from './context/AuthContext';


export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, token, loading } = useAuth();
  const router = useRouter();
  const [secure, setSecure] = useState(true);

  const handleLogin = async () => {
    const success = await login(email, password);
    if (success) {
      setTimeout(() => {
        router.replace('/eventos');
        Toast.show({
          type: 'success',
          text1: 'Inicio de sesión exitoso',
          text2: 'Bienvenido de nuevo',
        });
      }, 100);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error al iniciar sesión',
        text2: 'Verificá tu correo y contraseña',
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={require('../assets/images/logo_app.png')}
          style={styles.logo}
        />
        <Text style={styles.brand}>CONVIVO</Text>
        <Text style={styles.subtitle}>Eventos que unen</Text>

        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          placeholder="Escribí tu correo"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <Text style={styles.label}>Contraseña</Text>
        <View style={styles.passwordRow}>
          <TextInput
            placeholder="Escribí tu contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secure}
            style={[styles.input, { flex: 1 }]}
          />
          <TouchableOpacity onPress={() => setSecure(!secure)}>
            <Text style={{ paddingHorizontal: 10 }}>{secure ? '🙈' : '🐵'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <Pressable onPress={() => router.push('/recuperar')}>
          <Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    elevation: 3,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 12,
  },
  brand: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 6,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  forgot: {
    color: '#007AFF',
    marginTop: 20,
    fontSize: 14,
  },
});
