// /profileScreens/monetization/regions/LinkWalletBankGlobalUSD.tsx
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import GlobalCardSetupForm from "@/components/globalCardSetUpForm";

// Chave pública de teste
const stripePromise = loadStripe("pk_test_51STf7SDoV26XifhH2f2wde81tPWvAExUG0wHTwhuW7JmYLDAyIBIUV2Pl52274b5SuYiTOnnpXvTgWc7BwNRVxac00gMCv6hid");

export default function LinkWalletBankGlobalUSD() {
  // clientSecret de teste (substituir pelo backend depois)
  const [clientSecret] = useState(
    "seti_1STg6jDoV26XifhHipwzAnNV_secret_TQXBk6jkE09pbwsL03AHKFYaNBBiueG"
  );

  const handleCompleted = () => {
    alert("Cartão vinculado com sucesso!");
  };

  return (
    <>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <GlobalCardSetupForm
          clientSecret={clientSecret}
          onCompleted={handleCompleted}
        />
      </Elements>
    </>
  );
}