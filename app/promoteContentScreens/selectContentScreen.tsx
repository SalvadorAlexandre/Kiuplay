// components/promoteContentScreen/selectContentScreen.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { router, Stack } from 'expo-router';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MOCKED_PROFILE } from '@/src/types/contentServer';
import { useAppSelector } from '@/src/redux/hooks';
import debounce from 'lodash.debounce'; // ✅ Importado o debounce

// Assume que o MOCKED_PROFILE é uma array e pegamos o primeiro item
const userProfile = MOCKED_PROFILE[0];

// Tipagem para os itens de conteúdo
type ContentItem = { id: string; title: string; cover?: string };
type TabName = 'Singles' | 'Extended Play' | 'Álbuns' | 'Exclusive Beats' | 'Free Beats';

// Dados de navegação para as tabs, usando os dados do perfil mockado
const contentTabs = {
  'Singles': userProfile.singles || [],
  'Extended Play': userProfile.eps || [],
  'Álbuns': userProfile.albums || [],
  'Exclusive Beats': userProfile.exclusiveBeats || [],
  'Free Beats': userProfile.freeBeats || [],
};

const tabs: TabName[] = ['Singles', 'Extended Play', 'Álbuns', 'Exclusive Beats', 'Free Beats'];

// Imagem padrão
const defaultCoverSource = require("@/assets/images/Default_Profile_Icon/unknown_track.png");


export default function SelectContentScreen() {
  const [activeTab, setActiveTab] = useState<TabName>('Singles');
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);

  // 1. Estado para o texto digitado (feedback visual imediato)
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 2. Estado para o termo de busca DEBOUNCED (usado para o filtro)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');

  // Lógica de verificação de conexão
  const isConnected = useAppSelector((state) => state.network.isConnected);

  // Função interna que atualiza o estado de busca 'lento'
  const filterContent = (term: string) => {
    setDebouncedSearchTerm(term);
  };

  // ✅ Cria a função DEBOUNCED uma única vez usando useMemo
  const debouncedFilter = useMemo(
    // Atraso de 300ms é um bom padrão
    () => debounce(filterContent, 300),
    []
  );

  // Lógica para lidar com a mudança no TextInput
  const handleSearchChange = (text: string) => {
    setSearchQuery(text); // Atualiza o TextInput imediatamente
    debouncedFilter(text); // Chama a versão debounce da função de filtro
  };


  const handleContinue = () => {
    if (!selectedContentId) {
      Alert.alert('Atenção', 'Selecione um conteúdo para continuar.');
      return;
    }

    const selectedItem = (contentTabs[activeTab] as ContentItem[]).find(
      (item) => item.id === selectedContentId
    );
    console.log('Conteúdo selecionado:', selectedItem);
    router.push({
      pathname: `/promoteContentScreens/setup-promotion`,
      params: { contentId: selectedContentId, contentType: activeTab },
    });
  };

  const renderContentItem = useCallback(({ item }: { item: ContentItem }) => {
    const isSelected = item.id === selectedContentId;

    // Lógica para obter a fonte da imagem da capa
    const coverSource =
      isConnected && item.cover && item.cover.trim() !== ''
        ? { uri: item.cover }
        : defaultCoverSource;

    return (
      <TouchableOpacity
        style={styles.contentItemContainer}
        onPress={() => setSelectedContentId(item.id)}
      >
        <Image source={coverSource} style={styles.contentCover} />
        <Text style={styles.contentTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <TouchableOpacity
          style={styles.circleContainer}
          onPress={() => setSelectedContentId(isSelected ? null : item.id)}
        >
          {isSelected && (
            <Ionicons name="checkmark-circle" size={24} color="#1E90FF" />
          )}
          {!isSelected && (
            <Ionicons name="radio-button-off" size={24} color="#666" />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }, [selectedContentId, isConnected]); // Adicionado isConnected às dependências

  // ✅ Otimização: Usa useMemo para recalcular o filtro APENAS quando a tab ou o termo debounced mudam
  const filteredContent = useMemo(() => {
    const currentContent = contentTabs[activeTab] as ContentItem[];

    if (!debouncedSearchTerm) {
      return currentContent;
    }

    const lowercasedTerm = debouncedSearchTerm.toLowerCase();

    return currentContent.filter(item =>
      item.title.toLowerCase().includes(lowercasedTerm)
    );
  }, [activeTab, debouncedSearchTerm]);


  return (
    <>
      <Stack.Screen
        options={{
          title: 'Selecionar conteúdo',
          headerStyle: { backgroundColor: '#191919' },
          headerTintColor: '#fff',
          headerShown: true,
        }}
      />
      <View style={{ flex: 1, backgroundColor: '#191919' }}>
        {/* Campo de busca */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por título..."
            placeholderTextColor="#888"
            // ✅ Usa o novo handler debounced
            onChangeText={handleSearchChange}
            // ✅ Usa o estado rápido para manter o texto atualizado
            value={searchQuery}
          />
        </View>

        {/* Abas de conteúdo */}
        <View style={styles.tabBarContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabsScrollView}
            contentContainerStyle={styles.tabsContainer}
          >
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabButton,
                  activeTab === tab && styles.activeTabButton,
                ]}
                onPress={() => {
                  setActiveTab(tab);
                  setSelectedContentId(null);
                  // ✅ Limpa AMBOS os estados de busca e cancela o debounce pendente
                  setSearchQuery('');
                  setDebouncedSearchTerm('');
                  debouncedFilter.cancel();
                }}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Lista de conteúdo filtrado */}
        {filteredContent.length > 0 ? (
          <FlatList
            data={filteredContent as ContentItem[]}
            renderItem={renderContentItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentList}
          />
        ) : (
          <View style={styles.emptyListContainer}>
            <Text style={styles.emptyListText}>
              Nenhum conteúdo encontrado.
            </Text>
          </View>
        )}

        {/* Barra inferior com botão */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[
              styles.buttonLoadContent,
              !selectedContentId && styles.buttonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!selectedContentId}
          >
            <Text style={styles.buttonText}>
              Continuar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2b2b2b',
    borderRadius: 8,
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#fff',
    fontSize: 16,
  },
  tabBarContainer: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  tabsScrollView: {
    flex: 1,
  },
  tabsContainer: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  tabButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#222',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabButton: {
    backgroundColor: '#1e90ff',
  },
  tabText: {
    color: '#aaa',
    fontSize: 14,
  },
  activeTabText: {
    color: '#fff',
  },
  contentList: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  contentItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#222',
    borderRadius: 8,
    marginBottom: 10,
  },
  contentCover: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 15,
  },
  contentTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  circleContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  buttonLoadContent: {
    backgroundColor: '#1565C0',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#444',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 50,
  },
  emptyListText: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
  },
});