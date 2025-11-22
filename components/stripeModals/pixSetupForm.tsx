// src/components/stripeModals/pixSetupForm.tsx
// src/components/stripeModals/pixSetupForm.tsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
    PaymentElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';

interface PixSetupFormProps {
    clientSecret: string;
    onCompleted: () => void;
}

export default function PixSetupForm({
    clientSecret,
    onCompleted,
}: PixSetupFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // Não é mais React.FormEvent<HTMLFormElement> pois estamos no React Native
    const handleSubmit = async () => { 
        setLoading(true);
        setErrorMsg('');

        if (!stripe || !elements) {
            setErrorMsg('Stripe não está carregado. Tente novamente.');
            setLoading(false);
            return;
        }
        
        // 🚀 CORREÇÃO APLICADA: Desestruturamos APENAS 'error' do resultado.
        // Isso resolve o problema de tipagem do TypeScript.
        const { error } = await stripe.confirmSetup({
            elements,
            confirmParams: {
                // URL de retorno. Mesmo no RN, o Stripe pode redirecionar para autenticação.
                return_url: "https://teu-pwa.com/pix-vinculado", 
            },
            // Se necessário, adicione aqui payment_method_data com billing_details
        });

        if (error) {
            // Se houver um erro, exibe a mensagem.
            setErrorMsg(error.message || 'Falha na vinculação da conta Pix.');
            setLoading(false);
            return;
        }

        // Se o objeto 'error' for nulo (ou undefined), o SetupIntent foi iniciado/concluído com sucesso.
        // O Stripe lida com o estado final (succeeded) ou assíncrono (processing) após o redirecionamento.
        onCompleted();
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Vincular Conta Pix/BRL</Text>
            <Text style={styles.subtitle}>
                Preencha os dados da conta para receber e fazer pagamentos no Brasil.
            </Text>

            <View style={styles.formGroup}>
                {/* O PaymentElement adaptará a interface para os métodos BRL/Pix suportados para SetupIntent */}
                <PaymentElement
                    options={{
                        layout: 'tabs', 
                    }}
                />
            </View>

            {errorMsg ? (
                <Text style={styles.errorText}>{errorMsg}</Text>
            ) : null}

            <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit} 
                disabled={!stripe || loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Vinculando...' : 'Confirmar Vinculação'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#191919',
        borderRadius: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#aaa',
        marginBottom: 20,
    },
    formGroup: {
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#00e676', // Cor vibrante para o botão (adaptado do seu exemplo SEPA)
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#000', // Cor do texto para contraste com o botão
        fontWeight: 'bold',
        fontSize: 16,
    },
    errorText: {
        color: '#FF4500',
        textAlign: 'center',
        marginBottom: 10,
    },
});