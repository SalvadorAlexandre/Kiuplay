// src/hooks/useMonetizationFlow.ts
import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  selectUserWallets,
  selectActiveWallet,
  fetchUserWallets,
  selectWalletLoading
} from '@/src/redux/walletSlice';
import {
  selectUserCurrencyCode,
  selectUserAccountRegion,
  selectUserById,
  selectCurrentUserId
} from '@/src/redux/userSessionAndCurrencySlice';
import type { RootState } from '@/src/redux/store';


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

  // 🔹 Dados da carteira (do Redux)
  const wallets = useAppSelector(selectUserWallets);
  const activeWallet = useAppSelector(selectActiveWallet);
  const loadingWallets = useAppSelector(selectWalletLoading);

  // 🔹 Novo estado local para controlar o modal
  const [walletModalVisible, setWalletModalVisible] = useState(false);
  const [hasLinkedWallet, setHasLinkedWallet] = useState(false);


  // 🔹 Carrega as carteiras mockadas ao abrir a tela
  useEffect(() => {
    if (currentUserId) {
      dispatch(fetchUserWallets(currentUserId));
    }
  }, [dispatch, currentUserId]);

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

  return {
    handleWalletAccess,
    userProfile,
    userCurrency,
    userRegion,
    activeWallet,
    wallets,
    loadingWallets,

    // estado e funções do modal
    walletModalVisible,
    hasLinkedWallet,
    checkWalletStatusAndShowModal,
    closeWalletModal,
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