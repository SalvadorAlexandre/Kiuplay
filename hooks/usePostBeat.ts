

import { useState, useEffect } from 'react';
import { useTranslation } from '@/src/translations/useTranslation';
import { Vibration } from 'react-native';


export const usePostBeat = () => {

    const { t } = useTranslation();

    // --- Campos básicos ---
    const [nomeProdutor, setNomeProdutor] = useState('');
    const [tituloBeat, setTituloBeat] = useState('');
    const [generoBeat, setGeneroBeat] = useState('');
    //const [preco, setPreco] = useState('');
    // ✅ NOVO: O estado 'preco' agora armazena o valor NUMÉRICO (number ou null)
    // O componente CurrencyInput espera um número.
    const [preco, setPreco] = useState<number | null>(null); 
    const [tipoLicencaOpen, setTipoLicencaOpen] = useState(false)
    const [tipoLicenca, setTipoLicenca] = useState<string | null>(null);
    const [tipoLicencaItems, setTipoLicencaItems] = useState<any[]>([]);
    const [capaBeat, setCapaBeat] = useState<any>(null);  //HOOKS PARA O QUADRO DA CAPA DO beat
    const [beatFile, setBeatFile] = useState<any>(null);  // Pode usar DocumentPicker para escolher arquivo
    const [precoError, setPrecoError] = useState<string | null>(null);


    // ✅ Atualiza os textos das opções sempre que o idioma mudar
    useEffect(() => {
        setTipoLicencaItems([
            { label: t('postBeat.licenseTypes.exclusive'), value: 'exclusivo' },
            { label: t('postBeat.licenseTypes.free'), value: 'livre' },
        ]);
    }, [t]);

    // --- Placeholder padrão ---
    // Você não precisa mais do placeholder de string formatada no hook
    // O placeholder do CurrencyInput é uma string normal.
    const precoPlaceholder = t('postBeat.pricePlaceholder') || '5.00'; // Exemplo de placeholder

    // --- Lógica de alteração e validação do preço ---
    // ✅ NOVO: A função agora recebe apenas o valor numérico limpo
    const handlePrecoChange = (numericValue: number | null) => {

        console.log('📊 numericValue recebido:', numericValue);

        setPreco(numericValue); // Salva o valor numérico limpo no estado
        setPrecoError(null);

        // Se o valor for null ou 0 (campo vazio ou apagado), a validação de min/max não se aplica
        if (numericValue === null || numericValue === 0) {
            return;
        }

        // Se isNaN retornar true, é porque algo deu muito errado, 
        // mas o CurrencyInput normalmente previne isso.
        if (isNaN(numericValue)) {
            setPrecoError(t('postBeat.errors.onlyNumbers'));
            return;
        }

        const minValue = 1;      // mínimo permitido
        const maxValue = 10000; // máximo permitido

        // --- Validação Direta ---
        if (numericValue < minValue) {
            setPrecoError(`${t('postBeat.errors.minValue')} ${minValue.toFixed(2)} USD`);
            Vibration.vibrate(100);
            return;
        }

        if (numericValue > maxValue) {
            setPrecoError(`${t('postBeat.errors.maxValue')} ${maxValue.toFixed(2)} USD`);
            Vibration.vibrate(100);
            return;
        }
    };
    // Atualiza as opções de licença quando idioma mudar
    useEffect(() => {
        setTipoLicencaItems([
            { label: t('postBeat.licenseTypes.exclusive'), value: 'exclusivo' },
            { label: t('postBeat.licenseTypes.free'), value: 'livre' },
        ]);
    }, [t]);

    return {
        nomeProdutor, setNomeProdutor,
        tituloBeat, setTituloBeat,
        generoBeat, setGeneroBeat,
        preco, handlePrecoChange, setPreco,
        tipoLicencaOpen, setTipoLicencaOpen,
        tipoLicenca, setTipoLicenca,
        tipoLicencaItems, setTipoLicencaItems,
        capaBeat, setCapaBeat,
        beatFile, setBeatFile,
        precoPlaceholder,
        precoError
    };
};