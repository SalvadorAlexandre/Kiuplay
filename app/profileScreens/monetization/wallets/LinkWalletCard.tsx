// /profileScreens/monetization/wallets/LinkWalletCard.tsx
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native'; // Adicionado StyleSheet para melhor prática
import GlobalCardSetupForm from "@/components/stripeModals/globalCardSetUpForm";
import { stripeApi } from "@/src/api/stripeApi";
import { Stack } from "expo-router";

export default function LinkWalletGlobal() {
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    // publishableKey agora é definido pelo backend
    const [publishableKey, setPublishableKey] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSetup() {
            try {
                const data = await stripeApi.fetchGlobalCardSetup();
                setClientSecret(data.clientSecret);
                setPublishableKey(data.publishableKey);
            } catch (err: any) {
                console.error("Erro ao buscar SetupIntent:", err);
                setError("Não foi possível carregar o formulário de pagamento.");
            } finally {
                setIsLoading(false);
            }
        }
        fetchSetup();
    }, []);

    const handleCompleted = () => {
        alert("Cartão vinculado com sucesso!");
        // 💡 AÇÃO: Adicione a lógica de redirecionamento ou atualização de estado aqui
        // router.push('/monetization'); 
    };

    // -------------------------------------------------------------
    // INICIALIZAÇÃO DINÂMICA: Usa a chave publicável assim que estiver disponível
    // -------------------------------------------------------------
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
                    <Text style={styles.loadingText}>A carregar a vinculação global...</Text>
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

    // O componente só renderiza se o clientSecret e a Promise do Stripe (com a public key) estiverem prontos
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
                        <GlobalCardSetupForm
                            clientSecret={clientSecret}
                            onCompleted={handleCompleted}
                        />
                    </Elements>
                )}
                {!clientSecret && !isLoading && (
                    <Text style={styles.errorText}>Configuração de pagamento indisponível.</Text>
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
        backgroundColor: '#191919',
    },
    loadingText: {
        color: '#aaa',
        marginTop: 10,
    },
    errorText: {
        color: 'red',
        marginTop: 10,
    },
});