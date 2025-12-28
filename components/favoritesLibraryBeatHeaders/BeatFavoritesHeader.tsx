import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Definimos o tipo das abas para garantir segurança no código
type BeatTab = 'free' | 'exclusive';

interface BeatFavoritesHeaderProps {
  activeTab: BeatTab;
  onTabPress: (tab: BeatTab) => void;
  t: any; 
}

export const BeatFavoritesHeader = ({ activeTab, onTabPress, t }: BeatFavoritesHeaderProps) => {
  
  // Array de configuração das abas
  const beatTabs: { id: BeatTab; label: string }[] = [
    { id: 'free', label: t('favorites.tabs.freeBeats') },
    { id: 'exclusive', label: t('favorites.tabs.exclusiveBeats') },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerInfo}>
        <Ionicons name="heart" size={24} color="#1E90FF" />
        <Text style={styles.headerTitle}>{t('favorites.beatsTitle')}</Text>
      </View>

      <View style={styles.segmentedControl}>
        {beatTabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.segmentItem, 
              activeTab === tab.id && styles.activeSegment
            ]}
            onPress={() => onTabPress(tab.id)}
          >
            <Text 
              style={[
                styles.segmentText, 
                activeTab === tab.id && styles.activeSegmentText
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
    backgroundColor: '#191919',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#262626',
    borderRadius: 12,
    padding: 4,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeSegment: {
    backgroundColor: '#333',
    // Sombra para dar profundidade ao item ativo
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  segmentText: {
    color: '#888',
    fontWeight: '600',
    fontSize: 14,
  },
  activeSegmentText: {
    color: '#1E90FF', // Destaque na cor do texto ativo
  },
});