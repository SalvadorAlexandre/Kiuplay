// app/profileScreens/usePromoteScreen.tsx
import React, { useState } from 'react';
import { Stack } from 'expo-router';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';

export default function PromoteUserScreen() {
  const [activeTab, setActiveTab] = useState<'configurar' | 'ativas'>('configurar');

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Promover postagem',
          headerStyle: { backgroundColor: '#191919' },
          headerTintColor: '#fff',
          headerShown: true,
        }}
      />
      <View style={{ flex: 1, backgroundColor: '#191919' }}>

        {/* --- Tab Bar Custom --- */}
        <View style={styles.tabBar}>
          <Pressable
            style={[styles.tabButton, activeTab === 'configurar' && styles.activeTab]}
            onPress={() => setActiveTab('configurar')}
          >
            <Text style={styles.tabText}>Configurar Promoção</Text>
          </Pressable>
          <Pressable
            style={[styles.tabButton, activeTab === 'ativas' && styles.activeTab]}
            onPress={() => setActiveTab('ativas')}
          >
            <Text style={styles.tabText}>Promoções Ativas</Text>
          </Pressable>
        </View>

        {/* --- Conteúdo de cada aba --- */}
        <View style={styles.content}>
          {activeTab === 'configurar' ? (
            <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center', paddingHorizontal: 20 }}>
              <Image
                source={require('@/assets/images/4/icons8_music_library_125px.png')}
                resizeMode='center'
              />
              <Text style={styles.configContentText}>Seleciona o conteúdo que desejas promover...</Text>
              <TouchableOpacity
                style={styles.buttonLoadContent}>
                <Text style={{ color: '#fff', fontSize: 16, marginLeft: 10, }}>Escolher música ou instrumental</Text>
              </TouchableOpacity>
            </View>

          ) : (
            <ScrollView
              horizontal={false}
              showsHorizontalScrollIndicator={false}
            >
              <Text style={styles.ativePromoteText}>Aqui vão aparecer as promoções ativas do utilizador.</Text>
            </ScrollView>
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#191919',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#1e90ff', // destaque na aba ativa
  },
  tabText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    //padding: 20,
    //alignItems: 'center',
    //justifyContent: 'center',
  },
  configContentText: {
    color: '#fff',
    fontSize: 20,
    //textAlign: 'center',
    marginBottom: 20,
  },
  ativePromoteText: {
    color: '#fff',
    fontSize: 16,
    //textAlign: 'center',
    marginBottom: 20,
  },

  buttonLoadContent: {
    //flexDirection: 'row',
    alignItems: 'center',
    //justifyContent: 'center',
    backgroundColor: '#1565C0',
    paddingVertical: 5,
    //paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#555',
    //alignSelf: 'flex-start',
    //marginRight: 15,
    //marginBottom: 12,
    //padding: 6,  // Espaçamento interno do botão
  },
});