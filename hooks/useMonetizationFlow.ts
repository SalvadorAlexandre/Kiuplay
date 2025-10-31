// src/hooks/useMonetizationFlow.ts
import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import {
  selectUserWallets,
  selectActiveWallet,
  fetchUserWallets,
  selectWalletLoading,
  clearWallets,
  updateActiveWallet,
} from '@/src/redux/walletSlice';
import {
  selectUserCurrencyCode,
  selectUserAccountRegion,
  selectUserById,
  selectCurrentUserId
} from '@/src/redux/userSessionAndCurrencySlice';
import type { RootState } from '@/src/redux/store';

import { EUROZONE_COUNTRIES, LUSOPHONE_COUNTRIES } from '@/src/constants/regions';

/**
 * 🌎 Define o tipo de suporte de carteira com base na região
 */
const getWalletSupportType = (countryCode: string | undefined) => {
  if (!countryCode) return 'global';

  if (LUSOPHONE_COUNTRIES.includes(countryCode)) {
    return 'local_or_usd'; // pode escolher moeda local ou USD
  }

  if (EUROZONE_COUNTRIES.includes(countryCode)) {
    return 'euro_or_usd'; // pode escolher EUR ou USD
  }

  return 'usd_only'; // resto do mundo
};

export const useMonetizationFlow = () => {

  const router = useRouter();
  const dispatch = useAppDispatch();

  // 🔹 Dados de sessão e perfil
  //const currentUserId = useAppSelector((state: RootState) => state.users.currentUserId);
  //const userProfile = useAppSelector(selectUserById(currentUserId ?? ''));

  // 🔹 Dados de sessão e perfil
  const currentUserId = useAppSelector(selectCurrentUserId);
  const userProfile = useAppSelector(selectUserById(currentUserId ?? ''));

  // 🔹 Dados de moeda e região
  const userCurrency = useAppSelector(selectUserCurrencyCode);
  const userRegion = useAppSelector(selectUserAccountRegion);

  const walletSupportType = useMemo(
    () => getWalletSupportType(userRegion ?? undefined),
    [userRegion]
  );
  console.log('🌐 Tipo de suporte de carteira:', walletSupportType);

  // 🔹 Dados da carteira (do Redux)
  const wallets = useAppSelector(selectUserWallets);
  const activeWallet = useAppSelector(selectActiveWallet);
  const loadingWallets = useAppSelector(selectWalletLoading);

  // 🔹 Define dados financeiros padronizados (zerados por padrão)
  const defaultWallet = {
    balance: 0,
    pendingWithdrawals: 0,
    transactions: [],
    region: '',
    currency: ''
  };

  // 🔹 Novo estado local para controlar o modal
  const [walletModalVisible, setWalletModalVisible] = useState(false);
  const [hasLinkedWallet, setHasLinkedWallet] = useState(false);

  // 🔹 Carrega as carteiras do utilizador ao abrir a tela e limpa se não houver nenhuma
  useEffect(() => {
    if (currentUserId) {
      dispatch(fetchUserWallets(currentUserId))
        .unwrap()
        .then((wallets) => {
          if (!wallets || wallets.length === 0) {
            console.log('🧾 Nenhuma carteira vinculada → limpando estado Redux');
            dispatch(clearWallets());
          }
        })
        .catch((err) => {
          console.error('❌ Erro ao buscar carteiras:', err);
          dispatch(clearWallets()); // limpa também em caso de erro
        });
    } else {
      // Se o utilizador ainda não estiver logado → limpa também
      dispatch(clearWallets());
    }
  }, [dispatch, currentUserId]);


  // 🔹 Retorna dados formatados da carteira (reais ou zerados)
  const effectiveWallet = activeWallet || defaultWallet;

  // 🔹 Formatação monetária dinâmica (baseada na carteira ativa)
  const formattedBalance = useMemo(() => {
    if (!effectiveWallet) return '—';

    const locale = effectiveWallet.region || userRegion || 'en-US';
    const currency = effectiveWallet.currency || userCurrency || 'USD';

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(effectiveWallet.balance ?? 0);
  }, [
    effectiveWallet.balance,
    effectiveWallet.currency,
    effectiveWallet.region,
    userRegion,
    userCurrency,
  ]);

  const formattedPending = useMemo(() => {
    const locale = effectiveWallet?.region || userRegion || 'en-US';
    const currency = effectiveWallet?.currency || userCurrency || 'USD';

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(effectiveWallet?.pendingWithdrawals ?? 0);
  }, [
    effectiveWallet?.pendingWithdrawals,
    effectiveWallet?.currency,
    effectiveWallet?.region,
    userRegion,
    userCurrency,
  ]);


  /**
   * 🔍 Verifica se há conta vinculada e exibe o modal apropriado
   */
  const checkWalletStatusAndShowModal = useCallback(() => {
    try {
      console.log('👤 Usuário:', userProfile?.name);
      console.log('🌍 Região:', userRegion, '| 💰 Moeda:', userCurrency);
      console.log('🪙 Carteiras encontradas:', wallets);
      console.log('⚡ Carteira ativa:', activeWallet);

      if (loadingWallets) {
        console.log('⏳ Carregando carteiras...');
        return;
      }

      // Se existir carteira ativa → exibe o modal com lista
      // Senão → exibe modal com opção de vinculação
      const walletExists = !!activeWallet || (wallets && wallets.length > 0);
      setHasLinkedWallet(walletExists);
      setWalletModalVisible(true);

    } catch (error) {
      console.error('Erro ao verificar status da carteira:', error);
    }
  }, [userProfile, userRegion, userCurrency, wallets, activeWallet, loadingWallets]);

  const closeWalletModal = () => setWalletModalVisible(false);

  /**
  * 🔁 Limpa todas as contas vinculadas (para teste ou reset total)
  */
  const clearLinkedWallets = useCallback(() => {
    if (!wallets || wallets.length === 0) {
      console.log('⚠️ Nenhuma conta vinculada para limpar.');
      return;
    }

    console.log('🧹 Limpando todas as contas vinculadas...');
    dispatch(clearWallets());
    setHasLinkedWallet(false);
    console.log('✅ Contas bancárias desvinculadas com sucesso.');
  }, [dispatch, wallets]);

  const handleWalletAccess = useCallback(() => {
    try {
      console.log('👤 Usuário:', userProfile?.name);
      console.log('🌍 Região:', userRegion, '| 💰 Moeda:', userCurrency);
      console.log('🪙 Carteiras encontradas:', wallets);
      console.log('⚡ Carteira ativa:', activeWallet);

      if (loadingWallets) {
        console.log('⏳ Carregando carteiras...');
        return;
      }

      // 🔹 Independente do estado da carteira, vai direto para a tela principal
      console.log('➡️ Indo para o painel principal de monetização');
      router.push('/profileScreens/monetization/useMonetizationScreen');

    } catch (error) {
      console.error('Erro no fluxo de monetização:', error);
    }
  }, [router, userProfile, userRegion, userCurrency, wallets, activeWallet, loadingWallets]);

  /**
   * 🪙 Alterna a carteira ativa localmente (e futuramente sincroniza com o back-end)
  
  const handleSelectWallet = (walletId: string) => {
    console.log('🔁 Alternando carteira ativa para:', walletId);
    dispatch(updateActiveWallet(walletId));
  };
  */

  /**
 * 🪙 Alterna a carteira ativa localmente (e futuramente sincroniza com o back-end)
 */
  const handleSelectWallet = useCallback((walletId: string) => {
    try {
      console.log('🔁 Alternando carteira ativa para:', walletId);
      dispatch(updateActiveWallet(walletId));

      // marca que o usuário possui conta vinculada
      setHasLinkedWallet(true);

      // fecha o modal após selecionar
      setWalletModalVisible(false);

      console.log('✅ Carteira ativa atualizada com sucesso');
    } catch (err) {
      console.error('❌ Erro ao alternar carteira:', err);
    }
  }, [dispatch]);


  return {
    handleWalletAccess,
    userProfile,
    userCurrency,
    userRegion,


    // Carteira real ou zerada
    effectiveWallet,
    formattedBalance,
    formattedPending,

    activeWallet,
    wallets,
    loadingWallets,

    // estado e funções do modal
    walletModalVisible,
    hasLinkedWallet,
    checkWalletStatusAndShowModal,
    closeWalletModal,

    clearLinkedWallets,
    handleSelectWallet,

    walletSupportType
  };
};

/**
 * Decide o fluxo do utilizador com base na carteira
 * const handleWalletAccess = useCallback(() => {
  try {
    console.log('👤 Usuário:', userProfile?.name);
    console.log('🌍 Região:', userRegion, '| 💰 Moeda:', userCurrency);
    console.log('🪙 Carteiras encontradas:', wallets);
    console.log('⚡ Carteira ativa:', activeWallet);

    if (loadingWallets) {
      console.log('⏳ Carregando carteiras...');
      return;
    }

    if (!activeWallet) {
      console.log('🔸 Nenhuma conta vinculada → Redirecionando para vinculação');
      router.push('/profileScreens/monetization/linkWalletAccountScreen');
    } else {
      console.log('✅ Conta vinculada → Indo para o painel principal');
      router.push('/profileScreens/monetization/useMonetizationScreen');
    }
  } catch (error) {
    console.error('Erro no fluxo de monetização:', error);
  }
}, [router, userProfile, userRegion, userCurrency, wallets, activeWallet, loadingWallets]);

 */
/**
* Agora o fluxo apenas envia o utilizador para a tela principal de monetização.
* A lógica de verificação (se há ou não conta vinculada) será tratada lá.
*/