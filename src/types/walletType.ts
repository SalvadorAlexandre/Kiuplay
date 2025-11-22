// src/types/walletType.ts
import { UserProfile } from './contentType';

/**
 * Define o tipo de provedor da carteira
 * - 'local' → Provedores regionais (ex: Multicaixa, eKwanza)
 * - 'international' → Provedores globais (ex: PayPal, Revolut)
 */
export type WalletProviderType = 'local' | 'international';

/**
 * Representa uma carteira vinculada à conta do utilizador.
 */
export interface LinkedWallet {
  id: string;
  provider: string;             // Ex: 'Multicaixa', 'PayPal', 'Revolut'
  type: WalletProviderType;     // 'local' ou 'international'
  status: 'active' | 'inactive';
  currency: string;             // Ex: 'AOA', 'USD', 'EUR'
  region: string;              //  Ex: 'pt-AO', 'en-US', 'pt-PT'
  accountId: string;            // Ex: número de conta ou email do PayPal
  balance: number;              // Saldo atual (simulado)
  /**Valor de saques pendentes */
  pendingWithdrawals?: number;  // <-- ADICIONA ESTA LINHA
  createdAt: string;            // Data de criação (ISO)
  lastTransactionDate?: string; // Data da última transação (ISO)
  userId: string;               // ID do dono da carteira
  user?: UserProfile;           // Referência opcional ao perfil do usuário
  transactions?: WalletTransaction[]; // Histórico opcional de transações
}

/**
 * 🧾 Representa uma transação dentro da carteira vinculada.
 */
export interface WalletTransaction {
  id: string;
  //  Identificador único da transação (ex: 'tx-001')

  type: 'sale' | 'withdrawal' ;
  //  Tipo da transação:
  // 'withdrawal' → saque ou transferência de saída
 

  amount: number;
  //  Valor movimentado (positivo = entrada, negativo = saída)

  date: string;
  //  Data da transação em formato ISO (ex: '2025-10-25T14:32:00Z')

  description?: string;
  //  Descrição textual opcional (ex: "Compra de beat exclusivo ‘TrapSoul Vibes’")

  status: 'completed' | 'pending' | 'failed';
  //  Estado atual da transação

  relatedContentId?: string;
  //  ID do conteúdo relacionado (ex: ID do beat, single, promoção, etc.)

  relatedContentType?: 'beat';
  //  Tipo do conteúdo relacionado:
}