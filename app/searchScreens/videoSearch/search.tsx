// app/searchScreens/search.tsx
import React, { useState, useEffect } from 'react'; // Importar useEffect
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    ScrollView,
    Keyboard, // Para esconder o teclado
    Image, // Importar Image para exibir imagens dos resultados
    Alert
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router'; // Importar useLocalSearchParams
import { Ionicons } from '@expo/vector-icons';

// Importar dados mockados e estados do Redux se necessário para a lógica de pesquisa
import { useSelector } from 'react-redux';
import { RootState } from '@/src/redux/store';
// IMPORTANTE: Certifique-se de que VideoData e MOCKED_VIDEO_DATA são exportados de VideoClipes.tsx
import { VideoData, MOCKED_VIDEO_DATA } from '@/app/(tabs)/videoClipes';

// Definir o tipo de TabName (deve ser consistente com VideoClipes.tsx)
type TabName = 'feeds' | 'curtidas' | 'seguindo';

// --- NOVOS DADOS MOCKADOS DE ARTISTAS PARA A PESQUISA ---
// Esta interface e dados são para simular a busca por artistas.
// Se você já tem uma fonte de dados de artistas (ex: de uma API), use-a.
interface ArtistData {
    id: string;
    name: string;
    profileImageUrl?: string;
}

const MOCKED_ARTIST_DATA: ArtistData[] = [
    { id: 'artist1', name: 'Artista A', profileImageUrl: 'https://i.pravatar.cc/150?img=1' },
    { id: 'artist2', name: 'Banda B', profileImageUrl: 'https://i.pravatar.cc/150?img=2' },
    { id: 'artist3', name: 'Cantor C', profileImageUrl: 'https://i.pravatar.cc/150?img=3' },
    { id: 'artist4', name: 'Grupo D', profileImageUrl: 'https://i.pravatar.cc/150?img=4' },
    { id: 'artist5', name: 'Artista E', profileImageUrl: 'https://i.pravatar.cc/150?img=5' },
    { id: 'artist9', name: 'Novo Artista X', profileImageUrl: 'https://i.pravatar.cc/150?img=9' },
    { id: 'artist10', name: 'Banda Y', profileImageUrl: 'https://i.pravatar.cc/150?img=10' },
];
// --- FIM DOS NOVOS DADOS MOCKADOS ---


export default function SearchScreen() {
    const router = useRouter();
    // Use useLocalSearchParams para obter os parâmetros da URL
    const { activeTab } = useLocalSearchParams<{ activeTab?: TabName }>(); // activeTab será string ou undefined

    const [searchText, setSearchText] = useState('');
    // displayedResults agora pode conter tanto VideoData[] quanto ArtistData[]
    // Usamos 'any' para flexibilidade, mas idealmente você criaria um tipo de união mais sofisticado
    // ou componentes de renderização condicional mais estritos.
    const [displayedResults, setDisplayedResults] = useState<any[]>([]);

    // Obter dados do Redux para filtrar
    const favoriteVideos = useSelector((state: RootState) => state.favorites.videos);
    const followedArtists = useSelector((state: RootState) => state.followedArtists.artists); // Para a aba 'seguindo'

    // Função para determinar o placeholder com base na aba ativa
    const getPlaceholderText = () => {
        switch (activeTab) {
            case 'feeds':
                return 'Buscar vídeos ou artistas no feed...';
            case 'curtidas':
                return 'Buscar vídeos curtidos...';
            case 'seguindo':
                return 'Buscar artistas que segues...';
            default:
                return 'Buscar vídeos, artistas...'; // Fallback genérico se activeTab não vier
        }
    };

    // Função principal de pesquisa
    const performSearch = (query: string) => {
        const lowerCaseQuery = query.toLowerCase();
        let results: any[] = []; // Pode ser vídeos ou artistas

        if (!query.trim()) {
            setDisplayedResults([]); // Limpa os resultados se a pesquisa estiver vazia
            return;
        }

        switch (activeTab) {
            case 'feeds':
                // Pesquisa em todos os vídeos mockados (título ou artista)
                results = MOCKED_VIDEO_DATA.filter(video =>
                    video.title.toLowerCase().includes(lowerCaseQuery) ||
                    video.artist.toLowerCase().includes(lowerCaseQuery)
                );
                break;
            case 'curtidas':
                // Pesquisa apenas nos vídeos favoritos
                const favoritedVideoIds = favoriteVideos.map(fv => fv.videoId);
                results = MOCKED_VIDEO_DATA.filter(video =>
                    favoritedVideoIds.includes(video.id) &&
                    (video.title.toLowerCase().includes(lowerCaseQuery) ||
                     video.artist.toLowerCase().includes(lowerCaseQuery))
                );
                break;
            case 'seguindo':
                // --- LÓGICA ALTERADA PARA BUSCAR ARTISTAS ---
                // Pesquisa apenas nos artistas (do MOCKED_ARTIST_DATA)
                results = MOCKED_ARTIST_DATA.filter(artist =>
                    artist.name.toLowerCase().includes(lowerCaseQuery)
                );
                break;
            default:
                // Fallback para pesquisa em feeds (vídeos) se activeTab não for reconhecido ou estiver ausente
                results = MOCKED_VIDEO_DATA.filter(video =>
                    video.title.toLowerCase().includes(lowerCaseQuery) ||
                    video.artist.toLowerCase().includes(lowerCaseQuery)
                );
                break;
        }
        setDisplayedResults(results);
    };

    // Aciona a pesquisa quando o texto muda (para busca instantânea)
    useEffect(() => {
        performSearch(searchText);
    }, [searchText, activeTab, favoriteVideos, followedArtists]); // Adicione dependências do Redux

    const handleSearchSubmit = () => {
        performSearch(searchText);
        Keyboard.dismiss(); // Esconde o teclado após a pesquisa
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: false, // Oculta o cabeçalho padrão
                    animation: 'slide_from_right',
                }}
            />
            {/* Custom Header with Search Input */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <TextInput
                    style={styles.searchInput}
                    placeholder={getPlaceholderText()} //* <--- AQUI ESTÁ A MUDANÇA DO PLACEHOLDER */
                    placeholderTextColor="#999"
                    value={searchText}
                    onChangeText={setSearchText}
                    onSubmitEditing={handleSearchSubmit} // Aciona a pesquisa ao pressionar "Enter"
                    returnKeyType="search"
                />
                <TouchableOpacity onPress={handleSearchSubmit} style={styles.searchButton}>
                    <Ionicons name="search" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.resultsContainer} showsVerticalScrollIndicator={false}>
                {displayedResults.length > 0 ? (
                    displayedResults.map((item: any) => (
                        <TouchableOpacity
                            key={item.id} // key pode ser item.id para ambos vídeos e artistas
                            style={styles.resultItem}
                            onPress={() => {
                                console.log(`Clicou em: ${item.title || item.name}`);
                                // Lógica de navegação baseada no tipo de resultado
                                if (activeTab === 'seguindo') {
                                    // Se for um artista, navega para o perfil do artista ou playlist
                                    // Você pode definir uma rota para o perfil do artista, ex: /artist/[id]
                                    // router.push({ pathname: '/artist/[artistId]', params: { artistId: item.id } });
                                    console.log(`Navegar para o perfil do artista: ${item.name} (ID: ${item.id})`);
                                    // Exemplo: Voltar e exibir um alerta simples
                                    router.back();
                                    Alert.alert('Artista Clicado', `Você clicou no artista: ${item.name}`);
                                } else {
                                    // Se for um vídeo, navega para a tela de reprodução de vídeo
                                    router.push({
                                        pathname: '/(tabs)/videoClipes',
                                        params: { videoIdToPlay: item.id } // Você precisaria de lógica em VideoClipes para lidar com isso
                                    });
                                }
                            }}
                        >
                            {/* Renderização condicional dos resultados */}
                            {activeTab === 'seguindo' ? (
                                <>
                                    <Image
                                        source={item.profileImageUrl ? { uri: item.profileImageUrl } : require('@/assets/images/Default_Profile_Icon/unknown_artist.png')}
                                        style={styles.artistProfileImage}
                                    />
                                    <View style={styles.resultTextContainer}>
                                        <Text style={styles.resultTitle}>{item.name}</Text>
                                        <Text style={styles.resultArtist}>Artista</Text> {/* Ou informações adicionais */}
                                    </View>
                                </>
                            ) : (
                                <>
                                    <Image source={{ uri: item.thumbnail }} style={styles.videoThumbnail} />
                                    <View style={styles.resultTextContainer}>
                                        <Text style={styles.resultTitle}>{item.title}</Text>
                                        <Text style={styles.resultArtist}>{item.artist}</Text>
                                    </View>
                                </>
                            )}
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={styles.emptyResultsContainer}>
                        <Ionicons name="film-outline" size={50} color="#888" />
                        <Text style={styles.emptyResultsText}>
                            Comece a digitar para encontrar {activeTab === 'seguindo' ? 'artistas' : 'vídeos ou artistas'}.
                        </Text>
                        {activeTab && activeTab !== 'feeds' && (
                             <Text style={styles.emptyResultsSubText}>
                                Sua pesquisa será focada na aba "{activeTab}".
                            </Text>
                        )}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#191919',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: '#191919', // Alterado para #000 para consistência com outros headers
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    backButton: {
        marginRight: 10,
        padding: 5,
    },
    searchInput: {
        flex: 1,
        height: 40,
        backgroundColor: '#333',
        borderRadius: 20,
        paddingHorizontal: 15,
        color: '#fff',
        fontSize: 16,
    },
    searchButton: {
        marginLeft: 10,
        padding: 5,
    },
    resultsContainer: {
        padding: 10,
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#282828',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    videoThumbnail: {
        width: 80,
        height: 45,
        borderRadius: 4,
        marginRight: 10,
        backgroundColor: '#444',
    },
    artistProfileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
        backgroundColor: '#555',
    },
    resultTextContainer: {
        flex: 1,
    },
    resultTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resultArtist: {
        color: '#ccc',
        fontSize: 13,
    },
    emptyResultsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop: 50,
    },
    emptyResultsText: {
        color: '#ccc',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
    },
    emptyResultsSubText: {
        color: '#888',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 5,
    },
});