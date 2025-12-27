// hooks/usePostAlbum.ts
import { useState, useMemo, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from '@/src/translations/useTranslation';
import * as DocumentPicker from 'expo-document-picker';
import {
  startAlbumDraft,      // Alterado para Album
  addTrackToAlbum,    // Alterado para Album
  finalizeAlbum,      // Alterado para Album
  getPendingAlbum,    // Alterado para Album
  abortAlbum,         // Alterado para Album
} from '@/src/api/uploadContentApi';
import { useAppDispatch } from '@/src/redux/hooks';
import { setDraftStatus } from '@/src/redux/draftsSlice';

const usePostAlbum = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  // --- 1. ESTADOS DO ÁLBUM (RASCUNHO) ---
  const [albumData, setAlbumData] = useState<any>(null); // Guardará o retorno do backend
  const [capaAlbum, setCapaAlbum] = useState<any>(null);
  const [tituloAlbum, setTituloAlbum] = useState('');
  const [generoPrincipal, setGeneroPrincipal] = useState('');
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  // --- 2. ESTADOS DO NÚMERO DE FAIXAS (DROPDOWN) ---
  const [numFaixasOpen, setNumFaixasOpen] = useState(false);
  const [numFaixas, setNumFaixas] = useState<number | null>(null);

  // Configuração atualizada: 8 a 30 faixas
  const [numFaixasItems, setNumFaixasItems] = useState<{ label: string; value: number }[]>(
    // Calculamos a diferença: 30 (máximo) - 3 (mínimo) + 1 = 28 itens no total
    Array.from({ length: 30 - 3 + 1 }, (_, i) => ({
      label: t('postAlbum.trackCountOption', { count: i + 3 }),
      value: i + 3,
    }))
  );

  {/** Configuração atualizada: 8 a 30 faixas
  const [numFaixasItems, setNumFaixasItems] = useState<{ label: string; value: number }[]>(
    Array.from({ length: 30 - 8 + 1 }, (_, i) => ({
      label: t('postAlbum.trackCountOption', { count: i + 8 }),
      value: i + 8,
    }))
  ); */}

  const [postedFaixa, setPostedFaixa] = useState<number>(0);

  // --- 3. ESTADOS DA FAIXA ATUAL (ALBUM) ---
  const [titleFaixa, setTitleFaixa] = useState('');
  const [genreFaixa, setGenreFaixa] = useState('');
  const [producerFaixa, setProducerFaixa] = useState('');
  const [audioFaixa, setAudioFaixa] = useState<any>(null); // Para o arquivo de áudio

  // --- 4. ESTADOS DE PARTICIPANTES (FEATS) ---
  const [hasParticipants, setHasParticipants] = useState(false);
  const [noParticipants, setNoParticipants] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [numParticipants, setNumParticipants] = useState<number | null>(null);
  const [participantNames, setParticipantNames] = useState<string[]>([]);

  // --- 5. ESTADOS DO MODAL DE STATUS (PROCESSO DE UPLOAD DO ÁLBUM) ---
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

  // ── 6. LÓGICA DE TRATAMENTO DE BINÁRIOS (ADAPTADO PARA ÁLBUM) ──
  // Normaliza a URI para garantir o prefixo file:// no Mobile
  const coverUri = useMemo(() => {
    if (!capaAlbum?.uri) return null; // Alterado para capaAlbum
    if (capaAlbum.uri.startsWith('data:') || capaAlbum.uri.startsWith('blob:') || capaAlbum.uri.startsWith('file://')) {
      return capaAlbum.uri;
    }
    return `file://${capaAlbum.uri}`;
  }, [capaAlbum?.uri]); // Alterado para capaAlbum


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

  // --- 7. MANIPULADORES DE IMAGEM E DADOS (ADAPTADO PARA ÁLBUM) ---
  const pickImageAlbum = async () => {
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

    setCapaAlbum({ // Alterado para capaAlbum
      uri: fileUri,
      name: fileName,
      type: fileType,
    });
  };


  // 1. Função para selecionar o áudio (ADAPTADO PARA ÁLBUM)
  const pickAudioAlbum = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/mp4', 'audio/m4a'], // Incluí m4a que é comum no iOS
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
      showModal('error', t('postAlbum.errors.pickerError'));
    }
  };

  // --- 8. GESTÃO DE PARTICIPANTES (FEATS DO ÁLBUM) ---
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
  {/**
  
  const saveAlbumDraft = async () => {
    // Verificamos as variáveis do álbum
    if (!capaAlbum || !tituloAlbum || !generoPrincipal || !numFaixas) {
      showModal('error', t('postAlbum.errors.missingMainFields'));
      return;
    }

    showModal('loading', t('postAlbum.loading.creatingDraft'));
    setIsSavingDraft(true);
    try {
      const formData = new FormData();
      formData.append('title', tituloAlbum); // Título do Álbum
      formData.append('mainGenre', generoPrincipal);
      formData.append('totalTracks', String(numFaixas));

      // Mesma lógica de tratamento de binário que já validámos
      if (coverUri?.startsWith('data:') || coverUri?.startsWith('blob:')) {
        const blob = await uriToBlob(coverUri);
        formData.append('coverFile', blob, capaAlbum.name || 'cover.jpg');
      } else {
        formData.append('coverFile', {
          uri: coverUri,
          name: capaAlbum.name || 'cover.jpg',
          type: capaAlbum.type || 'image/jpeg',
        } as any);
      }

      // Chama a rota específica de álbum
      const response = await startAlbumDraft(formData);
      showModal('success', t('postAlbum.success.draftCreated'));

      setAlbumData(response.album); // Guardamos os dados do álbum (que contém o ID)
    } catch (error: any) {
      showModal('error', t('postAlbum.errors.saveDraftError') || error.response?.data?.error);
    } finally {
      setIsSavingDraft(false);
    }
  };
  */}


  // --- 9. LÓGICA DE COMUNICAÇÃO COM API (ADAPTADA PARA ÁLBUM) ---
  const saveAlbumDraft = async () => {
    if (!capaAlbum || !tituloAlbum || !generoPrincipal || !numFaixas) {
      showModal('error', t('postAlbum.errors.missingMainFields'));
      return;
    }

    showModal('loading', t('postAlbum.loading.creatingDraft'));
    setIsSavingDraft(true);

    const formData = new FormData();
    formData.append('title', tituloAlbum);
    formData.append('mainGenre', generoPrincipal);
    formData.append('totalTracks', String(numFaixas));

    if (coverUri?.startsWith('data:') || coverUri?.startsWith('blob:')) {
      const blob = await uriToBlob(coverUri);
      formData.append('coverFile', blob, capaAlbum.name || 'cover.jpg');
    } else {
      formData.append('coverFile', {
        uri: coverUri,
        name: capaAlbum.name || 'cover.jpg',
        type: capaAlbum.type || 'image/jpeg',
      } as any);
    }

    // Chamada à API ajustada
    const response = await startAlbumDraft(formData);

    if (response.success) {
      // De acordo com a tua API: return { success: true, data: response.data };
      // Ajustamos para ler de response.data.album (ou apenas response.data dependendo do teu backend)
      setAlbumData(response.data.album || response.data);
      dispatch(setDraftStatus({ hasAlbumDraft: true }))
      showModal('success', t('postAlbum.success.draftCreated'));

    } else {
      // Usa o erro amigável vindo da API
      showModal('error', t('postAlbum.errors.saveDraftError'));
    }

    setIsSavingDraft(false);
  };

  // ── 10. RECUPERAÇÃO DE RASCUNHO (CORRIGIDO) ──
  useEffect(() => {
    const checkAlbumDraft = async () => {
      // Como a API já trata o erro, não precisamos obrigatoriamente de try/catch aqui
      const response = await getPendingAlbum();

      // Verificamos se teve sucesso e se existe o objeto album dentro de data
      if (response.success && response.data?.album) {
        const album = response.data.album; // Criamos uma constante para facilitar o acesso

        // 1. Guarda os dados do Álbum no estado
        setAlbumData(album);

        // 2. Preenche os campos de texto para o Card de Resumo
        setTituloAlbum(album.title);
        setGeneroPrincipal(album.mainGenre);

        // 3. Define a capa com a URL que veio do Supabase
        setCapaAlbum({ uri: album.cover });

        // 4. Define o número total de faixas esperado
        setNumFaixas(album.totalTracks);
        dispatch(setDraftStatus({ hasAlbumDraft: true }))
        // 5. Atualiza o contador de faixas já enviadas
        if (album.tracks && Array.isArray(album.tracks)) {
          setPostedFaixa(album.tracks.length);
        }
      } else {
        // Caso não haja rascunho, apenas logamos (evita mostrar modal de erro desnecessário)
        console.log("Informação: Nenhum rascunho de álbum pendente encontrado.");
      }
    };

    checkAlbumDraft();
  }, []);


  {/** 
  // ── 10. RECUPERAÇÃO DE RASCUNHO (ADAPTADO PARA ÁLBUM) ──
  useEffect(() => {
    const checkAlbumDraft = async () => {
      try {
        const response = await getPendingAlbum(); // Chamada para a rota de álbum

        if (response.success && response.album) {
          // 1. Guarda os dados do Álbum no estado
          setAlbumData(response.album);

          // 2. Preenche os campos de texto para o Card de Resumo
          setTituloAlbum(response.album.title);
          setGeneroPrincipal(response.album.mainGenre);

          // 3. Define a capa com a URL que veio do Supabase
          setCapaAlbum({ uri: response.album.cover });

          // 4. Define o número total de faixas esperado
          setNumFaixas(response.album.totalTracks);

          // 5. Atualiza o contador de faixas já enviadas (progresso)
          if (response.album.tracks) {
            setPostedFaixa(response.album.tracks.length);
          }
        }
      } catch (error) {
        console.log("Sem rascunho de álbum pendente.");
        showModal(
          'error', t('postAlbum.errors.draftLoadFailed')
        )
      }
    };
    checkAlbumDraft();
  }, []);
    
    */}

  {/**
     const handleAddTrack = async () => {
    // 1. Validação inicial usando albumData
    if (!albumData?.id || !audioFaixa || !titleFaixa) {
      showModal('error', t('postAlbum.errors.missingTrackData'));
      return;
    }

    // 2. Iniciar Feedback Visual
    showModal('loading', t('postAlbum.loading.uploadingTrack', { title: titleFaixa }), 1);
    setIsSavingDraft(true);

    try {
      const formData = new FormData();
      formData.append('title', titleFaixa);
      formData.append('genre', genreFaixa || generoPrincipal);
      formData.append('producer', producerFaixa);

      // O teu backend espera 'feat' como uma string JSON
      formData.append('feat', JSON.stringify(participantNames));

      // 3. LÓGICA DE TRATAMENTO DE BINÁRIO (ÁUDIO DA FAIXA DO ÁLBUM)
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

      // 4. Chamada à API específica para Álbum com progresso
      const response = await addTrackToAlbum(albumData.id, formData, (progress) => {
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
        handleNoParticipants(); // Garante que volta ao estado inicial de feats

        // Verificar se o Álbum está completo
        if (novoTotalPosted >= (numFaixas || 0)) {
          showModal('success', t('postAlbum.success.allTracksUploaded'));
        } else {
          showModal('success', t('postAlbum.success.trackProgress', {
            current: novoTotalPosted,
            total: numFaixas
          }));
        }
      }
    } catch (error: any) {
      console.error("Erro no upload da faixa do álbum:", error);
      const errorMsg = t('postAlbum.errors.uploadTrackError') || error.response?.data?.error;
      showModal('error', errorMsg);
    } finally {
      setIsSavingDraft(false);
    }
  };
    */}

  // --- 11. LÓGICA DE COMUNICAÇÃO COM API (FAIXAS DO ÁLBUM) ---
  const handleAddTrack = async () => {
    // 1. Validação inicial usando albumData
    if (!albumData?.id || !audioFaixa || !titleFaixa) {
      showModal('error', t('postAlbum.errors.missingTrackData'));
      return;
    }

    // 2. Iniciar Feedback Visual
    showModal('loading', t('postAlbum.loading.uploadingTrack', { title: titleFaixa }), 1);
    setIsSavingDraft(true);

    // O FormData continua igual, pois a API precisa dele
    const formData = new FormData();
    formData.append('title', titleFaixa);
    formData.append('genre', genreFaixa || generoPrincipal);
    formData.append('producer', producerFaixa);
    formData.append('feat', JSON.stringify(participantNames));

    // 3. LÓGICA DE TRATAMENTO DE BINÁRIO (ÁUDIO DA FAIXA DO ÁLBUM)
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

    // 4. Chamada à API (O try/catch já é feito dentro de addTrackToAlbum)
    const response = await addTrackToAlbum(albumData.id, formData, (progress) => {
      setUploadProgress(progress);
    });

    // 5. Tratamento de Sucesso ou Erro baseado na resposta da API
    if (response.success) {
      const novoTotalPosted = postedFaixa + 1;
      setPostedFaixa(novoTotalPosted);

      // Limpar campos para a próxima faixa
      setTitleFaixa('');
      setGenreFaixa('');
      setProducerFaixa('');
      setAudioFaixa(null);
      setParticipantNames([]);
      handleNoParticipants();

      // Verificar se o Álbum está completo
      if (novoTotalPosted >= (numFaixas || 0)) {
        showModal('success', t('postAlbum.success.allTracksUploaded'));
      } else {
        showModal('success', t('postAlbum.success.trackProgress', {
          current: novoTotalPosted,
          total: numFaixas
        }));
      }
    } else {
      // Aqui usamos o erro amigável retornado pela API
      console.error("Erro no upload da faixa:", response.error);
      showModal('error', t('postAlbum.errors.uploadTrackError'));
    }

    // Finaliza o estado de carregamento independente de sucesso ou erro
    setIsSavingDraft(false);
  };


  {/**
  const finishAlbumRelease = async () => {
    if (!albumData?.id) return;

    // 1. Abrir modal em estado de carregamento
    showModal('loading', t('postAlbum.loading.finalizing'));
    setIsSavingDraft(true);

    try {
      const response = await finalizeAlbum(albumData.id);

      if (response.success) {
        // 2. Mostrar sucesso no modal
        showModal('success', t('postAlbum.success.published'));

        // 3. LIMPAR TODOS OS ESTADOS (O "Reset" completo)
        setAlbumData(null);
        setCapaAlbum(null);
        setTituloAlbum('');
        setGeneroPrincipal('');
        setNumFaixas(null);
        setPostedFaixa(0);
        setTitleFaixa('');
        setAudioFaixa(null);
        setGenreFaixa('');
        setProducerFaixa('');
        setParticipantNames([]);
        handleNoParticipants();
      }
    } catch (error: any) {
      console.error(error);
      showModal('error', t('postAlbum.errors.finalizeError') || error.response?.data?.error);
    } finally {
      setIsSavingDraft(false);
    }
  };
  
  */}
  // --- 12. FINALIZAÇÃO E CANCELAMENTO (ADAPTADO PARA ÁLBUM) ---
  const finishAlbumRelease = async () => {
    if (!albumData?.id) return;

    showModal('loading', t('postAlbum.loading.finalizing'));
    setIsSavingDraft(true);

    // Chamada à API (já encapsulada com try/catch)
    const response = await finalizeAlbum(albumData.id);

    if (response.success) {
      dispatch(setDraftStatus({ hasAlbumDraft: false }))
      showModal('success', t('postAlbum.success.published'));

      // RESET TOTAL DOS ESTADOS
      setAlbumData(null);
      setCapaAlbum(null);
      setTituloAlbum('');
      setGeneroPrincipal('');
      setNumFaixas(null);
      setPostedFaixa(0);
      setTitleFaixa('');
      setAudioFaixa(null);
      setGenreFaixa('');
      setProducerFaixa('');
      setParticipantNames([]);
      handleNoParticipants();

    } else {
      // Exibe o erro específico que você definiu na API
      showModal('error', t('postAlbum.errors.finalizeError'));
    }

    setIsSavingDraft(false);
  };

  // 1. Apenas abre o modal de confirmação para o Álbum
  const triggerAbortAlbum = () => {
    if (!albumData?.id) return;
    showModal('confirm', t('postAlbum.confirm.abort'));
  };


  const executeAbortAlbum = async () => {
    if (!albumData?.id) return;

    showModal('loading', t('postAlbum.loading.deleting'));

    const response = await abortAlbum(albumData.id);

    if (response.success) {
      // RESET TOTAL DOS ESTADOS
      setAlbumData(null);
      setCapaAlbum(null);
      setTituloAlbum('');
      setGeneroPrincipal('');
      setNumFaixas(null);
      setPostedFaixa(0);
      setTitleFaixa('');
      setAudioFaixa(null);
      setParticipantNames([]);
      handleNoParticipants();
      dispatch(setDraftStatus({ hasAlbumDraft: false }))
      showModal('success', t('postAlbum.success.deleted'));
    } else {
      showModal('error', response.error || t('postAlbum.errors.deleteDraftError'));
    }
  };

  // 2. A função que realmente apaga (chamada pelo onConfirm do Modal no contexto do Álbum)
  {/**
  const executeAbortAlbum = async () => {
    if (!albumData?.id) return;


    showModal('loading', t('postAlbum.loading.deleting'));
    try {
      await abortAlbum(albumData.id); // Chamada à API de Álbum

      // RESET TOTAL DOS ESTADOS
      setAlbumData(null);
      setCapaAlbum(null);
      setTituloAlbum('');
      setGeneroPrincipal('');
      setNumFaixas(null);
      setPostedFaixa(0);
      setTitleFaixa('');
      setAudioFaixa(null);
      setParticipantNames([]);

      showModal('success', t('postAlbum.success.deleted'));
    } catch (error) {
      showModal('error', t('postAlbum.errors.deleteDraftError'));
    } 
    
  };
*/}

  return {
    // Estados do Álbum
    albumData,
    capaAlbum,
    tituloAlbum,
    setTituloAlbum,
    generoPrincipal,
    setGeneroPrincipal,
    pickImageAlbum,
    saveAlbumDraft,
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
    triggerAbortAlbum, // Para o botão de apagar rascunho
    executeAbortAlbum, // Para o onConfirm do Modal
    handleAddTrack,
    finishAlbumRelease,

    pickAudioAlbum
  };
};

export default usePostAlbum;