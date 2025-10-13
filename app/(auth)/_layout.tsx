// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    // Usa Stack para permitir navegação entre Login/Cadastro
    <Stack>
      <Stack.Screen 
        name="sign-in" 
        options={{ 
          headerShown: false, // Oculta o cabeçalho nativo
        }} 
      />
      {/* Adicione outras telas de autenticação aqui (ex: sign-up, forgot-password) */}
      <Stack.Screen 
        name="sign-up" 
        options={{ 
          headerShown: false,
        }} 
      />
    </Stack>
  );
}