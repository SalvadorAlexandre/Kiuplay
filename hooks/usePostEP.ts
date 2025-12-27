//hooks/usePostEP.ts
import { useState, useMemo, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from '@/src/translations/useTranslation';
import * as DocumentPicker from 'expo-document-picker';
import {
  startEPDraft,
  addTrackToEP,
  finalizeEP,
  getPendingEP,
  abortEP,
} from '@/src/api/uploadContentApi';
import { useAppDispatch } from '@/src/redux/hooks';
import { setDraftStatus } from '@/src/redux/draftsSlice';

const usePostExtendedPlay = () => {

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  // --- 1. ESTADOS DO EP (RASCUNHO) ---
  const [epData, setEpData] = useState<any>(null); // Guardará o retorno do backend
  const [capaEP, setCapaEP] = useState<any>(null);
  const [tituloEP, setTituloEP] = useState('');
  const [generoPrincipal, setGeneroPrincipal] = useState('');
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  // --- 2. ESTADOS DO NÚMERO DE FAIXAS (DROPDOWN) ---
  const [numFaixasOpen, setNumFaixasOpen] = useState(false);
  const [numFaixas, setNumFaixas] = useState<number | null>(null);
  const [numFaixasItems, setNumFaixasItems] = useState(
    Array.from({ length: 4 }, (_, i) => ({
      label: t('postEP.trackCountOption', { count: i + 3 }), // 3 a 6 faixas
      value: i + 3,
    }))
  );
  const [postedFaixa, setPostedFaixa] = useState<number>(0);

  // --- 3. ESTADOS DA FAIXA ATUAL (NOVO) ---
  const [titleFaixa, setTitleFaixa] = useState('');
  const [genreFaixa, setGenreFaixa] = useState('');
  const [producerFaixa, setProducerFaixa] = useState('');
  const [audioFaixa, setAudioFaixa] = useState<any>(null); // Para o arquivo de áudio

  // --- 3. ESTADOS DE PARTICIPANTES (FEATS) ---
  const [hasParticipants, setHasParticipants] = useState(false);
  const [noParticipants, setNoParticipants] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [numParticipants, setNumParticipants] = useState<number | null>(null);
  const [participantNames, setParticipantNames] = useState<string[]>([]);


  // --- ESTADOS DO MODAL DE STATUS ---
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'loading' | 'success' | 'error' | 'confirm'>('loading');
  const [modalMessage, setModalMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  // Função auxiliar para abrir o modal rapidamente
  const showModal = (type: 'loading' | 'success' | 'error' | 'confirm', message: string, progress = 0) => {
    setModalType(type);
    setModalMessage(message);
    setUploadProgress(progress);
    setModalVisible(true);
  };

  // ── 4. LÓGICA DE TRATAMENTO DE BINÁRIOS (IGUAL AO SINGLE) ──
  // Normaliza a URI para garantir o prefixo file:// no Mobile
  const coverUri = useMemo(() => {
    if (!capaEP?.uri) return null;
    if (capaEP.uri.startsWith('data:') || capaEP.uri.startsWith('blob:') || capaEP.uri.startsWith('file://')) {
      return capaEP.uri;
    }
    return `file://${capaEP.uri}`;
  }, [capaEP?.uri]);

  // --- LÓGICA DE TRATAMENTO DE BINÁRIOS PARA ÁUDIO ---

  const audioUri = useMemo(() => {
    if (!audioFaixa?.uri) return null;

    // Se já tiver o prefixo correto ou for web (blob/data), mantém
    if (
      audioFaixa.uri.startsWith('data:') ||
      audioFaixa.uri.startsWith('blob:') ||
      audioFaixa.uri.startsWith('file://')
    ) {
      return audioFaixa.uri;
    }

    // Caso contrário, força o prefixo file:// (comum no Android/iOS)
    return `file://${audioFaixa.uri}`;
  }, [audioFaixa?.uri]);

  // Conversor para Web (caso precise rodar no navegador)
  const uriToBlob = async (uri: string): Promise<Blob> => {
    const response = await fetch(uri);
    return await response.blob();
  };

  // --- 4. MANIPULADORES DE IMAGEM E DADOS ---
  const pickImageEP = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    // Verifica se o utilizador cancelou ou se não há assets
    if (result.canceled || !result.assets || result.assets.length === 0) return;

    const image = result.assets[0];

    // Extraímos a extensão real do arquivo para o tipo não ser sempre fixo
    const fileUri = image.uri;
    const fileName = fileUri.split('/').pop() || 'cover.jpg';
    const fileType = `image/${fileName.split('.').pop()}` || 'image/jpeg';

    setCapaEP({
      uri: fileUri,
      name: fileName,
      type: fileType,
    });
  };

  // 1. Função para selecionar o áudio
  const pickAudioEp = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/mp4'], // Tipos aceites
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];

        // Extrair nome e tipo de forma segura
        const fileName = asset.name || `track-${Date.now()}.mp3`;
        const fileType = asset.mimeType || 'audio/mpeg';

        setAudioFaixa({
          uri: asset.uri,
          name: fileName,
          type: fileType, // O Multer usa 'type' no FormData
          size: asset.size
        });
      }
    } catch (err) {
      console.error("Erro ao selecionar áudio:", err);
      showModal('error', t('postEP.errors.pickerError'));
    }
  };

  const handleHasParticipants = () => {
    setHasParticipants(true);
    setNoParticipants(false);
  };

  const handleNoParticipants = () => {
    setHasParticipants(false);
    setNoParticipants(true);
    setNumParticipants(null);
    setParticipantNames([]);
  };

  const handleNumParticipantsChange = (value: number) => {
    setNumParticipants(value);
    setParticipantNames(Array.from({ length: value }, () => ''));
  };

  const handleParticipantNameChange = (index: number, text: string) => {
    const updatedNames = [...participantNames];
    updatedNames[index] = text;
    setParticipantNames(updatedNames);
  };

  // --- 6. LOGICA DE COMUNICAÇÃO COM API (AJUSTADA) ---
  const saveEPDraft = async () => {
    if (!capaEP || !tituloEP || !generoPrincipal || !numFaixas) {
      showModal('error', t('postEP.errors.missingMainFields'));
      return;
    }

    showModal('loading', t('postEP.loading.creatingDraft'));
    setIsSavingDraft(true);

    const formData = new FormData();
    formData.append('title', tituloEP);
    formData.append('mainGenre', generoPrincipal);
    formData.append('totalTracks', String(numFaixas));

    if (coverUri?.startsWith('data:') || coverUri?.startsWith('blob:')) {
      const blob = await uriToBlob(coverUri);
      formData.append('coverFile', blob, capaEP.name || 'cover.jpg');
    } else {
      formData.append('coverFile', {
        uri: coverUri,
        name: capaEP.name || 'cover.jpg',
        type: capaEP.type || 'image/jpeg',
      } as any);
    }

    const response = await startEPDraft(formData);

    if (response.success) {
      // Ajuste: O dado real costuma vir em response.data.ep ou response.data
      setEpData(response.data?.ep || response.data);
      dispatch(setDraftStatus({ hasEPDraft: true }))
      showModal('success', t('postEP.success.draftCreated'));
    } else {
      showModal('error', t('postEP.errors.saveDraftError'));
    }
    setIsSavingDraft(false);
  };
  {/**
    const saveEPDraft = async () => {
    if (!capaEP || !tituloEP || !generoPrincipal || !numFaixas) {
      showModal('error', t('postEP.errors.missingMainFields'));
      return;
    }

    showModal('loading', t('postEP.loading.creatingDraft'));
    setIsSavingDraft(true);
    try {
      const formData = new FormData();
      formData.append('title', tituloEP);
      formData.append('mainGenre', generoPrincipal);
      formData.append('totalTracks', String(numFaixas));

      // Aplica a mesma lógica de tratamento de binário do Single
      if (coverUri?.startsWith('data:') || coverUri?.startsWith('blob:')) {
        const blob = await uriToBlob(coverUri);
        formData.append('coverFile', blob, capaEP.name || 'cover.jpg');
      } else {
        formData.append('coverFile', {
          uri: coverUri,
          name: capaEP.name || 'cover.jpg',
          type: capaEP.type || 'image/jpeg',
        } as any);
      }

      const response = await startEPDraft(formData);
      showModal('success', t('postEP.success.draftCreated'));
      setEpData(response.ep);
    } catch (error: any) {
      showModal('error', t('postEP.errors.saveDraftError') || error.response?.data?.error);
    } finally {
      setIsSavingDraft(false);
    }
  };
   */}

  useEffect(() => {
    const checkDraft = async () => {
      const response = await getPendingEP();

      if (response.success && response.data?.ep) {
        const ep = response.data.ep;
        setEpData(ep);
        setTituloEP(ep.title);
        setGeneroPrincipal(ep.mainGenre);
        setCapaEP({ uri: ep.cover });
        setNumFaixas(ep.totalTracks);
        dispatch(setDraftStatus({ hasEPDraft: true }))
        if (ep.tracks) {
          setPostedFaixa(ep.tracks.length);
        }
      } else {
        console.log("Nenhum rascunho de EP pendente.");
      }
    };
    checkDraft();
  }, []);

  {/**
  useEffect(() => {
    const checkDraft = async () => {
      try {
        const response = await getPendingEP();

        if (response.success && response.ep) {
          // 1. Guarda os dados do EP no estado
          setEpData(response.ep);

          // 2. Preenche os campos de texto para o Card de Resumo
          setTituloEP(response.ep.title);
          setGeneroPrincipal(response.ep.mainGenre);

          // 3. Define a capa com a URL que veio do Supabase
          setCapaEP({ uri: response.ep.cover });

          // 4. Se o backend retornou o número total de faixas esperado
          setNumFaixas(response.ep.totalTracks);

          // 5. Atualiza o contador de faixas já enviadas (progresso)
          if (response.ep.tracks) {
            setPostedFaixa(response.ep.tracks.length);
          }
        }
      } catch (error) {
        console.log("Sem rascunho pendente.");
        // Ajuste: Informar o utilizador que algo falhou
        // Usamos o tipo 'error' para ele saber que a tentativa de recuperar o rascunho falhou
        showModal(
          'error', t('postEP.errors.draftLoadFailed')
        )
      }
    };

    checkDraft();
  }, []);
  */}


  // --- LOGICA DE COMUNICAÇÃO COM API (FAIXAS) ---

  const handleAddTrack = async () => {
    if (!epData?.id || !audioFaixa || !titleFaixa.trim() || !genreFaixa) {
      showModal('error', t('postEP.errors.missingTrackData'));
      return;
    }

    showModal('loading', t('postEP.loading.uploadingTrack', { title: titleFaixa }));
    setIsSavingDraft(true);

    const formData = new FormData();
    formData.append('title', titleFaixa.trim());
    formData.append('genre', genreFaixa || generoPrincipal);
    formData.append('producer', producerFaixa || '');
    formData.append('feat', JSON.stringify(participantNames));

    if (audioUri?.startsWith('data:') || audioUri?.startsWith('blob:')) {
      const blob = await uriToBlob(audioUri);
      formData.append('audioFile', blob, audioFaixa.name || 'track.mp3');
    } else {
      formData.append('audioFile', {
        uri: audioUri,
        name: audioFaixa.name || 'track.mp3',
        type: audioFaixa.type || 'audio/mpeg',
      } as any);
    }

    const response = await addTrackToEP(epData.id, formData, (progress) => {
      setUploadProgress(progress);
    });

    if (response.success) {
      const novoTotalPosted = postedFaixa + 1;
      setPostedFaixa(novoTotalPosted);

      // Limpeza
      setTitleFaixa(''); setGenreFaixa(''); setProducerFaixa('');
      setAudioFaixa(null); setParticipantNames([]);

      if (novoTotalPosted >= (numFaixas || 0)) {
        showModal('success', t('postEP.success.allTracksUploaded'));
      } else {
        showModal('success', t('postEP.success.trackProgress', { current: novoTotalPosted, total: numFaixas }));
      }
    } else {
      showModal('error', response.error || t('postEP.errors.uploadTrackError'));
    }
    setIsSavingDraft(false);
  };

  {/**
    const handleAddTrack = async () => {
    // 1. Validação inicial robusta
    // Verifica se o ID do EP existe, se há áudio, título E género da faixa
    if (!epData?.id || !audioFaixa || !titleFaixa.trim() || !genreFaixa) {
      showModal('error', t('postEP.errors.missingTrackData'));
      return;
    }

    // 2. Iniciar Feedback Visual com tradução dinâmica
    showModal('loading', t('postEP.loading.uploadingTrack', { title: titleFaixa }));
    setIsSavingDraft(true);

    try {
      const formData = new FormData();
      formData.append('title', titleFaixa.trim());
      formData.append('genre', genreFaixa || generoPrincipal);
      formData.append('producer', producerFaixa || '');

      // Backend espera 'feat' como string JSON
      formData.append('feat', JSON.stringify(participantNames));

      // 3. Tratamento de Binário (Mobile/Web)
      if (audioUri?.startsWith('data:') || audioUri?.startsWith('blob:')) {
        const blob = await uriToBlob(audioUri);
        formData.append('audioFile', blob, audioFaixa.name || 'track.mp3');
      } else {
        formData.append('audioFile', {
          uri: audioUri,
          name: audioFaixa.name || 'track.mp3',
          type: audioFaixa.type || 'audio/mpeg',
        } as any);
      }

      // 4. Chamada à API com monitorização
      const response = await addTrackToEP(epData.id, formData, (progress) => {
        setUploadProgress(progress);
      });

      // 5. Tratamento de Sucesso
      if (response.success) {
        const novoTotalPosted = postedFaixa + 1;
        setPostedFaixa(novoTotalPosted);

        // Limpar campos para a próxima faixa
        setTitleFaixa('');
        setGenreFaixa('');
        setProducerFaixa('');
        setAudioFaixa(null);
        setParticipantNames([]);

        // Verificar se o EP está completo
        if (novoTotalPosted >= (numFaixas || 0)) {
          showModal('success', t('postEP.success.allTracksUploaded'));
        } else {
          showModal('success', t('postEP.success.trackProgress', {
            current: novoTotalPosted,
            total: numFaixas
          }));
        }
      }
    } catch (error: any) {
      console.error("Erro no upload da faixa:", error);
      // Inverti para priorizar a sua tradução conforme resolvemos antes
      const errorMsg = t('postEP.errors.uploadTrackError') || error.response?.data?.error;
      showModal('error', errorMsg);
    } finally {
      setIsSavingDraft(false);
    }
  }; 
    */}


  const finishRelease = async () => {
    if (!epData?.id) return;
    showModal('loading', t('postEP.loading.finalizing'));
    setIsSavingDraft(true);

    const response = await finalizeEP(epData.id);

    if (response.success) {
      dispatch(setDraftStatus({ hasEPDraft: false }))
      showModal('success', t('postEP.success.published'));
      setEpData(null); setCapaEP(null); setTituloEP('');
      setGeneroPrincipal(''); setNumFaixas(null); setPostedFaixa(0);
      setTitleFaixa(''); setAudioFaixa(null);
    } else {
      showModal('error', response.error || t('postEP.errors.finalizeError'));
    }
    setIsSavingDraft(false);
  };

  {/**
  const finishRelease = async () => {
    if (!epData?.id) return;

    // 1. Abrir modal em estado de carregamento
    showModal('loading', t('postEP.loading.finalizing'));
    setIsSavingDraft(true);

    try {
      const response = await finalizeEP(epData.id);

      if (response.success) {
        // 2. Mostrar sucesso no modal
        showModal('success', t('postEP.success.published'));

        // 3. LIMPAR TODOS OS ESTADOS (O "Reset" que pediste)
        // Ao fazer isto, o 'isStep1Complete' passará a ser false e a tela volta ao início
        setEpData(null);
        setCapaEP(null);
        setTituloEP('');
        setGeneroPrincipal('');
        setNumFaixas(null);
        setPostedFaixa(0);
        setTitleFaixa('');
        setAudioFaixa(null);

      }
    } catch (error: any) {
      console.error(error);
      showModal('error', t('postEP.errors.finalizeError') || error.response?.data?.error);
    } finally {
      setIsSavingDraft(false);
    }
  };
  
  */}


  // 1. Apenas abre o modal de confirmação
  const triggerAbortEP = () => {
    if (!epData?.id) return;
    showModal('confirm', t('postEP.confirm.abort'));
  };

  // 2. A função que realmente apaga (será chamada pelo onConfirm do Modal)
  const executeAbortEP = async () => {
    if (!epData?.id) return;
    showModal('loading', t('postEP.loading.deleting'));

    const response = await abortEP(epData.id);

    if (response.success) {
      setEpData(null); setCapaEP(null); setTituloEP('');
      setGeneroPrincipal(''); setNumFaixas(null); setPostedFaixa(0);
      dispatch(setDraftStatus({ hasEPDraft: false }))
      showModal('success', t('postEP.success.deleted'));
    } else {
      showModal('error', response.error || t('postEP.errors.deleteDraftError'));
    }
  };

  {/**
     const executeAbortEP = async () => {
    showModal('loading', t('postEP.loading.deleting'));
    try {
      await abortEP(epData.id);

      // RESET DOS ESTADOS
      setEpData(null);
      setCapaEP(null);
      setTituloEP('');
      setGeneroPrincipal('');
      setNumFaixas(null);
      setPostedFaixa(0);

      showModal('success', t('postEP.success.deleted'));
    } catch (error) {
      showModal('error', t('postEP.errors.deleteDraftError'));
    }
  };

    */}

  return {
    // Estados do EP
    epData,
    capaEP,
    tituloEP,
    setTituloEP,
    generoPrincipal,
    setGeneroPrincipal,
    pickImageEP,
    saveEPDraft,
    isSavingDraft,

    // Faixas
    numFaixas,
    setNumFaixas,
    numFaixasOpen,
    setNumFaixasOpen,
    numFaixasItems,
    setNumFaixasItems,
    postedFaixa,

    // Participantes
    hasParticipants,
    noParticipants,
    dropdownOpen,
    setDropdownOpen,
    numParticipants,
    participantNames,
    handleHasParticipants,
    handleNoParticipants,
    handleNumParticipantsChange,
    handleParticipantNameChange,

    titleFaixa,
    setTitleFaixa,
    genreFaixa,
    setGenreFaixa,
    producerFaixa,
    setProducerFaixa,
    audioFaixa,
    setAudioFaixa,

    modalVisible,
    modalType,
    modalMessage,
    uploadProgress,
    setModalVisible,
    triggerAbortEP, // Use esta no botão de apagar
    executeAbortEP, // Use esta no onConfirm do Modal
    handleAddTrack,
    finishRelease,

    pickAudioEp
  };
};

export default usePostExtendedPlay;