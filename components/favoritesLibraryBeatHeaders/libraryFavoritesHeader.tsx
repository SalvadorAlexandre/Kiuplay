import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LibraryFavoritesHeaderProps {
  activeTab: string;
  tabs: string[];
  onTabPress: (tab: string) => void;
  title: string;
  onBack?: () => void;
}

export const LibraryFavoritesHeader = ({ 
  activeTab, 
  tabs, 
  onTabPress, 
  title, 
  onBack 
}: LibraryFavoritesHeaderProps) => {
  return (
    <View style={styles.container}>
      {/* Barra de Título */}
      <View style={styles.topBar}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Navegação por Abas */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.tabsScroll}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              activeTab === tab && styles.activeTabButton
            ]}
            onPress={() => onTabPress(tab)}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab && styles.activeTabText
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#191919',
    paddingTop: 50,
    paddingBottom: 10,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  tabsScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#333',
  },
  activeTabButton: {
    backgroundColor: '#1E90FF',
    borderColor: '#1E90FF',
  },
  tabText: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
});