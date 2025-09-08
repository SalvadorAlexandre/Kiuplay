// app/profileScreens/usePromoteScreen.tsx
import React, { useState } from 'react';
import { Stack } from 'expo-router';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
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
            <Text style={styles.contentText}>Aqui o utilizador vai configurar uma nova promoção.</Text>
            
          ) : (
            <Text style={styles.contentText}>Aqui vão aparecer as promoções ativas do utilizador.</Text>
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
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});