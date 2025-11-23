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
        width: "90%",
        margin: "0 auto",
        //backgroundColor: "#535252ff",
        padding: "5%", // em vez de 20px fixo
        borderRadius: 12,
        //boxShadow: "0 0 10px rgba(0,0,0,0.4)",
      }}
    >
      {/* O PaymentElement já é responsivo por padrão */}
     <PaymentElement options={{ layout: window.innerWidth < 480 ? "accordion" : "tabs" }} />

      {errorMsg && <p style={{ color: "#ff5252", marginTop: 10 }}>{errorMsg}</p>}

      <div style={{ textAlign: "center" }}>
        <button
          disabled={!stripe || loading}
          style={{
            marginTop: 20,
            width: "90%",
            padding: 12,
            borderRadius: 10,
            backgroundColor: '#1e90ff',
            fontSize: 16,
            fontWeight: "700",
            color: "#fff",
            opacity: !stripe || loading ? 0.6 : 1,
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "A processar..." : "Vincular Cartão"}
        </button>
      </div>
    </form>
  );
}


{/**<button
        disabled={!stripe || loading}
        style={{
          marginTop: 20,
          width: "100%", // Garante que o botão ocupe 100% da largura disponível
          padding: 12,
          borderRadius: 10,
          backgroundColor: "#00e676",
          fontSize: 16,
          fontWeight: "700",
          color: "#fff",
          opacity: !stripe || loading ? 0.6 : 1,
          //display: 'block',
          //marginLeft: 'auto',
          //marginRight: 'auto',
          border: 'none', // Adicionado para garantir estilo consistente do botão
          cursor: 'pointer', // Adicionado para melhor UX
        }}
      >
        {loading ? "A processar..." : "Vincular Cartão Global"}
      </button> */}