// component/globalPlayer/audioPlayerBar.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  TextInput,
  Animated,
  Easing,
  ActivityIndicator, // Adicionado para o loading
  KeyboardAvoidingView,
  Platform,
  FlatList
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useSelector, useDispatch } from 'react-redux';

// Importações do Redux
import type { RootState, AppDispatch } from '@/src/redux/store'; // Ajustado o caminho para a store
import {
  togglePlayPauseThunk,
  playNextThunk,
  playPreviousThunk,
  playTrackThunk,
  seekToThunk,
  toggleRepeat,
  updatePlaybackStatus, // Adicionado para atualizar o status do player
  setSeeking, // Adicionado para controlar o estado de busca no slider
  setError, // Adicionado para tratar erros
  setPlaylistAndPlayThunk, // Adicionado para carregar playlist inicial (exemplo)
  //stopPlayerThunk, // Adicionado para lidar com o fim da playlist
  toggleExpanded, // Adicionado para controlar a expansão via Redux
  Track,
} from '@/src/redux/playerSlice';
import { useAppSelector } from '@/src/redux/hooks'; // Seus hooks personalizados para Redux
// Importe Track e as thunks do seu playerSlice
//import { Track, } from '@/src/redux/playerSlice'; // Ajuste o caminho conforme seu projeto

// Importação do AudioManager
import { getAudioManager } from '@/src/utils/audioManager';
import { AVPlaybackStatus } from 'expo-av'; // Importar o tipo de status de reprodução do Expo AV
//import { transform } from '@babel/core';

const audioManager = getAudioManager(); // Obtenha a instância singleton do AudioManager

// Remova a interface 'Music' local, vamos usar 'Track' de playerSlice.ts
interface MusicItemProps {
  music: Track; // Agora usa a interface Track
  isCurrent: boolean;
  onPress: () => void;
  index: number;
}

// Componente para exibir uma música na lista
const MusicItem = ({ music, isCurrent, onPress, index }: MusicItemProps) => (
  <TouchableOpacity
    // key deve usar o ID único da Track
    // key={music.id} // Usamos music.id aqui
    style={[
      styles.musicItemContainer,
      isCurrent && styles.currentMusicItem,
    ]}
    onPress={onPress}
    activeOpacity={0.7}
    testID={`music-item-${index}`}
  >
    <Text numberOfLines={1} style={styles.musicName}>
      {isCurrent ? '▶ ' : ''}{music.title} {/* Exibe o título da Track */}
    </Text>
    <Text style={styles.musicSize}>
      {music.size
        ? `${(music.size / (1024 * 1024)).toFixed(2)} MB`
        : 'Tamanho desconhecido'}
    </Text>
  </TouchableOpacity>
);

export default function AudioPlayerBar() {
  const dispatch = useDispatch<AppDispatch>();

  // Use seletores do Redux para obter o estado do player
  const {
    currentTrack,
    isPlaying,
    positionMillis,
    durationMillis,
    isRepeat,
    isExpanded, // Agora vem do Redux
    isLoading,  // Vem do Redux
    isSeeking,  // Vem do Redux
    error,      // Vem do Redux
    playlist,   // Vem do Redux
    //currentIndex, // Vem do Redux
  } = useSelector((state: RootState) => state.player);
  const { currentIndex: reduxCurrentIndex, } = useAppSelector((state) => state.player); // Pega o estado do player do Redux

  // Função para lidar com a seleção e reprodução de músicas
  const handlePlaySpecificMusic = (index: number) => {
    // Dispara a thunk para tocar uma música específica da playlist do Redux
    dispatch(playTrackThunk(index));
  };

  //Animação do btn send comment
  // const sendButtonScale = useRef(new Animated.Value(0)).current;
  // useEffect(() => {
  //   Animated.timing(sendButtonScale, {
  //     toValue: commentText.length > 0 ? 1 : 0,
  //     duration: 200,
  //     useNativeDriver: true,
  //   }).start();
  // }, [sendButtonScale])

  const [isFavorited, setIsFavorited] = useState(false) //Estado para o btn favorito
  const toggleFavorite = () => {
    setIsFavorited(!isFavorited)
  }

  const [commentText, setCommentText] = useState(''); // Estado para armazenar o texto do comentário
  // Estado local para o valor do slider enquanto o usuário está arrastando
  const [sliderValue, setSliderValue] = useState(positionMillis);

  // Animação para expansão/colapso, agora controlada pelo `isExpanded` do Redux
  const animation = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;

  const { height } = Dimensions.get('window');

  // --- Efeito CRÍTICO: Conexão do AudioManager com o Redux ---
  useEffect(() => {
    const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
      // Despacha o status de reprodução para o Redux
      dispatch(updatePlaybackStatus(status));

      // Lógica para reproduzir a próxima música quando a atual termina
      if ('didJustFinish' in status && status.didJustFinish) {
        dispatch(playNextThunk());
      }
    };

    // Registra o callback no AudioManager
    audioManager.setPlaybackStatusUpdateCallback(handlePlaybackStatusUpdate);

    // Exemplo: Carregar uma playlist inicial se nenhuma música estiver carregada na montagem
    // Isso garante que o player tenha algo para exibir e tocar ao iniciar o app.
    // Você pode remover ou ajustar esta lógica dependendo de como você popula a playlist.
    if (!currentTrack && playlist.length === 0) {
      const initialPlaylist = [
        {
          id: '1', uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
          name: 'Song 1', title: 'A Good Song', artist: 'Artist One', cover: 'https://picsum.photos/200/300?random=1'
        },
        {
          id: '2', uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
          name: 'Song 2', title: 'Another Hit', artist: 'Artist Two', cover: 'https://picsum.photos/200/300?random=2'
        },
        {
          id: '3', uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
          name: 'Song 3', title: 'Relaxing Tune', artist: 'Artist Three', cover: 'https://picsum.photos/200/300?random=3'
        },
      ];
      dispatch(setPlaylistAndPlayThunk({ newPlaylist: initialPlaylist, startIndex: 0, shouldPlay: false }));
    }

    // Limpeza: desregistra o callback quando o componente desmontar
    return () => {
      audioManager.setPlaybackStatusUpdateCallback(null);
      //Opcional: dispatch(stopPlayerThunk()); // Descomente se quiser parar o áudio ao desmontar o componente
    };
  }, [dispatch, playlist, currentTrack, isRepeat]); // Dependências cruciais

  // Efeito para sincronizar o slider com o Redux, mas apenas quando o usuário NÃO está buscando
  useEffect(() => {
    if (!isSeeking && sliderValue !== positionMillis) {
      setSliderValue(positionMillis);
    }
  }, [positionMillis, isSeeking, sliderValue]);


  // Efeito para a animação de expansão/colapso, acionado pelo `isExpanded` do Redux
  useEffect(() => {
    Animated.timing(animation, {
      toValue: isExpanded ? 1 : 0, // Agora usa isExpanded do Redux
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [isExpanded, animation]); // isExpanded do Redux é a dependência

  //Animacao do btn enviar comentario
  const sendButtonScale = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(sendButtonScale, {
      toValue: commentText.length > 0 ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [commentText]);

  //Animacao do textinput do comentario
  const commentInputWidth = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.timing(commentInputWidth, {
      toValue: commentText.length > 0 ? 0.85 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [commentText]);

  const animatedCommentInputWidth = commentInputWidth.interpolate({
    inputRange: [0.85, 1],
    outputRange: ['85%', '100%'],
  });
  // Animações interpoladas (mantidas como no seu código original)
  const animatedHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, height - 59], 
  });

  const animatedOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const animatedPadding = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 20],
  });

  // Função de formatação de tempo (melhorada para lidar com NaN)
  const formatTime = useCallback((millis: number) => {
    if (isNaN(millis) || millis === null || millis === undefined) return "0:00";
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, []);

  // --- Handlers de eventos usando useCallback para otimização ---
  const handleTogglePlayPause = useCallback(() => {
    dispatch(togglePlayPauseThunk());
  }, [dispatch]);

  const handlePlayPrevious = useCallback(() => {
    dispatch(playPreviousThunk());
  }, [dispatch]);

  const handlePlayNext = useCallback(() => {
    dispatch(playNextThunk());
  }, [dispatch]);

  const handleSeekTo = useCallback((value: number) => {
    dispatch(seekToThunk(value));
  }, [dispatch]);

  const handleToggleRepeat = useCallback(() => {
    dispatch(toggleRepeat());
  }, [dispatch]);

  // Handler para alternar a expansão, despachando a ação do Redux
  const handleToggleExpandedRedux = useCallback(() => {
    dispatch(toggleExpanded());
  }, [dispatch]);

  // Define a imagem da capa (fallback para uma imagem padrão se não houver)
  const coverImage = currentTrack?.cover ? { uri: currentTrack.cover } : require('@/assets/images/Default_Profile_Icon/unknown_track.png');

  // Se não há música carregada, o player não é renderizado.
  // Você pode ajustar isso se quiser que o player seja sempre visível, mas desativado.
  if (!currentTrack) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, { height: animatedHeight, paddingTop: animatedPadding }]}>


      {/*<View style={{ alignItems: 'center',  width: '100%', marginBottom: 18, flex: 1}}>
        <Image //source={require('@/assets/images/Default_Profile_Icon/unknown_track.png')}
          source={coverImage}
          style={{
            width: '100%',
            height: 350,
            borderRadius: 20,
            backgroundColor: '#222'
          }}
        />
      </View>* */}

      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {currentTrack?.title || 'Nenhuma faixa'}
        </Text>

        {/** <Text style={styles.artistName} numberOfLines={1}>
          {currentTrack?.artist || 'Nenhum artista'}
        </Text>*/}
      </View>

      <View style={{ alignItems: 'center' }}>
        <View style={styles.controls}>
          <TouchableOpacity onPress={handleToggleRepeat}>
            <Ionicons
              name="repeat"
              size={20}
              color={isRepeat ? '#1E90FF' : '#fff'} // Azul quando ativado
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={handlePlayPrevious}>
            <Ionicons name="play-back" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleTogglePlayPause}>
            {isLoading ? ( // Mostra o ActivityIndicator quando está carregando
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={32} color="#fff" />
            )}
          </TouchableOpacity>


          <TouchableOpacity onPress={handlePlayNext}>
            <Ionicons name="play-forward" size={24} color="#fff" />
          </TouchableOpacity>

          {/* O botão de expansão agora usa o handler do Redux e o estado do Redux */}
          <TouchableOpacity onPress={handleToggleExpandedRedux}>
            <Ionicons name={isExpanded ? 'chevron-down' : 'chevron-up'} size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Conteúdo extra animado */}
      <Animated.View style={[styles.extraContent, { opacity: animatedOpacity }]}>
        <View style={styles.trackbarContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.timeText}>{formatTime(positionMillis)}</Text>
            <Text style={styles.timeText}>{formatTime(durationMillis)}</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={durationMillis > 0 ? durationMillis : 1} // usar a duração real
            value={isSeeking ? sliderValue : positionMillis} // Usa sliderValue durante a busca, senão positionMillis
            onValueChange={setSliderValue} // Atualiza o estado local durante o arraste
            onSlidingStart={() => dispatch(setSeeking(true))} // Avisa o Redux que começou a buscar
            onSlidingComplete={handleSeekTo} // Despacha a busca com o valor final
            minimumTrackTintColor="#1E90FF"
            maximumTrackTintColor="#444"
            thumbTintColor="#fff"
            disabled={isLoading || durationMillis === 0} // Desabilita o slider se estiver carregando ou não tiver duração
          />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 10 }}>
          <Image
            source={require('@/assets/images/Default_Profile_Icon/unknown_artist.png')}
            style={styles.profileImage}
          />
          <Text style={styles.artistName}>Saag Weelli Boy</Text>
          <TouchableOpacity style={styles.followButton} onPress={() => { }}>
            <Text style={styles.followButtonText}>Seguir</Text>
          </TouchableOpacity>
        </View>

        {/**<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 10 }}>
          <Image
            source={coverImage} // Usando a coverImage do currentTrack
            style={styles.profileImage}
          />
          <Text style={styles.artistName}>{currentTrack?.artist || 'Artista Desconhecido'}</Text>
          <TouchableOpacity style={styles.followButton} onPress={() => { }}>
            <Text style={styles.followButtonText}>Seguir</Text>
          </TouchableOpacity>
        </View> */}
        <KeyboardAvoidingView
          style={{ flex: 1, }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
          }}>
            <Animated.View style={{ width: animatedCommentInputWidth }}>
              <TextInput
                style={[styles.commentInput, { width: '100%' }]}
                placeholder="Adicionar comentário..."
                placeholderTextColor="#888"
                value={commentText}
                onChangeText={setCommentText}
              />
            </Animated.View>
            {commentText.length > 0 && (
              <Animated.View style={{ transform: [{ scale: sendButtonScale }] }}>
                <TouchableOpacity style={styles.sendButton}>
                  {/* Ícone */}
                  <Image
                    source={require('@/assets/images/audioPlayerBar/icons8_email_send_120px.png')}
                    style={styles.iconSend}
                  />
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        </KeyboardAvoidingView>

        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={() => { }}>
            {/**  <Ionicons name="download-outline" size={24} color="#fff" />*/}
            {/* Ícone */}
            <Image
              source={require('@/assets/images/audioPlayerBar/icons8_download_120px.png')} // Troque pelo seu ícone
              style={styles.iconSendComment}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleFavorite}>
            <Ionicons
              name={
                isFavorited ? "heart" : "heart-outline"}
              size={24} color={isFavorited ? "#FF3D00" : "#fff"
              }
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { }}>
            {/** <Ionicons name="chatbubble-ellipses-outline" size={24} color="#fff" />*/}
            <Image
              source={require('@/assets/images/audioPlayerBar/icons8_sms_120px.png')} // Troque pelo seu ícone
              style={styles.iconSendComment}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { }}>
            <Ionicons name="share-social-outline" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { }}>
            <Ionicons name="list" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Exibir erro se houver */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText} numberOfLines={1}>{error}</Text>
          <TouchableOpacity onPress={() => dispatch(setError(null))}>
            <Ionicons name="close-circle" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {playlist.length === 0 ? ( // Verifica a playlist do Redux
        <Text style={styles.empty}>Nenhuma música na playlist</Text>
      ) : (
        <FlatList
          data={playlist} // Usa a playlist do Redux
          // keyExtractor deve usar o `id` da Track
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <MusicItem
              music={item}
              index={index}
              // Compara o currentIndex do Redux para destacar a música atual
              isCurrent={index === reduxCurrentIndex}
              onPress={() => handlePlaySpecificMusic(index)}
            />
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}

    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60,
    //left: 10,
    //right: 10,
    width: '100%',
    backgroundColor: '#111',
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#222',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    //borderRadius: 12,
    zIndex: 99,
    elevation: 10,
    overflow: 'hidden',
    marginBottom: -2,
  },
  trackInfo: {
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 6,
  },
  trackTitle: {
    color: '#fff',
    fontSize: 14,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
    marginBottom: 2,
    justifyContent: 'center',
  },
  extraContent: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  trackbarContainer: {
    width: '100%',
    paddingHorizontal: 8,
    marginTop: -20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeText: {
    color: '#aaa',
    fontSize: 12,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 25,
  },
  artistName: {
    color: '#fff',
    fontSize: 18,
    //fontWeight: 'bold',
  },
  followButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  followButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  commentInput: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 19,
    fontSize: 16,
    backgroundColor: '#222',
    color: '#fff',
  },
  sendButton: {
    padding: 10,
    marginRight: 6,
    backgroundColor: '#1E90FF',
    marginLeft: 5,
    borderRadius: 90,
    width: 40,
    height: 40,
    alignItems: 'center'
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  errorContainer: { // Estilo para exibir mensagens de erro
    //position: 'absolute',
    // top: 0,
    width: '100%',
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 20,
    marginBottom: 8,
    //zIndex: 100, // Garante que fique acima de outros elementos
  },
  errorText: {
    color: '#fff',
    fontSize: 15,
    flex: 1,
    //marginRight: 10,
  },

  empty: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  musicItemContainer: {
    backgroundColor: '#1f1f1f',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    borderColor: '#333',
    borderWidth: 1,
  },
  currentMusicItem: {
    borderColor: '#1e90ff',
    backgroundColor: '#2a2a2a',
  },
  musicName: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  musicSize: {
    color: '#aaa',
    fontSize: 13,
    marginTop: 4,
  },
  iconSendComment: {
    width: 25,
    height: 25,
    // marginRight: 10,
  },
  iconSend: {
    width: 22,
    height: 22,
    // marginRight: 10,
  },
});