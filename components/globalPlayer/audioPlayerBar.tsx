// component/globalPlayer/audioPlayerBar.tsx
import React, { useRef, useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Platform,
  Animated,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';
import {
  togglePlayPauseThunk,
  playNextThunk,
  playPreviousThunk,
  seekToThunk,
  updatePlaybackStatus,
  setError,
  toggleExpanded,
  setSeeking,
} from '@/src/redux/playerSlice';
import { getAudioManager } from '@/src/utils/audioManager';
import { AVPlaybackStatus } from 'expo-av';

const audioManager = getAudioManager();

export default function AudioPlayerBar() {
  const dispatch = useAppDispatch();

  const {
    currentTrack,
    isPlaying,
    positionMillis,
    durationMillis,
    isExpanded,
    isLoading,
    isSeeking,
    error,
  } = useAppSelector((state) => state.player);

  //const coverImageGlobal = useAppSelector(state => state.player.coverImage);

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

  const [sliderValue, setSliderValue] = useState(positionMillis);
  useEffect(() => {
    if (!isSeeking && sliderValue !== positionMillis) {
      setSliderValue(positionMillis);
    }
  }, [positionMillis, isSeeking, sliderValue]);

  const progress = durationMillis > 0 ? positionMillis / durationMillis : 0;

  const [isFavorited, setIsFavorited] = useState(false);
  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const [commentText, setCommentText] = useState('');
  const sendButtonScale = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(sendButtonScale, {
      toValue: commentText.length > 0 ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [commentText]);

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

  if (!currentTrack) return null;

  const coverImage = currentTrack.cover
    ? { uri: currentTrack.cover }
    : require('@/assets/images/Default_Profile_Icon/unknown_track.png');
  /* logo depois de pegar currentTrack */
  
  const artistAvatarSrc =
    currentTrack.artistAvatar        // ex.: https://…/avatar.jpg
      ? { uri: currentTrack.artistAvatar }
      : require('@/assets/images/Default_Profile_Icon/unknown_artist.png');

  return (
    <View
      style={[
        styles.container,
        {
          position: 'absolute',
          left: 0,
          right: 0,
          backgroundColor: '#111',
          ...(isExpanded
            ? {
              top: 0,
              bottom: 0,
              height: '100%',
              width: '100%',
            }
            : {
              bottom: 60,
              height: 68,
            }),
        },
      ]}
    >

      {/*MODO MINIMIZADO*/}
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
          <View style={styles.progressContainer}>
            <View
              style={[styles.progressBar, { width: `${progress * 100}%` }]}
            />
          </View>
        </>
      )
      }

      {/*MODO MAXIMIZADO*/}
      {
        isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.expandedHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Image source={artistAvatarSrc} style={styles.profileImage} />
                <Text style={styles.artistMainName} numberOfLines={1}>
                  {currentTrack.artist}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity style={styles.followButton} onPress={() => { }}>
                  <Text style={styles.followButtonText}>Seguir</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleToggleExpanded} style={{ marginLeft: 8 }}>
                  <Ionicons name="chevron-down" size={28} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            <Image
              source={coverImage}
              style={styles.expandedCover}
              resizeMode="cover"
            />
            <Text style={[styles.trackTitle, { fontSize: 20, marginTop: 16 }]} numberOfLines={1}>{currentTrack.title}</Text>
            <Text style={styles.artistName} numberOfLines={1}>{currentTrack.artist}</Text>

            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={durationMillis > 0 ? durationMillis : 1}
              value={isSeeking ? sliderValue : positionMillis}
              onValueChange={setSliderValue}
              onSlidingStart={() => dispatch(setSeeking(true))}
              onSlidingComplete={handleSeekTo}
              minimumTrackTintColor="#1E90FF"
              maximumTrackTintColor="#444"
              thumbTintColor="#fff"
              disabled={isLoading || durationMillis === 0}
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

            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
              style={{
                marginTop: 16,
                width: '100%',
                paddingHorizontal: 10,
                alignItems: 'center',
              }}
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
                <Image
                  source={require('@/assets/images/audioPlayerBar/icons8_download_120px.png')}
                  style={styles.iconSendComment}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleFavorite}>
                <Ionicons
                  name={isFavorited ? "heart" : "heart-outline"}
                  size={24}
                  color={isFavorited ? "#FF3D00" : "#fff"}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { }}>
                <Image
                  source={require('@/assets/images/audioPlayerBar/icons8_sms_120px.png')}
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
          </View>
        )
      }

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
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    //bottom: 60,
    width: '100%',
    backgroundColor: '#111',
    borderTopWidth: 1,
    borderTopColor: '#222',
    zIndex: 99,
    elevation: 10,
    //overflow: 'hidden',
    //flex: 1,
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
    height: 1,
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
    width: '95%',
    aspectRatio: 1, // sempre quadrada
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
  artistMainName: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
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
    padding: 18,
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
    paddingVertical: 9,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    borderRadius: 100,
    width: 45,
    height: 45,

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
    //flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
    padding: 30,
  },
});