import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import { AuthProvider } from './context/AuthContext';

export default function Layout() {
  
  return (
    <AuthProvider>
      <>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#007AFF' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
            headerShown: false
          }}
        />
        <Toast />
      </>
    </AuthProvider>
  );
}
