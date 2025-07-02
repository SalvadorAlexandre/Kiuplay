// component/globalPlayer/audioPlayerBar.tsx
import React, { useRef, useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
  Easing,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

// Importando o hook correto
import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';
import {
  togglePlayPauseThunk,
  playNextThunk,
  playPreviousThunk,
  seekToThunk,
  toggleRepeat,
  updatePlaybackStatus,
  setError,
  toggleExpanded,
  setPlaylistAndPlayThunk,
} from '@/src/redux/playerSlice';
import { getAudioManager } from '@/src/utils/audioManager';
import { AVPlaybackStatus } from 'expo-av';

const audioManager = getAudioManager();

export default function AudioPlayerBar() {
  const dispatch = useAppDispatch();

  // Seletores tipados
  const {
    currentTrack,
    isPlaying,
    positionMillis,
    durationMillis,
    isExpanded,
    isLoading,
    error,
  } = useAppSelector((state) => state.player);

  const animation = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;
  const { height } = Dimensions.get('window');

  useEffect(() => {
    const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
      dispatch(updatePlaybackStatus(status));
      if ('didJustFinish' in status && status.didJustFinish) {
        dispatch(playNextThunk());
      }
    };
    audioManager.setPlaybackStatusUpdateCallback(handlePlaybackStatusUpdate);
    return () => {
      audioManager.setPlaybackStatusUpdateCallback(null);
    };
  }, [dispatch]);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

  const handleTogglePlayPause = useCallback(() => {
    dispatch(togglePlayPauseThunk());
  }, [dispatch]);

  const handleToggleExpanded = useCallback(() => {
    dispatch(toggleExpanded());
  }, [dispatch]);

  const handleSeekTo = useCallback((v: number) => {
    dispatch(seekToThunk(v));
  }, [dispatch]);

  const formatTime = (millis: number) => {
    if (!millis) return '0:00';
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!currentTrack) return null;

  const coverImage = currentTrack.cover
    ? { uri: currentTrack.cover }
    : require('@/assets/images/Default_Profile_Icon/unknown_track.png');

  // Animations
  const animatedHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [70, height - 58],
  });
  const animatedOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const progress = durationMillis > 0 ? positionMillis / durationMillis : 0;

  //HOOK PARA O BTN FAVORITO/CURTIR
  const [isFavorited, setIsFavorited] = useState(false) //Estado para o btn favorito
  const toggleFavorite = () => {
    setIsFavorited(!isFavorited)
  }
  //ANIMACAO DO INPUTTEXT COMMENT/HOOKS
  const [commentText, setCommentText] = useState(''); // Estado para armazenar o texto do comentário
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
    outputRange: ['90%', '100%'],
  });

  return (
    <Animated.View style={[styles.container, { height: animatedHeight }]}>
      {/* MODO MINIMIZADO */}
      {!isExpanded && (
        <>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.minimizedBar}
            onPress={handleToggleExpanded}
          >
            <View style={styles.minimizedLeft}>
              <Image source={coverImage} style={styles.minimizedCover} />
              <View style={{ marginLeft: 8, flexShrink: 1 }}>
                <Text style={styles.trackTitle} numberOfLines={1}>{currentTrack.title}</Text>
                <Text style={styles.artistName} numberOfLines={1}>{currentTrack.artist}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleTogglePlayPause} style={{ padding: 10 }}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons
                  name={isPlaying ? 'pause' : 'play'}
                  size={28}
                  color="#fff"
                />
              )}
            </TouchableOpacity>
          </TouchableOpacity>

          {/* Barra de progresso fixa na borda */}
          <View style={styles.progressContainer}>
            <View
              style={[styles.progressBar, { width: `${progress * 100}%` }]}
            />
          </View>
        </>
      )}

      {/* MODO EXPANDIDO */}
      <Animated.View style={[styles.expandedContent, { opacity: animatedOpacity }]}>
        <View style={styles.expandedHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Image
              source={require('@/assets/images/Default_Profile_Icon/unknown_artist.png')}
              style={styles.profileImage}
            />
            <Text style={styles.artistMaiName} numberOfLines={1}>{currentTrack.artist}</Text>
          </View>
          <TouchableOpacity style={styles.followButton} onPress={() => { }}>
            <Text style={styles.followButtonText}>Seguir</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleToggleExpanded}>
            <Ionicons name="chevron-down" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <Image source={coverImage} style={styles.expandedCover} />
        <Text style={[styles.trackTitle, { fontSize: 20, marginTop: 16 }]} numberOfLines={1}>{currentTrack.title}</Text>
        <Text style={styles.artistName} numberOfLines={1}>{currentTrack.artist}</Text>

        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={durationMillis || 1}
          value={positionMillis}
          onSlidingComplete={handleSeekTo}
          minimumTrackTintColor="#1E90FF"
          maximumTrackTintColor="#555"
          thumbTintColor="#fff"
        />
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(positionMillis)}</Text>
          <Text style={styles.timeText}>{formatTime(durationMillis)}</Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity onPress={() => dispatch(playPreviousThunk())}>
            <Ionicons name="play-skip-back" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleTogglePlayPause}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons
                name={isPlaying ? 'pause-circle' : 'play-circle'}
                size={48}
                color="#fff"
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => dispatch(playNextThunk())}>
            <Ionicons name="play-skip-forward" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <KeyboardAvoidingView
        style={{ padding: 14, marginTop: 10 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 12,
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
      {/* Exibir erro se houver */}
      {
        error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => dispatch(setError(null))}>
              <Ionicons name="close-circle" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )
      }
    </Animated.View >
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    backgroundColor: '#111',
    borderTopWidth: 1,
    borderTopColor: '#222',
    zIndex: 99,
    elevation: 10,
    overflow: 'hidden',
  },
  minimizedBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    height: 68,
  },
  minimizedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  minimizedCover: {
    width: 48,
    height: 48,
    borderRadius: 4,
  },
  progressContainer: {
    height: 3,
    backgroundColor: '#333',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1E90FF',
  },
  expandedContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  expandedHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginTop: 10,
  },
  expandedCover: {
    marginTop: 29,
    width: 260,
    height: 260,
    borderRadius: 12,
    backgroundColor: '#222',
  },
  slider: {
    width: '100%',
    marginTop: 20,
  },
  timeContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timeText: {
    color: '#aaa',
    fontSize: 12,
  },
  trackTitle: {
    color: '#fff',
    fontSize: 14,
  },
  artistName: {
    color: '#ccc',
    fontSize: 12,
  },
  artistMaiName: {
    color: '#fff',
    fontSize: 16,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 1,
  },
  errorContainer: {
    backgroundColor: 'rgba(255,0,0,0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
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
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 25,
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
    padding: 30,
  },
});