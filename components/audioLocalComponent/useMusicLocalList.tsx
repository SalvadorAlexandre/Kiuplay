import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView
} from 'react-native';
import useLocalMusic from '@/hooks/audioLocalHooks/useLocalMusicManager' // caminho correto onde você salvou o hook

export default function LocalMusicScreen() {
    const { selectedMusics, handleSelectMusics } = useLocalMusic();

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={handleSelectMusics}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Selecionar músicas</Text>
            </TouchableOpacity>

            <ScrollView>
                {selectedMusics.length === 0 ? (
                    <Text style={styles.empty}>Nenhuma música selecionada</Text>
                ) : (
                    selectedMusics.map((music, index) => (
                        <View key={index} style={styles.musicItemContainer}>
                            <View style={styles.musicInfo}>
                                < TouchableOpacity>
                                    <Text numberOfLines={1} style={styles.musicName}>{music.name}</Text>
                                </TouchableOpacity>
                                <Text style={styles.musicSize}>
                                    {music.size ? `${(music.size / (1024 * 1024)).toFixed(2)} MB` : 'Tamanho desconhecido'}
                                </Text>

                            </View>
                            {/* <View style={styles.divider} />*/}
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        //padding: 20,
        flex: 1,
        margin: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#1565C0',
        padding: 10,
        borderRadius: 10,
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
    empty: {
        color: '#ccc',
        textAlign: 'center',
    },
    musicItem: {
        color: '#fff',
        marginBottom: 5,
    },



    musicItemContainer: {
        borderRadius: 10,
        backgroundColor: '#1e1e1e',
        padding: 10,
        marginBottom: 10,
        paddingHorizontal: 20,
        // paddingVertical: 12,

    },
    musicInfo: {
        //flexDirection: 'row',
        justifyContent: 'space-between',
        //alignItems: 'center',
    },
    musicName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
        marginRight: 10,

    },
    musicSize: {
        color: '#888',
        fontSize: 14,
        marginTop: 6,
    },
    divider: {
        height: 1,
        backgroundColor: '#333',
        marginTop: 10,
        marginBottom: 10,
    },
});




