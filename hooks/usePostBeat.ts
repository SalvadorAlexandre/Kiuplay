//hook/usePostBeat.ts
import { useState, useEffect, useMemo } from 'react'; // Importamos useMemo
import { useTranslation } from '@/src/translations/useTranslation';
import { Vibration } from 'react-native';

import { useSelector } from 'react-redux';
import { selectUserCurrencyCode, selectUserAccountRegion } from '@/src/redux/userSessionAndCurrencySlice';

import { EUROZONE_COUNTRIES, LUSOPHONE_COUNTRIES } from '@/src/constants/regions';




export const usePostBeat = () => {

    const { t } = useTranslation();

    // 1. Mapeamento Simples de Códigos de Moeda para Símbolos e Nomes
    // Necessário para renderizar o CurrencyInput e a Combo Box com informações visuais
    const CURRENCY_INFO_MAP: { [key: string]: { symbol: string, name: string } } = {
        USD: { symbol: '$', name: t('postBeat.currencyNames.USD') },
        EUR: { symbol: '€', name: t('postBeat.currencyNames.EUR') },
        AOA: { symbol: 'Kz', name: t('postBeat.currencyNames.AOA') },
        BRL: { symbol: 'R$', name: t('postBeat.currencyNames.BRL') },
        MZN: { symbol: 'MTn', name: t('postBeat.currencyNames.MZN') },
    };

    // 🔹 Obtém os dados regionais do usuário (do Redux)
    const userCurrency = useSelector(selectUserCurrencyCode);
    const userRegion = useSelector(selectUserAccountRegion);


    // 2. ✅ NOVO ESTADO: Moeda selecionada para a transação
    const [selectedCurrency, setSelectedCurrency] = useState(userCurrency || 'USD');

    // 3. ✅ NOVA LÓGICA: Calcula a lista de moedas disponíveis para o produtor.
    // Usamos useMemo para otimizar, dependendo apenas da região do usuário e do idioma.
    const availableCurrencies = useMemo(() => {
        // Opções padrão: Global (USD)
        const options = [{
            label: `USD - ${CURRENCY_INFO_MAP['USD'].name} (${t('postBeat.currency.global')})`,
            value: 'USD'
        }];

        let localCurrencyCode = null;

        if (LUSOPHONE_COUNTRIES.includes(userRegion || '')) {
            const mapLocal: Record<'AO' | 'BR' | 'MZ', string> = {
                AO: 'AOA',
                BR: 'BRL',
                MZ: 'MZN',
            };

            localCurrencyCode =
                mapLocal[userRegion as keyof typeof mapLocal] || null;
        } else if (EUROZONE_COUNTRIES.includes(userRegion || '')) {
            localCurrencyCode = 'EUR';
        }

        if (localCurrencyCode && localCurrencyCode !== 'USD') {
            const currencyInfo = CURRENCY_INFO_MAP[localCurrencyCode];

            // Adiciona a moeda local como primeira opção, se aplicável
            options.unshift({
                label: `${localCurrencyCode} - ${currencyInfo.name} (${t('postBeat.currency.local')})`,
                value: localCurrencyCode
            });
        }

        // Garante que a EUR seja adicionada corretamente, se for o caso.
        if (localCurrencyCode === 'EUR' && !options.find(opt => opt.value === 'EUR')) {
            options.unshift({
                label: `EUR - ${CURRENCY_INFO_MAP['EUR'].name} (${t('postBeat.currency.local')})`,
                value: 'EUR'
            });
        }

        return options;
    }, [userRegion, t]);


    // 4. ✅ NOVO CÁLCULO: Obtém o símbolo da moeda selecionada dinamicamente
    const currentCurrency = useMemo(() => {
        // Usa o mapa para buscar as informações, com USD como fallback
        return CURRENCY_INFO_MAP[selectedCurrency] || CURRENCY_INFO_MAP['USD'];
    }, [selectedCurrency]);


    // --- Campos básicos (Sem Alteração) ---
    const [nomeProdutor, setNomeProdutor] = useState('');
    const [tituloBeat, setTituloBeat] = useState('');
    const [generoBeat, setGeneroBeat] = useState('');

    // ✅ Estado 'preco' para o valor NUMÉRICO (necessário para CurrencyInput)
    const [preco, setPreco] = useState<number | null>(null);

    const [tipoLicencaOpen, setTipoLicencaOpen] = useState(false)
    const [tipoLicenca, setTipoLicenca] = useState<string | null>(null);
    const [tipoLicencaItems, setTipoLicencaItems] = useState<any[]>([]);
    const [capaBeat, setCapaBeat] = useState<any>(null);
    const [beatFile, setBeatFile] = useState<any>(null);
    const [precoError, setPrecoError] = useState<string | null>(null);

    // ✅ NOVO ESTADO: Para controlar se o DropDownPicker está aberto
    const [currencyPickerOpen, setCurrencyPickerOpen] = useState(false);


    // ✅ Atualiza os textos das opções sempre que o idioma mudar (Sem Alteração)
    useEffect(() => {
        setTipoLicencaItems([
            { label: t('postBeat.licenseTypes.exclusive'), value: 'exclusivo' },
            { label: t('postBeat.licenseTypes.free'), value: 'livre' },
        ]);
    }, [t]);

    // --- Placeholder padrão ---
    // ✅ Agora o placeholder usa o símbolo da moeda selecionada
    const precoPlaceholder = `${currentCurrency.symbol} ${t('postBeat.pricePlaceholder') || '0.00'}`;


    // 5. ✅ NOVA FUNÇÃO: Altera a moeda selecionada (para o Picker)
    const handleCurrencyChange = (currencyValue: string) => {
        setSelectedCurrency(currencyValue);
        // Resetar preço e erro para evitar confusão na mudança de moeda.
        setPreco(null);
        setPrecoError(null);
    };


    // --- Lógica de alteração e validação do preço (handlePrecoChange) ---
    // ✅ Recebe apenas o valor numérico limpo do CurrencyInput
    const handlePrecoChange = (numericValue: number | null) => {

        console.log('📊 numericValue recebido:', numericValue);

        setPreco(numericValue); // Salva o valor numérico limpo no estado
        setPrecoError(null);

        // Se o valor for null ou 0, não há validação de min/max a ser feita
        if (numericValue === null || numericValue === 0) {
            return;
        }

        if (isNaN(numericValue)) {
            setPrecoError(t('postBeat.errors.onlyNumbers'));
            return;
        }

        // ⚠️ NOTA: Os limites (minValue, maxValue) estão fixos em USD, 
        // mas o erro agora usará o símbolo da moeda selecionada.
        const minValue = 1;      // mínimo permitido
        const maxValue = 10000; // máximo permitido

        // --- Validação Direta ---
        if (numericValue < minValue) {
            // ✅ Usa o símbolo dinâmico no erro
            setPrecoError(`${t('postBeat.errors.minValue')} ${minValue.toFixed(2)} ${selectedCurrency}`);
            Vibration.vibrate(100);
            return;
        }

        if (numericValue > maxValue) {
            // ✅ Usa o símbolo dinâmico no erro
            setPrecoError(`${t('postBeat.errors.maxValue')} ${maxValue.toFixed(2)} ${selectedCurrency}`);
            Vibration.vibrate(100);
            return;
        }
    };

    // ... useEffect de licença (Sem Alteração) ...


    return {
        // --- Campos básicos ---
        nomeProdutor, setNomeProdutor,
        tituloBeat, setTituloBeat,
        generoBeat, setGeneroBeat,

        // --- Preço e Lógica de Moeda ---
        preco, handlePrecoChange, setPreco,
        precoError,
        precoPlaceholder,

        // 6. ✅ NOVOS RETORNOS para o componente de Moeda
        availableCurrencies, // Lista de moedas para a Combo Box (Picker)
        selectedCurrency, // Valor da moeda atualmente selecionada
        handleCurrencyChange, // Função para o onChange da Combo Box
        currentCurrencySymbol: currentCurrency.symbol, // Símbolo para o CurrencyInput (ex: '$', 'Kz')

        // --- Licença e Arquivos ---
        tipoLicencaOpen, setTipoLicencaOpen,
        tipoLicenca, setTipoLicenca,
        tipoLicencaItems, setTipoLicencaItems,
        capaBeat, setCapaBeat,
        beatFile, setBeatFile,
        setCurrencyPickerOpen, currencyPickerOpen
    };
};