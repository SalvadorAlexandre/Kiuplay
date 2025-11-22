// /profileScreens/monetization/regions/LinkWalletEU.tsx
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
// 💡 Altere este import se você tiver um componente de formulário diferente para SEPA
import SepaSetupForm from "@/components/stripeModals/SEPADirectDebitForm"; 

export default function LinkWalletEU() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [publishableKey, setPublishableKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSetupSecret() {
      try {
        // Chamada para o mesmo endpoint de SetupIntent
        const response = await fetch('http://localhost:3000/payments/setup-card', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // 🚨 Inclua o token de autenticação aqui
          },
        });

        if (!response.ok) {
          throw new Error('Falha ao obter a configuração SEPA do Stripe. Status: ' + response.status);
        }

        const data = await response.json();
        
        // Armazena ambas as chaves
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

  const handleCompleted = () => {
    alert("Conta SEPA vinculada com sucesso!");
    // 💡 Redirecionar para o painel de monetização
  };

  const stripePromise = publishableKey ? loadStripe(publishableKey) : null;
  
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>A carregar a vinculação SEPA (Zona Euro)...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Erro: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <SepaSetupForm
            clientSecret={clientSecret}
            onCompleted={handleCompleted}
          />
        </Elements>
      )}
      {!clientSecret && !isLoading && (
        <Text style={styles.errorText}>Configuração de vinculação indisponível.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#111', },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111', },
    loadingText: { color: '#aaa', marginTop: 10, },
    errorText: { color: 'red', marginTop: 10, },
});