// src/utils/formatters.ts

/**
 * Formata um valor numérico para o formato de moeda específico de um locale.
 *
 * @param price O valor numérico a ser formatado (Ex: 79 ou 49.99).
 * @param userLocale O código de localização do usuário (Ex: 'pt-BR', 'en-US').
 * @param userCurrencyCode O código da moeda (Ex: 'BRL', 'USD', 'EUR').
 * @returns O preço formatado como string (Ex: "R$ 79,00" ou "$49.99").
 */
export const formatPrice = (price: number, userLocale: string, userCurrencyCode: string): string => {
    // Definimos o locale do país/formato do número
    // E definimos a moeda (currency)
    try {
        return price.toLocaleString(userLocale, {
            style: 'currency',
            currency: userCurrencyCode,
            // ESSENCIAL: Garante que valores inteiros como 79.00 sejam exibidos com duas casas decimais (79,00)
            minimumFractionDigits: 2, 
        });
    } catch (error) {
        console.error("Erro na formatação da moeda:", error);
        // Fallback: retorna o valor fixo com 2 casas e o código da moeda em caso de erro.
        // Isso garante que algo seja exibido.
        return `${userCurrencyCode} ${price.toFixed(2)}`;
    }
};

// Você pode adicionar outras funções de formatação (datas, números grandes) neste arquivo.