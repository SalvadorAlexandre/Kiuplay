import { useSelector } from 'react-redux';
import { selectUserCurrencyCode, selectUserAccountRegion } from '@/src/redux/userSessionAndCurrencySlice';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';

export const useMonetizationFlow = () => {
  const router = useRouter();

  // 🔹 Obtém dados da região e moeda do Redux
  const userCurrency = useSelector(selectUserCurrencyCode);
  const userRegion = useSelector(selectUserAccountRegion);

  /**
   * Verifica se o utilizador tem conta vinculada e decide o fluxo
   */
  const handleWalletAccess = useCallback(async () => {
    try {
      console.log('Kiuplay Wallet: 🌍 Região:', userRegion, '| 💰 Moeda:', userCurrency);

      // 🔹 Mock inicial (depois virá do backend)
      const hasLinkedAccount = false;

      if (!hasLinkedAccount) {
        console.log('🔸 Nenhuma conta vinculada → Redirecionando para vinculação');
        router.push('/profileScreens/monetization/linkWalletAccountScreen');
      } else {
        console.log('✅ Conta vinculada → Indo para o painel principal');
        router.push('/profileScreens/monetization/useMonetizationScreen');
      }
    } catch (error) {
      console.error('Erro no fluxo de monetização:', error);
    }
  }, [router, userRegion, userCurrency]);

  return {
    handleWalletAccess,
    userCurrency,
    userRegion
  };
};