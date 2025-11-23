// components/globalCardSetUpForm
import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

interface GlobalCardSetupFormProps {
  clientSecret: string;
  onCompleted: () => void;
}

export default function GlobalCardSetupForm({
  clientSecret,
  onCompleted,
}: GlobalCardSetupFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!clientSecret) {
    return (
      <div
        style={{
          color: "dark",
          textAlign: "center",
          padding: 20,
        }}
      >
        A iniciar formulário de pagamento...
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    if (!stripe || !elements) {
      setErrorMsg(
        "Stripe não está carregado. Tente novamente em alguns segundos."
      );
      setLoading(false);
      return;
    }

    const { error } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: "https://teu-pwa.com/cartao-vinculado",
        payment_method_data: {
          billing_details: {
            name: "Titular do cartão",
          },
        },
      },
    });

    if (error) {
      setErrorMsg(error.message || "Ocorreu um erro desconhecido");
      setLoading(false);
      return;
    }

    onCompleted();
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        // O formulário ocupa 100% da largura do contêiner pai
        width: "100%",
        // Define uma largura máxima para telas maiores (desktop)
        maxWidth: 400,
        // Centraliza o formulário horizontalmente
        margin: "0 auto",

        // Estilo visual do contêiner
        backgroundColor: "#111",
        padding: "5%", // em vez de 20px fixo
        borderRadius: 12,
        boxShadow: "0 0 10px rgba(0,0,0,0.4)",
      }}
    >
      {/* O PaymentElement já é responsivo por padrão */}
      <PaymentElement options={{ layout: window.innerWidth < 480 ? "accordion" : "tabs" }} />

      {errorMsg && <p style={{ color: "#ff5252", marginTop: 10 }}>{errorMsg}</p>}

      <button
        disabled={!stripe || loading}
        style={{
          marginTop: 20,
          width: "100%", // Garante que o botão ocupe 100% da largura disponível
          padding: '9%',
          borderRadius: 10,
          backgroundColor: "#00e676",
          fontSize: 16,
          fontWeight: "700",
          color: "#000",
          opacity: !stripe || loading ? 0.6 : 1,
          border: 'none', // Adicionado para garantir estilo consistente do botão
          cursor: 'pointer', // Adicionado para melhor UX
        }}
      >
        {loading ? "A processar..." : "Vincular Cartão Global"}
      </button>
    </form>
  );
}