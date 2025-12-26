//hook/usePostBeat.ts
import { useState, useEffect, useMemo, useCallback, } from 'react';
import { Vibration } from 'react-native';
import { useTranslation } from '@/src/translations/useTranslation';
//import { useAppSelector, } from '@/src/redux/hooks';
//import { selectUserCurrencyCode, selectUserAccountRegion, } from '@/src/redux/userSessionAndCurrencySlice';
//import { EUROZONE_COUNTRIES, LUSOPHONE_COUNTRIES } from '@/src/constants/regions';
import * as DocumentPicker from 'expo-document-picker'; //Modulo responsavel por prmitir carregamento de arquivos
import * as ImagePicker from 'expo-image-picker'; //importando o modulo responsavel por lidar com o carregamento de imagens
// ✅ Importa função de análise de BPM com aubiojs
import { analyzeBpm } from '@/src/aubio/aubioBpm';
import { uploadExclusiveBeat, uploadFreeBeat } from '@/src/api/uploadBeatApi';

export const usePostBeat = () => {
  const { t } = useTranslation();

  // 🔹 Dados regionais do usuário (Redux)
  // const userCurrency = useAppSelector(selectUserCurrencyCode);
  //const userRegion = useAppSelector(selectUserAccountRegion);


  //Valor maximo e minimo do preco de uma postagem exclusiva
  const MIN_VALUE = 1;
  const MAX_VALUE = 10000;

  // --- Campos básicos ---
  const [nomeProdutor, setNomeProdutor] = useState('');
  const [tituloBeat, setTituloBeat] = useState('');
  const [generoBeat, setGeneroBeat] = useState('');

  // --- Preço e Moeda ---
  const [preco, setPreco] = useState<number | null>(null);
  const [currencyPickerOpen, setCurrencyPickerOpen] = useState(false);

  //const [selectedCurrency, setSelectedCurrency] = useState(userCurrency || 'USD');
  //const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'EUR'>('USD');

  type BeatCurrency = 'USD' | 'EUR';
  type BeatRegion = 'US' | 'EU';

  const [selectedCurrency, setSelectedCurrency] = useState<BeatCurrency>('USD');
  const [selectedRegion, setSelectedRegion] = useState<BeatRegion>('US');


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

  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // 0 a 100%
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');

  /**
 * 💱 Moedas permitidas para beats exclusivos
 */
  const exclusiveCurrencies = useMemo(() => {
    return [
      { label: 'USD - Dollar', value: 'USD' },
      { label: 'EUR - Euro', value: 'EUR' },
    ];
  }, []);


  const coverUri = useMemo(() => {
    if (!capaBeat?.uri) return null;
    // Se já for Base64, Blob ou já tiver file://, não mexe. 
    // Caso contrário (Android/iOS nativo), garante o file://
    if (capaBeat.uri.startsWith('data:') || capaBeat.uri.startsWith('blob:') || capaBeat.uri.startsWith('file://')) {
      return capaBeat.uri;
    }
    return `file://${capaBeat.uri}`;
  }, [capaBeat?.uri]);

  const beatUri = useMemo(() => {
    if (!beatFile?.uri) return null;
    if (beatFile.uri.startsWith('data:') || beatFile.uri.startsWith('blob:') || beatFile.uri.startsWith('file://')) {
      return beatFile.uri;
    }
    return `file://${beatFile.uri}`;
  }, [beatFile?.uri]);

  const uriToBlob = async (uri: string): Promise<Blob> => {
    const response = await fetch(uri);
    return await response.blob();
  };

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

  const handleSubmitBeatWithModal = async () => {
    // 1. Reset inicial e abertura do modal
    setUploadLoading(true);
    setUploadProgress(0);
    setUploadStatus('idle');
    setUploadError(null);
    setUploadMessage(t('postBeat.preparing'));
    setUploadModalVisible(true);

    // 2. Validações de Campos
    if (!tituloBeat || !generoBeat || !beatFile || !capaBeat || !tipoLicenca) {
      setUploadStatus('error');
      setUploadMessage(t('postBeat.errors.missingFields'));
      setUploadLoading(false);
      return;
    }

    // 3. Validação de Preço (Licença Exclusiva)
    if (tipoLicenca === 'exclusivo') {
      const minValue = 1;
      const maxValue = 10000;

      if (!preco || preco <= 0) {
        setUploadStatus('error');
        setUploadMessage(t('postBeat.errors.invalidPrice'));
        setUploadLoading(false);
        return;
      }

      if (preco < minValue) {
        setUploadStatus('error');
        setUploadMessage(`${t('postBeat.errors.minValue')} ${currentCurrencySymbol}${minValue.toFixed(2)}`);
        setUploadLoading(false);
        return;
      }

      if (preco > maxValue) {
        setUploadStatus('error');
        setUploadMessage(`${t('postBeat.errors.maxValue')} ${currentCurrencySymbol}${maxValue.toFixed(2)}`);
        setUploadLoading(false);
        return;
      }
    }

    // --- Preparação do FormData ---
    const formData = new FormData();
    formData.append('title', tituloBeat);
    formData.append('producer', nomeProdutor);
    formData.append('genre', generoBeat);
    formData.append('bpm', String(bpm || 0));

    // Capa
    if (coverUri?.startsWith('data:') || coverUri?.startsWith('blob:')) {
      const blob = await uriToBlob(coverUri);
      formData.append('coverFile', blob, 'cover.jpg');
    } else {
      formData.append('coverFile', { uri: coverUri!, name: 'cover.jpg', type: 'image/jpeg' } as any);
    }

    // Áudio
    if (beatUri?.startsWith('data:') || beatUri?.startsWith('blob:')) {
      const blob = await uriToBlob(beatUri);
      formData.append('audioFile', blob, beatFile.name || 'beat.mp3');
    } else {
      formData.append('audioFile', {
        uri: beatUri!,
        name: beatFile.name || 'beat.mp3',
        type: beatFile.type || 'audio/mpeg'
      } as any);
    }

    // Callback de progresso
    const onProgress = (percent: number) => {
      setUploadProgress(percent);
      setUploadMessage(percent < 100 ? `${t('postBeat.uploading')} ${percent}%` : t('postBeat.processing'));
    };

    // 4. Chamada da API (Removido try/catch redundante)
    let response;
    if (tipoLicenca === 'exclusivo') {
      formData.append('price', String(preco));
      formData.append('currency', selectedCurrency);
      formData.append('region', selectedRegion);
      response = await uploadExclusiveBeat(formData, onProgress);
    } else {
      response = await uploadFreeBeat(formData, onProgress);
    }

    // 5. Tratamento de Resposta baseada na Interface UploadResponse
    if (response.success) {
      setUploadProgress(100);
      setUploadStatus('success');
      setUploadMessage(t('postBeat.uploadSuccess'));
      Vibration.vibrate(200);
      // Aqui você pode adicionar um resetForm() se desejar
    } else {
      setUploadStatus('error');
      // Mostra o erro vindo da API ou a tradução local caso falhe
      setUploadMessage(t('postBeat.errors.uploadFailed'));
    }

    setUploadLoading(false);
  };

  {/**
  const handleSubmitBeatWithModal = async () => {
    try {
      // 1. Reset inicial e abertura do modal no estado 'idle' (carregando)
      setUploadLoading(true);
      setUploadProgress(0);
      setUploadStatus('idle');
      setUploadError(null);
      setUploadMessage(t('postBeat.preparing'));
      setUploadModalVisible(true);

      // 2. Validações essenciais (Campos vazios)
      if (!tituloBeat || !generoBeat || !beatFile || !capaBeat || !tipoLicenca) {
        const msg = t('postBeat.errors.missingFields');
        setUploadStatus('error'); // Muda o visual do modal para ERRO
        setUploadMessage(msg);     // Define a mensagem do i18n
        setUploadLoading(false);   // Para o loading
        return; // Interrompe a execução
      }


      // 3. Validação de Preço (Licença Exclusiva) - Aprimorada
      if (tipoLicenca === 'exclusivo') {
        const minValue = 1;
        const maxValue = 10000;

        // Se o preço for vazio ou zero
        if (!preco || preco <= 0) {
          const msg = t('postBeat.errors.invalidPrice');
          setUploadStatus('error');
          setUploadMessage(msg);
          setUploadLoading(false);
          return;
        }

        // Validação de MÍNIMO
        if (preco < minValue) {
          const msg = `${t('postBeat.errors.minValue')} ${currentCurrencySymbol}${minValue.toFixed(2)}`;
          setUploadStatus('error');
          setUploadMessage(msg);
          setUploadLoading(false);
          return;
        }

        // Validação de MÁXIMO
        if (preco > maxValue) {
          const msg = `${t('postBeat.errors.maxValue')} ${currentCurrencySymbol}${maxValue.toFixed(2)}`;
          setUploadStatus('error');
          setUploadMessage(msg);
          setUploadLoading(false);
          return;
        }
      }

      // --- Se passou nas validações, continua o processo ---

      const formData = new FormData();
      formData.append('title', tituloBeat);
      formData.append('producer', nomeProdutor);
      formData.append('genre', generoBeat);
      formData.append('bpm', String(bpm || 0));

      // Capa
      if (coverUri?.startsWith('data:') || coverUri?.startsWith('blob:')) {
        const blob = await uriToBlob(coverUri);
        formData.append('coverFile', blob, 'cover.jpg');
      } else {
        formData.append('coverFile', { uri: coverUri!, name: 'cover.jpg', type: 'image/jpeg' } as any);
      }

      // Áudio
      if (beatUri?.startsWith('data:') || beatUri?.startsWith('blob:')) {
        const blob = await uriToBlob(beatUri);
        formData.append('audioFile', blob, beatFile.name || 'beat.mp3');
      } else {
        formData.append('audioFile', {
          uri: beatUri!,
          name: beatFile.name || 'beat.mp3',
          type: beatFile.type || 'audio/mpeg'
        } as any);
      }

      // Monitoramento de progresso
      const onProgress = (percent: number) => {
        setUploadProgress(percent);
        if (percent < 100) {
          setUploadMessage(`${t('postBeat.uploading')} ${percent}%`);
        } else {
          setUploadMessage(t('postBeat.processing'));
        }
      };

      if (tipoLicenca === 'exclusivo') {
        formData.append('price', String(preco));
        formData.append('currency', selectedCurrency);
        formData.append('region', selectedRegion);
        await uploadExclusiveBeat(formData, onProgress);
      } else {
        await uploadFreeBeat(formData, onProgress);
      }

      // ✅ Sucesso total
      setUploadProgress(100);
      setUploadStatus('success');
      setUploadMessage(t('postBeat.uploadSuccess'));
      Vibration.vibrate(200);

    } catch (error: any) {
      console.error('Erro ao publicar beat:', error);
      setUploadStatus('error');
      const serverError = error.response?.data?.error || t('postBeat.errors.uploadFailed');
      setUploadMessage(serverError);
    } finally {
      setUploadLoading(false);
    }
  };

  
  */}

  const resetForm = useCallback(() => {
    // Campos básicos
    setNomeProdutor('');
    setTituloBeat('');
    setGeneroBeat('');

    // Preço e Licença
    setPreco(null);
    setTipoLicenca(null);

    // Arquivos e Áudio
    setCapaBeat(null);
    setBeatFile(null);
    setBpm(null);
    setBpmError(null);

    // Estados de Upload
    setUploadStatus('idle');
    setUploadProgress(0);
    setUploadError(null);
    setUploadMessage('');
    // Nota: Não resetamos o setUploadModalVisible aqui, 
    // pois quem fecha o modal é o clique do utilizador.
  }, []);

  const pickBeatFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'audio/*',
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) return;

    const file = result.assets[0];

    // 🔹 Normaliza a URI
    const normalizedFile = {
      uri: file.uri.startsWith('file://')
        ? file.uri
        : file.uri,
      name: file.name || 'beat.mp3',
      type: file.mimeType || 'audio/mpeg',
    };

    setBeatFile(normalizedFile);
  };

  const pickImageBeat = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) return;

    const image = result.assets[0];

    const normalizedImage = {
      uri: image.uri.startsWith('file://')
        ? image.uri
        : image.uri,
      name: 'cover.jpg',
      type: 'image/jpeg',
    };

    setCapaBeat(normalizedImage);
  };

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
   * 💱 Obtém símbolo da moeda atual dinamicamente
   */
  const currentCurrencySymbol = useMemo(() => {
    try {
      const parts = new Intl.NumberFormat(selectedRegion || 'en-US', {
        style: 'currency',
        currency: selectedCurrency,
      }).formatToParts(1);
      const symbolPart = parts.find((p) => p.type === 'currency');
      return symbolPart?.value || selectedCurrency;
    } catch {
      return selectedCurrency;
    }
  }, [selectedCurrency, selectedRegion]);


  const handleCurrencyChange = (currencyValue: BeatCurrency) => {
    setSelectedCurrency(currencyValue);
    setPreco(null);
    setPrecoError(null);

    // Define a região automaticamente
    if (currencyValue === 'USD') setSelectedRegion('US');
    if (currencyValue === 'EUR') setSelectedRegion('EU');

    // 🔹 Log para depuração
    console.log('💱 Moeda selecionada:', currencyValue);
    console.log('🌍 Região definida:', currencyValue === 'USD' ? 'US' : 'EU');
  };

  /**
   * 💰 Validação do preço
   * const handlePrecoChange = (numericValue: number | null) => {
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
   */
  const handlePrecoChange = (numericValue: number | null) => {
    setPreco(numericValue);
    setPrecoError(null);

    if (numericValue === null || numericValue === 0) return;

    const minValue = MIN_VALUE;
    const maxValue = MAX_VALUE;

    if (numericValue < minValue) {
      // Usamos o símbolo dinâmico que você já criou no useMemo
      setPrecoError(`${t('postBeat.errors.minValue')} ${currentCurrencySymbol}${minValue.toFixed(2)}`);
      Vibration.vibrate(100);
      return;
    }

    if (numericValue > maxValue) {
      setPrecoError(`${t('postBeat.errors.maxValue')} ${currentCurrencySymbol}${maxValue.toFixed(2)}`);
      Vibration.vibrate(100);
      return;
    }
  };

  // 🔁 Atualiza tipos de licença
  useEffect(() => {
    setTipoLicencaItems([
      { label: t('postBeat.licenseTypes.exclusive'), value: 'exclusivo' },
      { label: t('postBeat.licenseTypes.free'), value: 'livre' },
    ]);
  }, [t]);

  useEffect(() => {
    if (tipoLicenca === 'exclusivo') {
      setSelectedCurrency('USD'); // padrão seguro
      setPreco(null);
      setPrecoError(null);
    }
  }, [tipoLicenca]);

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

    //availableCurrencies,
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

    // Funções e Estados de Áudio e BPM (NOVOS)
    pickBeatFileAndAnalyze, // <- Nova função
    bpm,
    setBpm,
    loadingBPM,
    bpmError,
    pickBeatFile,
    pickImageBeat,

    handleSubmitBeatWithModal,
    uploadLoading,
    uploadError,

    exclusiveCurrencies,

    setUploadModalVisible,
    resetForm,

    uploadModalVisible,
    uploadProgress,
    uploadStatus,
    uploadMessage,

  };
};