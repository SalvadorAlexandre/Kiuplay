//hook/usePostBeat.ts
import { useState, useEffect, useMemo, useCallback} from 'react';
import { Vibration } from 'react-native';
import { useTranslation } from '@/src/translations/useTranslation';
import { useSelector } from 'react-redux';
import {
  selectUserCurrencyCode,
  selectUserAccountRegion,
} from '@/src/redux/userSessionAndCurrencySlice';
import { EUROZONE_COUNTRIES, LUSOPHONE_COUNTRIES } from '@/src/constants/regions';

export const usePostBeat = () => {
  const { t } = useTranslation();

  // 🔹 Dados regionais do usuário (Redux)
  const userCurrency = useSelector(selectUserCurrencyCode);
  const userRegion = useSelector(selectUserAccountRegion);

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

  /**
   * 🧩 Formata valor monetário de acordo com região e moeda
   */
  const formatCurrency = useCallback(
    (value: number, currency: string, region?: string) => {
      try {
        return new Intl.NumberFormat(region || 'en-US', {
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
  };
};