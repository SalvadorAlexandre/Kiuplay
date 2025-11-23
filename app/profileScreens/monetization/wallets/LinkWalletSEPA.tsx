// /profileScreens/monetization/wallets/LinkWalletSEPA.tsx
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
// Altere este import se você tiver um componente de formulário diferente para SEPA
import SEPADirectDebitForm from "@/components/stripeModals/SEPADirectDebitForm";
import { createSepaSetupIntent, } from "@/src/api/stripeApi";
import { Stack } from "expo-router";
import { tokenStorage } from "@/src/utils/tokenStorage";

export default function LinkWalletEUR() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [publishableKey, setPublishableKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSetupSecret() {
      try {
        //const token = await tokenStorage.getToken();
        //console.log("Token de autenticação:", token); // Verifica se o token está presente
        const data = await createSepaSetupIntent(); // Usa o API centralizado
        setClientSecret(data.clientSecret);
        setPublishableKey(data.publishableKey);
      } catch (err: any) {
        console.error("Erro ao buscar SetupIntent para SEPA:", err);
        setError("Não foi possível carregar o formulário SEPA.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchSetupSecret();
  }, []);

  // Antes, tinha argumento paymentMethodId
  // const handleCompleted = async (paymentMethodId: string) => { ... }

  // Agora, apenas mensagem ou callback sem argumento
  const handleCompleted = () => {
    alert("Conta SEPA vinculada com sucesso!");
    // ⚡ Não chamamos confirmWalletLink no frontend
  };

  const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

  if (isLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Vinculação',
            headerStyle: { backgroundColor: '#191919' },
            headerTintColor: '#fff',
          }}
        />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>A carregar a vinculação SEPA (Zona Euro)...</Text>
        </View>
      </>

    );

  }

  if (error) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Erro',
            headerStyle: { backgroundColor: '#191919' },
            headerTintColor: '#fff',
          }}
        />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Erro: {error}</Text>
        </View>
      </>

    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Vinculação',
          headerStyle: { backgroundColor: '#191919' },
          headerTintColor: '#fff',
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false} // desativa a barra de rolagem
      >
        {clientSecret && stripePromise && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <SEPADirectDebitForm
              clientSecret={clientSecret}
              onCompleted={handleCompleted}
            />
          </Elements>
        )}
        {!clientSecret && !isLoading && (
          <Text style={styles.errorText}>Configuração de vinculação indisponível.</Text>
        )}
      </ScrollView>
    </>

  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#191919',
    width: '100%',
    marginHorizontal: 'auto',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
  loadingText: {
    color: '#aaa',
    marginTop: 10,
  },
  errorText:
  {
    color: 'red',
    marginTop: 10,
  },
});