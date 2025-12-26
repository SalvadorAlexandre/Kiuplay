//hooks/usePostFaixa.ts
import { useState, useMemo, useCallback } from 'react';
import { Vibration } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { uploadSingle } from '@/src/api';
import { useTranslation } from '@/src/translations/useTranslation'

/**
 * Hook personalizado para gerenciar o estado e lógica
 * da postagem de Faixa Single no Kiuplay.
 */
const usePostFaixa = () => {

  const { t } = useTranslation()

  // --- Campos básicos ---
  const [nomeProdutor, setNomeProdutor] = useState('');
  const [tituloSingle, setTituloSingle] = useState('');
  const [generoSingle, setGeneroSingle] = useState('');

  // --- Participantes ---
  const [hasParticipants, setHasParticipants] = useState(false);
  const [noParticipants, setNoParticipants] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [numParticipants, setNumParticipants] = useState<number | null>(null);
  const [participantNames, setParticipantNames] = useState<string[]>([]);

  // --- Estados de Upload e Modal ---
  const [capaSingle, setCapaSingle] = useState<any>(null);
  const [audioFile, setAudioFile] = useState<any>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  // NOVOS ESTADOS PARA O MODAL
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  // ── URIs normalizadas (para Web vs Mobile) ──
  const coverUri = useMemo(() => {
    if (!capaSingle?.uri) return null;
    if (capaSingle.uri.startsWith('data:') || capaSingle.uri.startsWith('blob:') || capaSingle.uri.startsWith('file://')) {
      return capaSingle.uri;
    }
    return `file://${capaSingle.uri}`;
  }, [capaSingle?.uri]);

  const audioUri = useMemo(() => {
    if (!audioFile?.uri) return null;
    if (audioFile.uri.startsWith('data:') || audioFile.uri.startsWith('blob:') || audioFile.uri.startsWith('file://')) {
      return audioFile.uri;
    }
    return `file://${audioFile.uri}`;
  }, [audioFile?.uri]);

  // ── Converter URI para Blob (Web) ──
  const uriToBlob = async (uri: string): Promise<Blob> => {
    const response = await fetch(uri);
    return await response.blob();
  };

  // ── Função para limpar formulário ──
  const resetForm = useCallback(() => {
    setTituloSingle('');
    setGeneroSingle('');
    setNomeProdutor('');
    setHasParticipants(false);
    setNoParticipants(true);
    setNumParticipants(null);
    setParticipantNames([]);
    setCapaSingle(null);
    setAudioFile(null);
    setUploadProgress(0);
    setUploadStatus('idle');
  }, []);

  // ── Funções de seleção de arquivos ──
  const pickSingleFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'audio/*',
      copyToCacheDirectory: true, // 🔹 IMPORTANTE
    });

    if (result.canceled || !result.assets || result.assets.length === 0) return;

    const file = result.assets[0];

    setAudioFile({
      uri: file.uri.startsWith('file://') ? file.uri : file.uri,
      name: file.name || 'track.mp3',
      type: file.mimeType || 'audio/mpeg',
      size: file.size,
    });
  };

  const pickImageSingle = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) return;

    const image = result.assets[0];

    setCapaSingle({
      uri: image.uri.startsWith('file://') ? image.uri : image.uri,
      name: 'cover.jpg',
      type: 'image/jpeg',
    });
  };

  // ── Manipuladores de participantes ──
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


  // ── Lógica de Upload com Progresso para single (Simplificada) ──
  const handleUploadSingle = async () => {
    // 1. Validação inicial
    if (!audioFile || !capaSingle || !tituloSingle || !generoSingle) {
      setUploadStatus('error');
      setUploadMessage(t('postFaixaScreen.errorFields'));
      setUploadModalVisible(true);
      return;
    }

    // 2. Início do processo e feedback visual
    setUploadLoading(true);
    setUploadModalVisible(true);
    setUploadProgress(0);
    setUploadStatus('idle');
    setUploadMessage(t('postFaixaScreen.preparing'));

    // Criamos o FormData
    const formData = new FormData();
    formData.append('title', tituloSingle);
    formData.append('genre', generoSingle);
    if (nomeProdutor) formData.append('producer', nomeProdutor);
    if (hasParticipants) formData.append('feat', JSON.stringify(participantNames));

    // Tratamento de Capa (Mobile/Web)
    if (coverUri?.startsWith('data:') || coverUri?.startsWith('blob:')) {
      const blob = await uriToBlob(coverUri);
      formData.append('coverFile', blob, 'cover.jpg');
    } else {
      formData.append('coverFile', {
        uri: coverUri,
        name: 'cover.jpg',
        type: 'image/jpeg',
      } as any);
    }

    // Tratamento de Áudio (Mobile/Web)
    if (audioUri?.startsWith('data:') || audioUri?.startsWith('blob:')) {
      const blob = await uriToBlob(audioUri);
      formData.append('audioFile', blob, audioFile.name);
    } else {
      formData.append('audioFile', {
        uri: audioUri,
        name: audioFile.name,
        type: audioFile.type,
      } as any);
    }

    // 3. Chamada da API 
    // Como a API já tem try/catch, ela sempre retornará um objeto ReleaseResponse
    const response = await uploadSingle(formData, (progress) => {
      setUploadProgress(progress);
      setUploadMessage(t('postFaixaScreen.uploadingProgress', { progress }));
    });

    // 4. Tratamento do Resultado
    if (response.success) {
      setUploadStatus('success');
      setUploadMessage(t('postFaixaScreen.success'));
      Vibration.vibrate(200);

      // Opcional: Resetar após 2 segundos
      // setTimeout(() => { setUploadModalVisible(false); resetForm(); }, 2000);
    } else {
      // Aqui o response.error já contém a mensagem da API ou o fallback "Erro ao subir Single."
      setUploadStatus('error');
      setUploadMessage(t('postFaixaScreen.uploadError'));
    }

    setUploadLoading(false);
  };


  {/**
    // ── Lógica de Upload com Progresso para single ──
  const handleUploadSingle = async () => {
    // 1. Validação com feedback visual no Modal
    if (!audioFile || !capaSingle || !tituloSingle || !generoSingle) {
      setUploadStatus('error'); // Define o estado visual de erro
      setUploadMessage(t('postFaixaScreen.errorFields'));
      setUploadModalVisible(true); // Abre o modal para avisar o utilizador
      return;
    }

    try {
      // 2. Início do processo
      setUploadLoading(true);
      setUploadModalVisible(true);
      setUploadProgress(0);
      setUploadStatus('idle'); // Ativa o spinner e barra de progresso
      setUploadMessage(t('postFaixaScreen.preparing'));;

      const formData = new FormData();
      formData.append('title', tituloSingle);
      formData.append('genre', generoSingle);
      if (nomeProdutor) formData.append('producer', nomeProdutor);
      if (hasParticipants) formData.append('feat', JSON.stringify(participantNames));

      // Tratamento de Capa
      if (coverUri?.startsWith('data:') || coverUri?.startsWith('blob:')) {
        const blob = await uriToBlob(coverUri);
        formData.append('coverFile', blob, 'cover.jpg');
      } else {
        formData.append('coverFile', {
          uri: coverUri,
          name: 'cover.jpg',
          type: 'image/jpeg',
        } as any);
      }

      // Tratamento de Áudio
      if (audioUri?.startsWith('data:') || audioUri?.startsWith('blob:')) {
        const blob = await uriToBlob(audioUri);
        formData.append('audioFile', blob, audioFile.name);
      } else {
        formData.append('audioFile', {
          uri: audioUri,
          name: audioFile.name,
          type: audioFile.type,
        } as any);
      }

      // 3. Chamada da API
      const response = await uploadSingle(formData, (progress) => {
        setUploadProgress(progress);
        setUploadMessage(t('postFaixaScreen.uploadingProgress', { progress }));
      });

      // 4. VERIFICAÇÃO DE SUCESSO REAL
      if (response.success) {
        setUploadStatus('success');
        setUploadMessage(t('postFaixaScreen.success'));
        Vibration.vibrate(200);
        // Opcional: Limpar formulário ou navegar para outra tela após 2 segundos
      } else {
        // AQUI é onde os erros do servidor (Prisma/Express) serão capturados
        setUploadStatus('error');
        // Se a API trouxe uma mensagem específica (ex: "Limite de upload atingido"), mostra ela
        setUploadMessage(response.error || t('postFaixaScreen.uploadError'));
      }

      // O bloco catch agora só serve para erros fatais de código
    } catch (err: any) {
      setUploadStatus('error');
      setUploadMessage(t('postFaixaScreen.fatalError'));
    } finally {
      setUploadLoading(false);
    }
  };
    */}

  return {
    // Estados básicos
    nomeProdutor,
    setNomeProdutor,
    tituloSingle,
    setTituloSingle,
    generoSingle,
    setGeneroSingle,

    // Participantes
    hasParticipants,
    noParticipants,
    dropdownOpen,
    numParticipants,
    participantNames,
    setDropdownOpen,
    handleHasParticipants,
    handleNoParticipants,
    handleNumParticipantsChange,
    handleParticipantNameChange,

    // Upload
    capaSingle,
    audioFile,
    pickSingleFile,
    pickImageSingle,
    uploadLoading,
    uploadMessage,
    handleUploadSingle,

    uploadModalVisible,
    setUploadModalVisible,
    uploadProgress,
    uploadStatus, resetForm
  };
};

export default usePostFaixa;