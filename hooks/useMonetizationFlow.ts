// src/hooks/useMonetizationFlow.ts
import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';
import { useRouter } from 'expo-router';
import React, { useCallback, useState, useMemo } from 'react';
import {
  clearWallets,
  updateActiveWallet,
} from '@/src/redux/walletSlice';
import {
  selectUserCurrencyCode,
  selectUserAccountRegion,
  selectUserById,
  selectCurrentUserId,
} from '@/src/redux/userSessionAndCurrencySlice';

export const useMonetizationFlow = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // 🔹 Dados de sessão e perfil
  const currentUserId = useAppSelector(selectCurrentUserId);
  const userProfile = useAppSelector(selectUserById(currentUserId!));

  // 🔹 Dados de moeda e região
  const userCurrency = useAppSelector(selectUserCurrencyCode);
  const userRegion = useAppSelector(selectUserAccountRegion);

  // 🔹 Carteiras do usuário diretamente do backend
  const wallets = userProfile?.wallets || []

  // 🔹 Carteira ativa: a que tiver status 'active'
  const activeWallet = wallets.find(w => w.status === 'active') || null;

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
  const [hasLinkedWallet, setHasLinkedWallet] = useState(wallets.length > 0);

  // 🔹 Retorna dados formatados da carteira (reais ou zerados)
  const effectiveWallet = activeWallet || defaultWallet;

  // 🔹 Formatação monetária dinâmica (baseada na carteira ativa)
  const formattedBalance = useMemo(() => {
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
    const locale = effectiveWallet.region || userRegion || 'en-US';
    const currency = effectiveWallet.currency || userCurrency || 'USD';

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(effectiveWallet.pendingWithdrawals ?? 0);
  }, [
    effectiveWallet.pendingWithdrawals,
    effectiveWallet.currency,
    effectiveWallet.region,
    userRegion,
    userCurrency,
  ]);

  // 💵 Valor disponível para saque
  const availableForWithdraw = useMemo(() => {
    const balance = effectiveWallet.balance ?? 0;
    const pending = effectiveWallet.pendingWithdrawals ?? 0;
    return Math.max(balance - pending, 0);
  }, [effectiveWallet.balance, effectiveWallet.pendingWithdrawals]);

  const formattedAvailableForWithdraw = useMemo(() => {
    const locale = effectiveWallet.region || userRegion || 'en-US';
    const currency = effectiveWallet.currency || userCurrency || 'USD';

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(availableForWithdraw);
  }, [availableForWithdraw, effectiveWallet.currency, effectiveWallet.region, userRegion, userCurrency]);

  /**
   * 🔍 Verifica se há conta vinculada e exibe o modal apropriado
   */
  const checkWalletStatusAndShowModal = useCallback(() => {
    if (!userProfile) return;

    console.log('👤 Usuário:', userProfile.name);
    console.log('🪙 Carteiras encontradas:', wallets);
    console.log('⚡ Carteira ativa:', activeWallet);

    const walletExists = wallets.length > 0;
    setHasLinkedWallet(walletExists);
    setWalletModalVisible(true);
  }, [wallets, userProfile, activeWallet]);

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
    if (!userProfile) return;

    console.log('👤 Usuário:', userProfile.name);
    console.log('🪙 Carteiras encontradas:', wallets);
    console.log('⚡ Carteira ativa:', activeWallet);

    console.log('➡️ Indo para o painel principal de monetização');
    router.push('/profileScreens/monetization/MonetizationPanelScreen');
  }, [router, userProfile, wallets, activeWallet]);

  /**
   * 🪙 Alterna a carteira ativa localmente
   */
  const handleSelectWallet = useCallback((walletId: string) => {
    const wallet = wallets.find(w => w.id === walletId);
    if (!wallet) return;

    setHasLinkedWallet(true);
    setWalletModalVisible(false);

    console.log('✅ Carteira ativa selecionada:', wallet);
  }, [wallets]);

  return {
    handleWalletAccess,
    userProfile,
    userCurrency,
    userRegion,

    effectiveWallet,
    formattedBalance,
    formattedPending,

    activeWallet,
    wallets,

    walletModalVisible,
    hasLinkedWallet,
    checkWalletStatusAndShowModal,
    closeWalletModal,

    clearLinkedWallets,
    handleSelectWallet,

    availableForWithdraw,
    formattedAvailableForWithdraw,
  };
};