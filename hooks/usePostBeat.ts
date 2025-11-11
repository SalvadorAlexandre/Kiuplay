//hook/usePostBeat.ts
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Vibration } from 'react-native';
import { useTranslation } from '@/src/translations/useTranslation';
import { useAppSelector, } from '@/src/redux/hooks';
import {
  selectUserCurrencyCode,
  selectUserAccountRegion,
} from '@/src/redux/userSessionAndCurrencySlice';
import { EUROZONE_COUNTRIES, LUSOPHONE_COUNTRIES } from '@/src/constants/regions';
import * as DocumentPicker from 'expo-document-picker'; //Modulo responsavel por prmitir carregamento de arquivos
import * as ImagePicker from 'expo-image-picker'; //importando o modulo responsavel por lidar com o carregamento de imagens
// ✅ Importa função de análise de BPM com aubiojs
import { analyzeBpm } from '@/src/aubio/aubioBpm';

export const usePostBeat = () => {
  const { t } = useTranslation();

  // 🔹 Dados regionais do usuário (Redux)
  const userCurrency = useAppSelector(selectUserCurrencyCode);
  const userRegion = useAppSelector(selectUserAccountRegion);

  // --- Campos básicos ---
  const [nomeProdutor, setNomeProdutor] = useState('');
  const [tituloBeat, setTituloBeat] = useState('');
  const [generoBeat, setGeneroBeat] = useState('');

  // --- Preço e Moeda ---
  const [preco, setPreco] = useState<number | null>(null);
  const [currencyPickerOpen, setCurrencyPickerOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(userCurrency || 'USD');
  const [precoError, setPrecoError] = useState<string | null>(null);

  // --- Licenças ---
  const [tipoLicencaOpen, setTipoLicencaOpen] = useState(false);
  const [tipoLicenca, setTipoLicenca] = useState<string | null>(null);
  const [tipoLicencaItems, setTipoLicencaItems] = useState<any[]>([]);

  // --- Arquivos ---
  const [capaBeat, setCapaBeat] = useState<any>(null);
  const [beatFile, setBeatFile] = useState<any>(null);

  // --- ESTADOS NOVOS PARA BPM ---
  const [bpm, setBpm] = useState<number | null>(null);
  const [loadingBPM, setLoadingBPM] = useState(false);
  const [bpmError, setBpmError] = useState<string | null>(null);


  // -------------------------------
  // Função de seleção de beat e análise de BPM com Aubio Web
  const pickBeatFileAndAnalyze = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
      if (result.canceled || !result.assets || result.assets.length === 0) return;

      const file = result.assets[0];
      setBeatFile(file);

      setLoadingBPM(true);
      setBpm(null);
      setBpmError(null);

      try {
        // Analisa diretamente com Aubio Web
        // ✅ Converte o arquivo selecionado em Blob (necessário para o Aubio)
        const response = await fetch(file.uri);
        const audioBlob = await response.blob();

        // ✅ Analisa o BPM com o aubioBpm.ts
        const bpmValue = await analyzeBpm(audioBlob);
        setBpm(bpmValue);
        setBpmError(null);
      } catch (error: any) {
        console.error('[Aubio Web] Erro ao analisar BPM:', error);
        setBpm(null);
        setBpmError(error.message || t('postBeat.bpmError.generic'));
        Vibration.vibrate(200);
      } finally {
        setLoadingBPM(false);
      }
    } catch (e) {
      console.error('Erro ao selecionar beat:', e);
    }
  };

  const pickBeatFile = async () => {
    let result = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      //Carrega o arquivo selecionado
      const file = result.assets[0];
      setBeatFile(file);
    }
  };

  const pickImageBeat = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) setCapaBeat(result.assets[0]);
  }
  /**
   Formata valor monetário de acordo com região e moeda
   */
  const formatCurrency = useCallback(
    (value: number, currency: string, region?: string) => {
      try {
        return new Intl.NumberFormat(region, {
          style: 'currency',
          currency,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value);
      } catch {
        return `${currency} ${value.toFixed(2)}`;
      }
    },
    []
  );

  /**
   * 🧮 Determina moedas disponíveis conforme região
   */
  const availableCurrencies = useMemo(() => {
    const base = [{ label: 'USD - Global', value: 'USD' }];
    let localCurrency: string | null = null;

    if (LUSOPHONE_COUNTRIES.includes(userRegion || '')) {
      const localMap: Record<'AO' | 'BR' | 'MZ', string> = {
        AO: 'AOA',
        BR: 'BRL',
        MZ: 'MZN',
      };
      localCurrency = localMap[userRegion as keyof typeof localMap] || null;
    } else if (EUROZONE_COUNTRIES.includes(userRegion || '')) {
      localCurrency = 'EUR';
    }

    if (localCurrency && localCurrency !== 'USD') {
      base.unshift({
        label: `${localCurrency} - ${t('postBeat.currency.local')}`,
        value: localCurrency,
      });
    }

    return base;
  }, [userRegion, t]);

  /**
   * 💱 Obtém símbolo da moeda atual dinamicamente
   */
  const currentCurrencySymbol = useMemo(() => {
    try {
      const parts = new Intl.NumberFormat(userRegion || 'en-US', {
        style: 'currency',
        currency: selectedCurrency,
      }).formatToParts(1);
      const symbolPart = parts.find((p) => p.type === 'currency');
      return symbolPart?.value || selectedCurrency;
    } catch {
      return selectedCurrency;
    }
  }, [selectedCurrency, userRegion]);

  /**
   * 🪙 Troca de moeda
   */
  const handleCurrencyChange = (currencyValue: string) => {
    setSelectedCurrency(currencyValue);
    setPreco(null);
    setPrecoError(null);
  };

  /**
   * 💰 Validação do preço
   */
  const handlePrecoChange = (numericValue: number | null) => {
    setPreco(numericValue);
    setPrecoError(null);

    if (numericValue === null || numericValue === 0) return;
    if (isNaN(numericValue)) {
      setPrecoError(t('postBeat.errors.onlyNumbers'));
      return;
    }

    const minValue = 1;
    const maxValue = 10000;

    if (numericValue < minValue) {
      setPrecoError(`${t('postBeat.errors.minValue')} ${minValue.toFixed(2)} ${selectedCurrency}`);
      Vibration.vibrate(100);
      return;
    }
    if (numericValue > maxValue) {
      setPrecoError(`${t('postBeat.errors.maxValue')} ${maxValue.toFixed(2)} ${selectedCurrency}`);
      Vibration.vibrate(100);
      return;
    }
  };

  // 🔁 Atualiza tipos de licença conforme idioma
  useEffect(() => {
    setTipoLicencaItems([
      { label: t('postBeat.licenseTypes.exclusive'), value: 'exclusivo' },
      { label: t('postBeat.licenseTypes.free'), value: 'livre' },
    ]);
  }, [t]);

  const precoPlaceholder = `${currentCurrencySymbol} ${t('postBeat.pricePlaceholder') || '0.00'}`;

  return {
    // Campos principais
    nomeProdutor, setNomeProdutor,
    tituloBeat, setTituloBeat,
    generoBeat, setGeneroBeat,

    // Moeda e preço
    preco, handlePrecoChange, setPreco,
    precoError,
    precoPlaceholder,
    formatCurrency,

    availableCurrencies,
    selectedCurrency,
    handleCurrencyChange,
    currentCurrencySymbol,
    setCurrencyPickerOpen,
    currencyPickerOpen,

    // Licenças e arquivos
    tipoLicencaOpen, setTipoLicencaOpen,
    tipoLicenca, setTipoLicenca,
    tipoLicencaItems, setTipoLicencaItems,
    capaBeat, setCapaBeat,
    beatFile, setBeatFile,

    userRegion,
    // Funções e Estados de Áudio e BPM (NOVOS)
    pickBeatFileAndAnalyze, // <- Nova função
    bpm,
    setBpm,
    loadingBPM,
    bpmError,
    pickBeatFile,
    pickImageBeat,
  };
}