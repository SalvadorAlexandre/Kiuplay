// app/usePostVideoScreen.tsx
import React, { useState } from 'react';
import { Stack } from 'expo-router';
import TopTabBarVideo from '@/components/useTabBarPostVideo';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function PostVideoScreen() {
  const [videoSelected, setVideoSelected] = useState<string | null>(null);
  const [thumbnailSelected, setThumbnailSelected] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public');

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled) {
      setVideoSelected(result.assets[0].uri);
    }
  };

  const pickThumbnail = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });
    if (!result.canceled) {
      setThumbnailSelected(result.assets[0].uri);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Postar vídeo',
          headerStyle: { backgroundColor: '#191919' },
          headerTintColor: '#fff',
          headerShown: false,
        }}
      />
      <View style={{ flex: 1, backgroundColor: '#191919' }}>
        <TopTabBarVideo />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Seletor de Vídeo */}
          <TouchableOpacity style={styles.selector} onPress={pickVideo}>
            {videoSelected ? (
              <Text style={styles.selectedText}>Vídeo selecionado</Text>
            ) : (
              <>
                <Ionicons name="videocam-outline" size={30} color="#aaa" />
                <Text style={styles.selectorText}>Selecionar vídeo</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Seletor de Thumbnail */}
          <TouchableOpacity style={styles.selector} onPress={pickThumbnail}>
            {thumbnailSelected ? (
              <Image
                source={{ uri: thumbnailSelected }}
                style={styles.thumbnail}
              />
            ) : (
              <>
                <Ionicons name="image-outline" size={30} color="#aaa" />
                <Text style={styles.selectorText}>Selecionar capa</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Campo de Título */}
          <TextInput
            style={styles.input}
            placeholder="Título do vídeo"
            placeholderTextColor="#888"
            value={title}
            onChangeText={setTitle}
          />

          {/* Campo de Descrição */}
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Descrição (opcional)"
            placeholderTextColor="#888"
            multiline
            value={description}
            onChangeText={setDescription}
          />

          {/* Seletor de Privacidade */}
          <View style={styles.privacyContainer}>
            <TouchableOpacity
              style={[
                styles.privacyButton,
                privacy === 'public' && styles.privacyButtonActive,
              ]}
              onPress={() => setPrivacy('public')}
            >
              <Ionicons
                name="earth-outline"
                size={20}
                color={privacy === 'public' ? '#fff' : '#aaa'}
              />
              <Text
                style={[
                  styles.privacyText,
                  privacy === 'public' && styles.privacyTextActive,
                ]}
              >
                Público
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.privacyButton,
                privacy === 'private' && styles.privacyButtonActive,
              ]}
              onPress={() => setPrivacy('private')}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={privacy === 'private' ? '#fff' : '#aaa'}
              />
              <Text
                style={[
                  styles.privacyText,
                  privacy === 'private' && styles.privacyTextActive,
                ]}
              >
                Privado
              </Text>
            </TouchableOpacity>
          </View>

          {/* Botão de Postar */}
          <TouchableOpacity
            style={styles.postButton}
            onPress={() => {
              alert('Vídeo enviado!');
            }}
          >
            <Text style={styles.postButtonText}>Postar Vídeo</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#191919',
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  selector: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#222',
  },
  selectorText: {
    color: '#aaa',
    marginTop: 8,
  },
  selectedText: {
    color: '#1E90FF',
    fontWeight: 'bold',
  },
  thumbnail: {
    width: '100%',
    height: 180,
    borderRadius: 8,
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  privacyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  privacyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  privacyButtonActive: {
    borderColor: '#1E90FF',
    backgroundColor: '#1E90FF33',
  },
  privacyText: {
    color: '#aaa',
    marginLeft: 8,
  },
  privacyTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  postButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});