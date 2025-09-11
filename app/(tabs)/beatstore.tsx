// app/(tabs)/beatstore.tsx
import React from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/redux/store';

import TopTabBarBeatStore from '@/components/topTabBars/topTabBarBeatStoreScreen';
import useBeatStoreTabs from '@/hooks/useBeatStoreTabs';
import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';
//import { Track, playTrackThunk, setPlaylistAndPlayThunk } from '@/src/redux/playerSlice';
//import { addFavoriteMusic, removeFavoriteMusic, FavoritedMusic } from '@/src/redux/favoriteMusicSlice'; // Importar FavoritedMusic
import BeatStoreMusicItem from '@/components/musicItems/beatStoreItem/BeatStoreMusicItem';
import { MOCKED_BEATSTORE_FEED_DATA } from '@/src/types/contentServer';
import {BeatStoreFeedItem, ExclusiveBeat, FreeBeat } from '@/src/types/contentType';

// Dados mockados para beats da Beat Store (Feeds e Seguindo) - ATUALIZADO COM TIPAGEM E PROPRIEDADES CORRETAS
// O tipo agora é uma união de ExclusiveBeat e FreeBeat


export default function BeatStoreScreen() {
    const router = useRouter();
    //const dispatch = useAppDispatch();
    const { activeTab, handleTabChange } = useBeatStoreTabs();

    

    const favoritedMusics = useAppSelector((state) => state.favoriteMusic.musics);
    //const { currentTrack, currentIndex, playlist } = useAppSelector((state) => state.player);
    const followedArtists = useSelector((state: RootState) => state.followedArtists.artists);

    // O filtro aqui já funciona, pois FavoritedMusic estende Track, que por sua vez inclui ExclusiveBeat e FreeBeat
    const favoritedBeatStoreMusics: (ExclusiveBeat | FreeBeat)[] = favoritedMusics.filter(
        (music) =>
            music.category === 'beat' && ( // Adicionado filtro por categoria 'beat'
                music.source === 'beatstore-favorites'||
                music.source === 'beatstore-feeds'
            )
    ) as (ExclusiveBeat | FreeBeat)[]; // Casting para o tipo correto

    const handleBeatStoreItemPress = (item: BeatStoreFeedItem) => { // Tipagem atualizada
        // Certifica-se de que a música a ser reproduzida é do tipo Track, que é o que o playerSlice espera
        if (item.typeUse === 'free') {
            router.push(`/contentCardBeatStoreScreens/freeBeat-details/${item.id}`);
        } else if (item.typeUse === 'exclusive') {
            router.push(`/contentCardBeatStoreScreens/exclusiveBeat-details/${item.id}`);
        }
        else {
            console.warn('Tipo de item desconhecido ou não suportado para navegação...');
        }
    };

    const handleNavigateToArtistProfile = (artistId: string) => {
        router.push(`/contentCardLibraryScreens/artist-profile/${artistId}`);
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#191919' }}>
            <TopTabBarBeatStore />

            <View style={styles.tabsContainer}>
                {['feeds', 'curtidas', 'seguindo'].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        onPress={() => handleTabChange(tab as 'feeds' | 'curtidas' | 'seguindo')}
                        style={[
                            styles.tabButton,
                            activeTab === tab && styles.activeTabButton,
                        ]}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === tab && styles.activeTabText,
                            ]}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView
                horizontal={false}
                style={styles.scroll}
                contentContainerStyle={styles.container}
                showsHorizontalScrollIndicator={false}
            >
                {activeTab === 'feeds' && (
                    <View style={styles.beatStoreMusicListContainer}>
                        
                        <FlatList
                            data={MOCKED_BEATSTORE_FEED_DATA}
                            keyExtractor={(item) => item.id}
                            numColumns={2}
                            columnWrapperStyle={styles.row}
                            renderItem={({ item }) => (
                                <BeatStoreMusicItem
                                    item={item} // Passa o item completo
                                    onPress={handleBeatStoreItemPress}
                                />
                            )}
                            contentContainerStyle={{ paddingBottom: 20 }}
                            ListEmptyComponent={() => (
                                <Text style={styles.emptyListText}>Nenhum beat nos feeds da Beat Store.</Text>
                            )}
                        />
                    </View>
                )}

                {activeTab === 'curtidas' && (
                    <View style={styles.favoritedMusicListContainer}>
                        {favoritedBeatStoreMusics.length === 0 ? (
                            <Text style={styles.emptyListText}>Nenhum beat curtido ainda na Beat Store.</Text>
                        ) : (
                            <FlatList
                                data={favoritedBeatStoreMusics}
                                keyExtractor={(item) => item.id}
                                numColumns={2}
                                columnWrapperStyle={styles.row}
                                renderItem={({ item }) => (
                                    <BeatStoreMusicItem
                                        item={item} // Passa o item completo
                                        onPress={handleBeatStoreItemPress}
                                    />
                                )}
                                contentContainerStyle={{ paddingBottom: 20 }}
                            />
                        )}
                    </View>
                )}

                {/* Conteúdo da tab 'seguindo' (AGORA EXIBE OS ARTISTAS SEGUIDOS DO REDUX) */}
                {activeTab === 'seguindo' && (
                    <FlatList
                        data={followedArtists}
                        keyExtractor={(item) => item.id}
                        ListEmptyComponent={() => (
                            <View style={styles.tabContentTextContainer}>
                                <Text style={styles.tabContentText}>Você não está seguindo nenhum artista.</Text>
                            </View>
                        )}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.followedArtistItem}
                                onPress={() => handleNavigateToArtistProfile(item.id)}
                            >
                                <Image
                                    source={item.profileImageUrl ? { uri: item.profileImageUrl } : require('@/assets/images/Default_Profile_Icon/unknown_artist.png')}
                                    style={styles.followedArtistProfileImage}
                                />
                                <Text style={styles.followedArtistName}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={styles.flatListContentContainer}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                    />
                )}
                <View style={{ height: 110 }}></View>
            </ScrollView>

            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => {
                    router.push('/autoSearchBeatScreens/useSearchBeatScreen');
                    console.log('Botão da Beat Store pressionado!');
                }}
            >
                <Image
                    source={require('@/assets/images/4/sound-waves.png')}
                    style={{ width: 50, height: 40, tintColor: '#fff' }}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
        backgroundColor: '#191919',
    },
    container: {
        flexGrow: 1,
    },
    floatingButton: {
        position: 'absolute',
        bottom: 110,
        right: 25,
        width: 60,
        height: 60,
        backgroundColor: '#1565C0',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    tabsContainer: {
        flexDirection: 'row',
        //marginLeft: 10,
        paddingVertical: 15,
    },
    tabButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#333',
        marginHorizontal: 10,
    },
    activeTabButton: {
        backgroundColor: '#1565C0',
    },
    tabText: {
        color: '#aaa',
        fontWeight: 'bold',
    },
    activeTabText: {
        color: '#fff',
    },
    title: {
        color: '#fff',
        marginTop: 20,
        marginLeft: 15,
        marginBottom: 10,
        fontSize: 20,
        fontWeight: 'bold',
    },
    favoritedMusicListContainer: {
        flex: 1,
        paddingHorizontal: 10,
    },
    beatStoreMusicListContainer: {
        flex: 1,
        paddingHorizontal: 10,
    },
    emptyListText: {
        color: '#aaa',
        textAlign: 'center',
        marginTop: 30,
        fontSize: 15,
        marginHorizontal: 20,
    },
    infoMessage: {
        color: '#ccc',
        fontSize: 13,
        marginHorizontal: 15,
        marginBottom: 20,
        textAlign: 'justify',
        lineHeight: 18,
    },
    row: {
        //flex: 1,
        justifyContent: 'space-between',
        //marginBottom: 8,
    },
    followedArtistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        //borderBottomWidth: 1,
        //borderBottomColor: '#333',
        marginHorizontal: 15,
    },
    followedArtistProfileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
        backgroundColor: '#555',
    },
    followedArtistName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
    },
    tabContentTextContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    tabContentText: {
        color: '#fff',
        fontSize: 16,
    },
    flatListContentContainer: {
        paddingBottom: 20,
    }
});