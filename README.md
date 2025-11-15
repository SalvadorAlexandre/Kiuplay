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

O Kiuplay oferecerá **duas modalidades de transação**:

### 1. 💵 Moeda Local  
Disponível apenas entre usuários da **mesma região**.

- Exemplo: se um produtor define o preço em **AOA (Kwanza)**, apenas compradores em **Angola** poderão pagar nessa moeda.  
- Essa modalidade estará disponível em:
  - 🇦🇴 **Angola**
  - 🇲🇿 **Moçambique**
  - 🇧🇷 **Brasil**
  - 🇪🇺 **Países da Zona do Euro (Eurozone)**

### 2. 🌍 Moeda Global (USD)  
Disponível para **todos os usuários**, independente da região.  

---

Dessa forma, produtores localizados nos países citados podem optar por vender em **moeda local** ou **global (USD)**,  
enquanto os demais produtores realizam transações apenas em **USD**.

---

📦 *Kiuplay: Conectando artistas, produtores e ouvintes numa única plataforma global.*


---

Aqui está o texto totalmente organizado, melhorado, estruturado e pronto para colocar no teu README, mantendo TODA a informação, mas com uma apresentação mais profissional:


---

🧾 Sistemas de Pagamento e Vendas

A nossa plataforma utiliza uma arquitetura de pagamentos robusta, escalável e flexível, capaz de suportar transações locais e globais, garantindo segurança e adaptação às necessidades dos utilizadores em diferentes regiões.


---

🔗 Gestão de Pagamentos com Stripe Connect

Implementamos o Stripe Connect para lidar com a complexidade de um marketplace.

Usamos o modelo Destination Charges, onde:

A plataforma realiza a cobrança do cliente.

O Stripe distribui automaticamente o valor entre o vendedor e a nossa comissão.


Este fluxo simplifica o repasse financeiro e garante transparência no processo.


---

🌍 Transações Locais e Globais

A plataforma adapta o sistema de pagamentos conforme a região e moeda.


---

🇧🇷 Brasil (BRL)

Pagamentos:

Aceitamos Pix, o método de pagamento instantâneo mais popular do país.


Saques (Payouts):

Os vendedores brasileiros recebem saques diretamente em contas bancárias locais.

Processamento diário após um período inicial de liberação.



---

🇪🇺 Zona Euro (EUR)

Pagamentos:

Transações processadas diretamente em euros (EUR).

Métodos suportados pela Stripe na região, como:

Cartões internacionais

Débito SEPA

Outros métodos locais europeus



Saques:

Vendedores recebem em contas bancárias locais, sempre em EUR.



---

🇦🇴 Angola (AOA) e 🇲🇿 Moçambique (MZN)

Pagamentos:

Para transações na mesma moeda local:

Kwanzas (AOA) → integração via Flutterwave

Meticais (MZN) → integração via Flutterwave



Logística de Pagamentos:

A plataforma identifica automaticamente moeda + localização do utilizador e seleciona o provedor correto.


Aviso:

O uso do Stripe nestes países é limitado apenas a transações em USD.



---

🌐 Transações Globais (USD)

Pagamentos:

Para utilizadores de qualquer região, são aceitos pagamentos em dólares (USD) utilizando:

Visa

Mastercard

American Express

Apple Pay

Google Pay



Conversão de Moeda:

A Stripe converte automaticamente para a moeda local do vendedor, quando aplicável.



---

Se quiser, posso criar uma versão ainda mais profissional, com emojis reduzidos, versão minimalista, versão técnica, ou até criar uma imagem/documentação gráfica do fluxo de pagamentos.