// components/globalPlayer/audioPlayerBar.tsx
import React, { useState, useRef } from 'react';
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
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

export default function AudioPlayerBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current; // 0 = minimizado, 1 = expandido
  const [progress, setProgress] = useState(0);

  const { height } = Dimensions.get('window');

  const toggleExpanded = () => {
    Animated.timing(animation, {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();

    setIsExpanded(!isExpanded);
  };

  // Animações interpoladas
  const animatedHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, height * 0.8], // limite a 70% da altura da tela
  });

  const animatedOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const animatedPadding = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 40],
  });

  return (
    <Animated.View style={[styles.container, { height: animatedHeight, paddingTop: animatedPadding }]}>

      <View style={{ flex: 1 }}></View>

      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          Saag Weelli Boy (ft Xuxu Bower & Fred Perry)
        </Text>
      </View>

      <View style={{ alignItems: 'center' }}>
        <View style={styles.controls}>
          <Text style={styles.timeText}>0:00</Text>
          <TouchableOpacity onPress={() => { }}>
            <Ionicons name="repeat" size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { }}>
            <Ionicons name="play-back" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { }}>
            <Ionicons name="play" size={32} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { }}>
            <Ionicons name="play-forward" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleExpanded}>
            <Ionicons name={isExpanded ? 'chevron-down' : 'chevron-up'} size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.timeText}>3:45</Text>
        </View>
      </View>

      {/* Conteúdo extra animado */}
      <Animated.View style={[styles.extraContent, { opacity: animatedOpacity }]}>
        <View style={styles.trackbarContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            value={progress}
            onValueChange={(val) => setProgress(val)}
            minimumTrackTintColor="#1E90FF"
            maximumTrackTintColor="#444"
            thumbTintColor="#fff"
          />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 10 }}>
          <Image
            source={require('@/assets/images/Default_Profile_Icon/kiuplayDefault.png')}
            style={styles.profileImage}
          />
          <Text style={styles.artistName}>Saag Weelli Boy</Text>
          <TouchableOpacity style={styles.followButton} onPress={() => { }}>
            <Text style={styles.followButtonText}>Seguir</Text>
          </TouchableOpacity>
        </View>

        <View style={{ width: '100%' }}>
          <TextInput
            style={styles.commentInput}
            placeholder="Adicionar comentario..."
            placeholderTextColor="#888"
          />
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={() => { }}>
            <Ionicons name="download-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { }}>
            <Ionicons name="heart-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { }}>
            <Ionicons name="chatbubble-ellipses-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { }}>
            <Ionicons name="share-social-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { }}>
            <Ionicons name="list" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60,
    left: 10,
    right: 10,
    backgroundColor: '#111',
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#222',
    borderRadius: 12,
    zIndex: 99,
    elevation: 10,
    overflow: 'hidden',
  },
  trackInfo: {
    alignItems: 'center',
    marginBottom: 10,
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
    fontSize: 16,
    fontWeight: 'bold',
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
    marginBottom: 20,
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 14,
    width: '100%',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
});