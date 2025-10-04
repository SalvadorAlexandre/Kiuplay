// app/shareScreens/music/[musicId].tsx
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { // <-- Adicionado useEffect
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
    Image,
    Alert,
    Share,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import debounce from 'lodash.debounce'; // 💡 IMPORTAÇÃO DO DEBOUNCE

// 💡 IMPORTAÇÃO DOS DADOS MOCKADOS E TIPOS
import { MOCKED_PROFILE } from '@/src/types/contentServer';
import { ProfileReference } from '@/src/types/contentType';

// O perfil que estamos 'usando' para simular o usuário logado
const userProfile = MOCKED_PROFILE[0];

interface User extends ProfileReference { }

// EXTRAÇÃO DOS DADOS: Usamos os dados de followers do MOCKED_PROFILE
const followersData: User[] = userProfile?.followers || [];


export default function ShareMusicScreen() {
    const params = useLocalSearchParams();

    // Tratamento de parâmetros (mantido)
    const musicId = Array.isArray(params.musicId) ? params.musicId[0] : (params.musicId || '');
    const musicTitle = Array.isArray(params.musicTitle) ? params.musicTitle[0] : (params.musicTitle || 'Título Desconhecido');
    const artistName = Array.isArray(params.artistName) ? params.artistName[0] : (params.artistName || 'Artista Desconhecido');
    const albumArtUrl = Array.isArray(params.albumArtUrl)
        ? params.albumArtUrl[0]
        : (params.albumArtUrl || '');

    // 1. Estado para o texto de entrada (atualizado em tempo real)
    const [inputSearchText, setInputSearchText] = useState('');

    // 2. Estado para o texto de pesquisa (atualizado apenas pelo debounce)
    const [debouncedSearchText, setDebouncedSearchText] = useState('');

    // 3. Função debounced: usa useCallback para garantir que a função debounce só seja criada uma vez
    const handleSearch = useMemo(
        () => debounce((text: string) => {
            setDebouncedSearchText(text);
        }, 300), // Atraso de 300ms
        [] // Dependências vazias: a função nunca muda
    );

    // 4. Efeito para limpar o debounce na desmontagem do componente
    useEffect(() => {
        return () => {
            handleSearch.cancel(); // Limpa o timer do debounce ao sair da tela
        };
    }, [handleSearch]);


    // 5. Lógica de filtragem: usa o estado DEBOUNCED
    const filteredFollowers = useMemo(() => {
        const searchText = debouncedSearchText;
        if (!searchText) return followersData;

        const lowercasedSearch = searchText.toLowerCase();

        // Filtra por name OU username
        return followersData.filter(user =>
            user.name.toLowerCase().includes(lowercasedSearch) ||
            user.username.toLowerCase().includes(lowercasedSearch)
        );
    }, [debouncedSearchText]); // A lista só é filtrada quando o debouncedSearchText muda


    // --- Lógica de Compartilhamento Interno (mantida) ---
    const handleShare = async () => {
        if (followersData.length === 0) {
            Alert.alert('Sem Seguidores', 'Você não tem seguidores para partilhar internamente.');
            return;
        }

        Alert.alert(
            'Partilha com Seguidores',
            `"${musicTitle}" de ${artistName} foi partilhado com todos os seus ${followersData.length} seguidores!`
        );

        console.log(`Compartilhando música internamente com TODOS os ${followersData.length} seguidores.`);
    };

    // --- Lógica de Compartilhamento Nativo (mantida) ---
    const handleNativeShare = async () => {
        try {
            const shareableLink = `https://kiuplay.com/music/${musicId}`;

            const result = await Share.share({
                message: `Ouça agora: ${musicTitle} de ${artistName} na Kiuplay!`,
                url: shareableLink,
                title: `Compartilhar Música: ${musicTitle}`,
            });

            if (result.action === Share.sharedAction) {
                console.log('Compartilhado com sucesso!');
            } else if (result.action === Share.dismissedAction) {
                console.log('Compartilhamento nativo cancelado.');
            }
        } catch (error: any) {
            console.error('Erro ao compartilhar nativamente:', error.message);
            Alert.alert('Erro', 'Não foi possível preparar o compartilhamento nativo.');
        }
    };


    // --- Renderização do Item do Usuário (mantida) ---
    const renderUserItem = ({ item }: { item: User }) => (
        <View style={styles.userItem}>
            <Image
                source={{ uri: item.avatar }}
                style={styles.userProfileImage}
            />
            <View style={styles.userInfoText}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userUsername}>{item.username}</Text>
            </View>
            <Ionicons name="person-outline" size={20} color="#555" />
        </View>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: 'Partilhar Música',
                    headerStyle: { backgroundColor: '#1E1E1E' },
                    headerTintColor: '#fff',
                }}
            />

            {/* ... Music Info Card ... */}
            <View style={styles.musicInfoCard}>
                {albumArtUrl ? (
                    <Image source={{ uri: albumArtUrl }} style={styles.albumArt} />
                ) : (
                    <View style={styles.albumArtPlaceholder}>
                        <Ionicons name="image-outline" size={40} color="#888" />
                    </View>
                )}
                <View style={styles.musicTextInfo}>
                    <Text style={styles.musicTitle}>{musicTitle}</Text>
                    <Text style={styles.artistName}>{artistName}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.nativeShareButton} onPress={handleNativeShare}>
                <Ionicons name="share-outline" size={22} color="#fff" />
                <Text style={styles.nativeShareButtonText}>Partilhar em outras apps</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>
                Seus Seguidores
            </Text>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Pesquisar seguidores por nome ou @username"
                    placeholderTextColor="#888"
                    // O TextInput agora usa inputSearchText
                    value={inputSearchText}
                    // O onChangeText agora chama a função debounced e atualiza o estado de input
                    onChangeText={(text) => {
                        setInputSearchText(text);
                        handleSearch(text); // Chama o debounce
                    }}
                />
            </View>

            <FlatList
                data={filteredFollowers}
                renderItem={renderUserItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={<View style={styles.listSeparator} />}
                ListEmptyComponent={<Text style={styles.emptyListText}>Nenhum seguidor encontrado.</Text>}
            />

            <TouchableOpacity
                style={styles.shareButton}
                onPress={handleShare}
            >
                <Text style={styles.shareButtonText}>
                    Partilhar com TODOS os Seguidores ({followersData.length})
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#191919',
        padding: 15,
    },
    // ... (restante dos estilos mantidos) ...
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    musicInfoCard: {
        flexDirection: 'row',
        backgroundColor: '#1a1a1a',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        alignItems: 'center',
    },
    albumArt: {
        width: 80,
        height: 80,
        borderRadius: 4,
        marginRight: 10,
        backgroundColor: '#333',
    },
    albumArtPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 4,
        marginRight: 10,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    musicTextInfo: {
        flex: 1,
    },
    musicTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    artistName: {
        color: '#ccc',
        fontSize: 13,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
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
    listContent: {
        paddingBottom: 20,
    },
    listSeparator: {
        height: 1,
        backgroundColor: '#2a2a2a',
        marginBottom: 10,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        padding: 10,
        marginBottom: 5,
        backgroundColor: '#1f1f1f',
    },
    userProfileImage: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
        marginRight: 10,
        backgroundColor: '#333',
    },
    userInfoText: {
        flex: 1,
    },
    userName: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    userUsername: {
        color: '#aaa',
        fontSize: 12,
    },
    shareButton: {
        backgroundColor: '#1E90FF',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    shareButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    nativeShareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#34A853',
        paddingVertical: 12,
        borderRadius: 8,
        marginBottom: 15,
        gap: 8,
    },
    nativeShareButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyListText: {
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
    }
});
//export default ShareMusicScreen;