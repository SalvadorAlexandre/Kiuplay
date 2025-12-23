// components/promoteContentScreen/selectContentScreen.tsx
import React, { useState, useCallback, useMemo, useEffect } from 'react';
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
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';
import debounce from 'lodash.debounce';
import { useTranslation } from '@/src/translations/useTranslation'
import { selectCurrentUserId, selectUserById, setUser } from '@/src/redux/userSessionAndCurrencySlice';
import { userApi } from '@/src/api';
import { ArtistProfile } from '@/src/types/contentType';
import { setPromoteActiveTab, PromoteTabKey } from '@/src/redux/persistTabPromote';


type ContentItem = {
  id: string;
  title: string;

  // imagem
  cover?: string | null;

  // categoria / género
  genre?: string | null;
  mainGenre?: string | null;
};

export default function SelectContentScreen() {

  const { t } = useTranslation()
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.promoteTabs.activeTab);
  const isConnected = useAppSelector((state) => state.network.isConnected);
  const currentUserId = useAppSelector(selectCurrentUserId);
  const userProfile = useAppSelector(selectUserById(currentUserId!));

  // Criamos um estado local para os dados "frescos" que vêm da API
  const [fullProfile, setFullProfile] = useState<ArtistProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);

  const loadFreshContent = async () => {
    setIsLoading(true);
    setHasError(false); // Resetamos o erro ao iniciar nova tentativa

    try {
      const data = await userApi.getMe();
      if (data) {
        setFullProfile(data);
        dispatch(setUser(data));
      } else {
        throw new Error("Dados vazios");
      }
    } catch (error) {
      console.error("Erro ao carregar conteúdos:", error);
      setHasError(true); // Ativa a UI de erro
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFreshContent();
  }, []); // Executa ao montar a tela


  // 1. Alinha as chaves das Tabs com as chaves que vêm do Backend/Profile
  const tabs: { key: PromoteTabKey; label: string }[] = [
    { key: 'singles', label: t('selectContentScreen.tabs.singles') },
    { key: 'eps', label: t('selectContentScreen.tabs.extendedPlay') },
    { key: 'albums', label: t('selectContentScreen.tabs.albums') },
    { key: 'exclusiveBeats', label: t('selectContentScreen.tabs.exclusiveBeats') },
    { key: 'freeBeats', label: t('selectContentScreen.tabs.freeBeats') },
  ];

  const contentTabs: Record<PromoteTabKey, ContentItem[]> = useMemo(() => ({
    singles: (fullProfile?.singles ?? []).map(item => ({
      id: item.id,
      title: item.title,
      cover: item.cover,
      genre: item.genre,
    })),

    eps: (fullProfile?.eps ?? []).map(item => ({
      id: item.id,
      title: item.title,
      cover: item.cover,
      mainGenre: item.mainGenre,
    })),

    albums: (fullProfile?.albums ?? []).map(item => ({
      id: item.id,
      title: item.title,
      cover: item.cover,
      mainGenre: item.mainGenre,
    })),

    exclusiveBeats: (fullProfile?.exclusiveBeats ?? []).map(item => ({
      id: item.id,
      title: item.title,
      cover: item.cover,
      genre: item.genre,
    })),

    freeBeats: (fullProfile?.freeBeats ?? []).map(item => ({
      id: item.id,
      title: item.title,
      cover: item.cover,
      genre: item.genre,
    })),
  }), [fullProfile]);


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

    // Corrigido: Tratamos activeTab como PromoteTabKey para indexar o objeto
    const selectedItem = contentTabs[activeTab as PromoteTabKey].find(
      (item) => item.id === selectedContentId
    ); 

    console.log('Conteúdo selecionado:', selectedItem);

    router.push({
      pathname: `/promoteContentScreens/setup-promotion`,
      params: { contentId: selectedContentId, contentType: activeTab },
    });
  };

  const filteredContent = useMemo(() => {
    // Corrigido: Acessando o conteúdo de forma segura
    const currentContent = contentTabs[activeTab as PromoteTabKey];

    if (!debouncedSearchTerm) return currentContent;

    const lowercasedTerm = debouncedSearchTerm.toLowerCase();

    return currentContent.filter(item =>
      item.title.toLowerCase().includes(lowercasedTerm)
    );
  }, [activeTab, debouncedSearchTerm, contentTabs]);



  const getDynamicAvatarUser = () => {
    if (isConnected === false || !fullProfile?.avatar || fullProfile.avatar.trim() === "") {
      return require("@/assets/images/Default_Profile_Icon/icon_profile_white_120px.png");
    }
    return { uri: fullProfile.avatar };
  };

  const avatarUser = getDynamicAvatarUser()

  const renderContentItem = useCallback(({ item }: { item: ContentItem }) => {
    const isSelected = item.id === selectedContentId;

    const getContentCover = () => {
      if (!isConnected || !item.cover || item.cover.trim() === "") {
        return require("@/assets/images/Default_Profile_Icon/unknown_track.png");
      }
      return { uri: item.cover };
    };

    const coverSource = getContentCover();

    return (
      <TouchableOpacity
        style={styles.contentItemContainer}
        onPress={() => setSelectedContentId(item.id)}
      >
        <Image source={coverSource} style={styles.contentCover} />

        {/* Adicionamos uma View para agrupar os textos à esquerda do botão de seleção */}
        <View style={styles.contentInfoContainer}>
          <Text style={styles.contentTitle} numberOfLines={1}>
            {item.title}
          </Text>

          {/* Exibimos a categoria do perfil ou do item */}
          <Text style={styles.contentCategory} numberOfLines={1}>
            {item.genre || item.mainGenre || t('selectContentScreen.noGenre')}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.circleContainer}
          onPress={() => setSelectedContentId(isSelected ? null : item.id)}
        >
          {isSelected ? (
            <Ionicons name="checkmark-circle" size={24} color="#1E90FF" />
          ) : (
            <Ionicons name="radio-button-off" size={24} color="#666" />
          )}
        </TouchableOpacity>
      </TouchableOpacity >
    );
  }, [selectedContentId, isConnected, fullProfile]);


  return (
    <>
      <Stack.Screen
        options={{
          title: t('selectContentScreen.title'),
          headerStyle: { backgroundColor: '#191919' },
          headerTintColor: '#fff',
          headerShown: true,
        }}
      />
      <View style={{ flex: 1, backgroundColor: '#191919' }}>

        {/* 1. ESTADO DE CARREGAMENTO INICIAL */}
        {!fullProfile && isLoading ? (
          <View style={styles.centeredContainer}>
            <ActivityIndicator size="large" color="#1E90FF" />
            <Text style={styles.loadingText}>{t('selectContentScreen.loading')}</Text>
          </View>
        ) : hasError ? (
          /* 2. ESTADO DE ERRO */
          <View style={styles.centeredContainer}>
            <Ionicons name="alert-circle-outline" size={70} color="#ff4444" />
            <Text style={styles.errorText}>{t('selectContentScreen.errorLoading')}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={loadFreshContent}
            >
              <Ionicons name="refresh" size={20} color="#fff" />
              <Text style={styles.buttonText}>{t('selectContentScreen.button.retry')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* 3. ESTADO DE SUCESSO (CONTEÚDO) */
          <>
            {/* Cabeçalho do Artista */}
            <View style={styles.artistContainer}>
              <Image source={avatarUser} style={styles.artistCover} />
              <Text style={styles.artistName}>{fullProfile?.name || userProfile?.name}</Text>
            </View>

            {/* Campo de busca */}
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder={t('selectContentScreen.searchPlaceholder')}
                placeholderTextColor="#888"
                onChangeText={handleSearchChange}
                value={searchQuery}
              />
            </View>

            {/* Abas de conteúdo */}
            <View style={styles.tabBarContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabsContainer} // Use contentContainerStyle para padding
              >
                {tabs.map((tab) => (
                  <TouchableOpacity
                    key={tab.key}
                    style={[styles.tabButton, activeTab === tab.key && styles.activeTabButton]}
                    onPress={() => {
                      // Atualiza o Redux imediatamente
                      dispatch(setPromoteActiveTab(tab.key));
                      // Limpa estados de seleção e busca
                      setSelectedContentId(null);
                      setSearchQuery('');
                      setDebouncedSearchTerm('');
                      debouncedFilter.cancel();
                    }}
                  >
                    <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Lista de Itens */}
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
                <Text style={styles.emptyListText}>{t('selectContentScreen.emptyList')}</Text>
              </View>
            )}

            {/* Barra inferior fixa */}
            <View style={styles.bottomBar}>
              <TouchableOpacity
                style={[
                  styles.buttonLoadContent,
                  !selectedContentId && styles.buttonDisabled
                ]}
                onPress={handleContinue}
                disabled={!selectedContentId}
              >
                <Text style={styles.buttonText}>{t('selectContentScreen.button.continue')}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
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
    //marginTop: 4,
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

  //contentItemContainer: {
  // flexDirection: 'row', // Alinha Imagem | Textos | Checkbox
  // alignItems: 'center',
  // padding: 12,
  // backgroundColor: '#222',
  // borderRadius: 12,
  // marginBottom: 10,
  //},
  contentInfoContainer: {
    flex: 1, // Faz com que os textos ocupem o espaço disponível entre a imagem e o círculo
    marginLeft: 12,
  },
  // contentTitle: {
  // color: '#fff',
  // fontSize: 16,
  // fontWeight: 'bold',
  // },
  contentCategory: {
    color: '#888', // Cinzento para dar menos peso que o título
    fontSize: 13,
    marginTop: 2,
    textTransform: 'capitalize', // Formata ex: "rapper" para "Rapper"
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


  artistContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15
  },
  artistCover: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  artistName: {
    color: '#fff',
    marginLeft: 12,
    fontSize: 18,
    fontWeight: 'bold'
  },

  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#888',
    marginTop: 15,
    fontSize: 16,
  },
  errorText: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  retryButton: {
    flexDirection: 'row',
    backgroundColor: '#1E90FF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
});