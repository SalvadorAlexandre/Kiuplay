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

// eslint-disable-next-line import/no-webpack-loader-syntax
import BpmWorker from '!!worker-loader?{"filename":"[name].[contenthash].worker.js"}!../../public/workers/bpmWorker.ts';

// A instância do Worker deve ser gerida dentro do useEffect para segurança de ambiente (SSR/RN)

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

  // Use o construtor importado para criar a instância:
  const workerRef = useRef<Worker | null>(null);

  // 🎶 Efeito para configurar o Worker e gerenciar a resposta do BPM
  useEffect(() => {
    // Apenas tenta criar o worker no ambiente do navegador/web, se ainda não existir
    if (typeof window !== 'undefined' && 'Worker' in window && !workerRef.current) {

      // Use a sintaxe new URL() novamente. 
      // ISSO REQUER QUE SEU AMBIENTE EXPO/WEBPACK ESTEJA CONFIGURADO PARA WEBPACK (e não Metro)
      const workerUrl = new URL('../../public/workers/bpmWorker.js', import.meta.url);

      workerRef.current = new Worker(workerUrl, { type: 'module' });
      console.log('Worker inicializado com new URL().');

    } else if (!workerRef.current) {
      // Se estamos num ambiente React Native nativo ou se o Worker não está disponível/configurado
      console.warn('⚠️ Worker não disponível neste ambiente.');
      return; // Sair do useEffect se não houver worker
    }

    const handleWorkerMessage = (event: MessageEvent<any>) => {
      // Este log aparecerá se a mensagem for recebida
      console.log("[Main Thread] Mensagem recebida do Worker:", event.data.status);
      setLoadingBPM(false);

      // Ajustei a desestruturação para coincidir com o que enviei no Worker corrigido
      const { status, result, message } = event.data;

      if (status === 'completed' && result?.bpm) {
        setBpm(result.bpm);
        setBpmError(null);
        console.log(`[Essentia.js Worker] BPM Detectado: ${result.bpm}`);
      } else if (status === 'error') {
        setBpmError(message || t('postBeat.bpmError.generic'));
        setBpm(null);
        Vibration.vibrate(200);
        console.error("[Essentia.js Worker] Erro:", message);
      }
    };

    // Anexamos o listener APENAS se houver um worker válido
    if (workerRef.current) {
      workerRef.current.addEventListener('message', handleWorkerMessage);
    }


    // Cleanup: Termina o Worker quando o hook é desmontado
    return () => {
      if (workerRef.current) {
        workerRef.current.removeEventListener('message', handleWorkerMessage);
        workerRef.current.terminate();
        workerRef.current = null; // Resetamos a ref
        console.log("[Essentia.js Worker] Terminado.");
      }
    };
  }, [t]); // Dependências ajustadas para incluir 't'

  const pickBeatFileAndAnalyze = async () => {
    let result;
    try {
      // expo-document-picker retorna assets com 'uri' que pode ser usado com fetch()
      result = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
    } catch (e) {
      console.error("Erro ao selecionar documento:", e);
      return;
    }

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const file = result.assets[0];
      setBeatFile(file); // Define o estado do arquivo

      setLoadingBPM(true);
      setBpm(null);
      setBpmError(null);

      if (workerRef.current) {
        try {
          // Usamos fetch(file.uri) para obter o Blob
          const response = await fetch(file.uri);
          const audioBlob = await response.blob();

          // Enviamos o Blob para o Worker. O Worker precisará usar FileReader ou fetch
          // internamente para obter o ArrayBuffer e decodificar o áudio.
          workerRef.current.postMessage({ audioFile: audioBlob });

          console.log("[Main Thread] Blob do áudio enviado para o Worker.");

        } catch (postError) {
          setLoadingBPM(false);
          setBpmError(t('postBeat.bpmError.transfer'));
          console.error("Erro ao enviar mensagem para o worker:", postError);
        }
      } else {
        setLoadingBPM(false);
        setBpmError(t('postBeat.bpmError.workerInit'));
      }
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
   * 🧩 Formata valor monetário de acordo com região e moeda
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
    loadingBPM,
    bpmError,
    pickBeatFile,
    pickImageBeat,
  };
}