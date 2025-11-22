---

# 🎵 Kiuplay

**Kiuplay** é um aplicativo de **streaming musical** e **marketplace de instrumentais exclusivos** para compra e venda.

---

## 🧠 Tecnologias

- **Expo Web**
- **React Native**
- **Node.js**
- **TypeScript / JavaScript**

O objetivo é disponibilizar o Kiuplay para dispositivos **Android** e **iOS**.  
Atualmente, o projeto está sendo desenvolvido na versão **web**, otimizada para rodar como um **PWA (Progressive Web App)**,  
por ser uma alternativa mais acessível do que criar versões nativas separadas.

---

## 💰 Lógica de Pagamento

Perfeito — removi completamente Angola e Moçambique da lógica de moeda local e eliminei qualquer menção ao Flutterwave.
Agora o sistema fica muito mais simples e 100% baseado em Stripe, funcionando assim:

Brasil → Stripe (Pix)

Zona Euro → Stripe (SEPA)

Global → Stripe (Cartões + carteiras digitais)

Angola / Moçambique / outros países → apenas USD (global)

Aqui está o texto totalmente atualizado:


---

💰 Lógica de Pagamentos — Versão Final (Sem Flutterwave)

O Kiuplay utiliza uma arquitetura de pagamentos totalmente baseada em Stripe Connect, garantindo segurança, simplicidade e suporte global.


---

🌍 Modalidades de Transação

1. 💵 Moeda Local

Disponível apenas para regiões suportadas pela Stripe com recepção local:

🇧🇷 Brasil (BRL — Pix)

🇪🇺 Zona Euro (EUR — SEPA)


Produtores destas regiões podem vender usando sua moeda local.

2. 🌍 Moeda Global (USD)

Disponível para todos os países, inclusive:

Angola

Moçambique

Cabo Verde

Guiné-Bissau

Todos os restantes


Produtores fora das regiões suportadas vendem somente em USD.


---

🔗 Stripe Connect — Funcionamento Geral

Utilizamos Destination Charges, onde:

O cliente paga via Stripe.

A Stripe divide automaticamente:

💰 valor do produtor

💼 comissão do Kiuplay



Garantindo transparência e automatização completa.


---

🌐 Suporte por Região


---

🇧🇷 Brasil — BRL

Pagamentos

✔️ Pix via Stripe
Rápido, barato e amplamente utilizado no país.

Saques

✔️ Stripe envia diretamente para contas bancárias brasileiras em BRL.


---

🇪🇺 Zona Euro — EUR

Pagamentos

✔️ SEPA Direct Debit (Stripe)
✔️ Cartões internacionais e europeus
✔️ Outros métodos locais suportados pela Stripe

Saques

✔️ Sempre em contas bancárias locais em EUR.


---

🌍 Global (USD)

Para qualquer país.

Pagamentos

✔️ Cartões (Visa, Mastercard, Amex)
✔️ Apple Pay
✔️ Google Pay
✔️ PayPal (opcional)

Conversão

✔️ Stripe converte USD → moeda local do produtor (somente em países suportados)


---

Status Atual

✔️ Sistema 100% Stripe
✔️ Moeda local apenas Brasil e Eurozone
✔️ Restante do mundo → USD