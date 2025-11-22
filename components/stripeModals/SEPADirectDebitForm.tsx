import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

interface SEPADirectDebitFormProps {
  clientSecret: string;
  onCompleted: () => void;
}

export default function SEPADirectDebitForm({ clientSecret, onCompleted }: SEPADirectDebitFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    if (!stripe || !elements) {
      setErrorMsg("Stripe não está carregado. Tente novamente.");
      setLoading(false);
      return;
    }

    const { error } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        // URL de retorno após vinculação do método SEPA
        return_url: "https://teu-pwa.com/sepa-vinculado",
        payment_method_data: {
          billing_details: {
            name: "Titular da conta",
          },
        },
      },
    });

    if (error) {
      setErrorMsg(error.message || "Erro desconhecido ao vincular SEPA.");
      setLoading(false);
      return;
    }

    // Sucesso
    onCompleted();
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{
      width: "100%",
      maxWidth: 420,
      margin: "0 auto",
      backgroundColor: "#111",
      padding: 20,
      borderRadius: 12,
      boxShadow: "0 0 10px rgba(0,0,0,0.4)",
    }}>
      <PaymentElement options={{ layout: "tabs" }} />

      {errorMsg && <p style={{ color: "#ff5252", marginTop: 10 }}>{errorMsg}</p>}

      <button
        disabled={!stripe || loading}
        style={{
          marginTop: 20,
          width: "100%",
          padding: 15,
          borderRadius: 10,
          backgroundColor: "#00e676",
          fontSize: 18,
          fontWeight: "700",
          color: "#000",
          opacity: !stripe || loading ? 0.6 : 1,
        }}
      >
        {loading ? "A processar..." : "Vincular Conta SEPA"}
      </button>
    </form>
  );
}