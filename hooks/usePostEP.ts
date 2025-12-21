import { useState, useMemo, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from '@/src/translations/useTranslation';
import { Alert } from 'react-native';
import {
  startEPDraft,
  addTrackToEP,
  finalizeEP,
  getPendingEP,
  abortEP,
} from '@/src/api/uploadContentApi';

const usePostExtendedPlay = () => {
  const { t } = useTranslation();

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
      showModal('error', "Por favor, preencha a capa, título, género e o número de faixas.");
      return;
    }

    showModal('loading', "A criar rascunho do EP...");
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
      showModal('success', "Rascunho criado com sucesso! Agora adicione as músicas.");
      setEpData(response.ep);
      alert("Rascunho criado com sucesso! Agora adicione as músicas.");
    } catch (error: any) {
      showModal('error', error.response?.data?.error || "Erro ao salvar rascunho do EP.");
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Dentro do seu Hook usePostExtendedPlay
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
      }
    };

    checkDraft();
  }, []);

  // --- LOGICA DE COMUNICAÇÃO COM API (FAIXAS) ---

  const handleAddTrack = async () => {
    if (!epData?.id || !audioFaixa || !titleFaixa) {
      showModal('error', "Preencha os dados da faixa e selecione o áudio.");
      return;
    }

    showModal('loading', "A enviar faixa...", 1); // Inicia com 1%
    setIsSavingDraft(true);
    try {
      const formData = new FormData();
      formData.append('title', titleFaixa);
      formData.append('genre', genreFaixa || generoPrincipal);
      formData.append('producer', producerFaixa);

      // Seu backend espera 'feat' como uma string JSON
      formData.append('feat', JSON.stringify(participantNames));

      // Arquivo de Áudio
      formData.append('audioFile', {
        uri: audioFaixa.uri,
        name: audioFaixa.name || 'track.mp3',
        type: audioFaixa.mimeType || 'audio/mpeg',
      } as any);

      // Chamar a função addTrackToEP que você já tem no uploadContentApi
      const response = await addTrackToEP(epData.id, formData, (progress) => {
        setUploadProgress(progress); // Atualiza o progresso no Modal em tempo real
      });

      if (response.success) {
        alert("Faixa adicionada!");
        setPostedFaixa(prev => prev + 1);

        // Limpar campos da faixa para a próxima
        setTitleFaixa('');
        setAudioFaixa(null);
        setParticipantNames([]);

        // Verificar se terminou
        if (postedFaixa + 1 >= numFaixas!) {
          showModal('success', "Todas as faixas foram enviadas!");
        }
      }
    } catch (error) {
      console.error(error);
      showModal('error', "Erro ao enviar faixa.");
    } finally {
      setIsSavingDraft(false);
    }
  };

  const finishRelease = async () => {
    try {
      await finalizeEP(epData.id);
      alert("EP Publicado com sucesso!");
      // Redirecionar usuário
    } catch (error) {
      alert("Erro ao finalizar.");
    }
  };

  // 1. Apenas abre o modal de confirmação
  const triggerAbortEP = () => {
    if (!epData?.id) return;
    showModal('confirm', t('postEP.abortMessage') || "Desejas apagar este rascunho e todos os ficheiros?");
  };

  // 2. A função que realmente apaga (será chamada pelo onConfirm do Modal)
  const executeAbortEP = async () => {
    showModal('loading', "A eliminar rascunho e ficheiros...");
    try {
      await abortEP(epData.id);

      // RESET DOS ESTADOS
      setEpData(null);
      setCapaEP(null);
      setTituloEP('');
      setGeneroPrincipal('');
      setNumFaixas(null);
      setPostedFaixa(0);

      showModal('success', "Rascunho eliminado com sucesso.");
    } catch (error) {
      showModal('error', "Erro ao eliminar o rascunho.");
    }
  };

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
    finishRelease
  };
};

export default usePostExtendedPlay;