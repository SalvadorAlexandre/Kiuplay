//app/(tabs)/beatstore.tsx
import React from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useChatTabs from '@/hooks/useChatTabs'
import TopTabBarChat from '@/components/topTabBarChatScreen'

export default function ChatScreen() {

    //const { activeTab, handleTabChange, } = useBeatStoreTabs() // Estado para controlar as tabs
    const { activeTab, handleTabChange, } = useChatTabs() // Estado para controlar as tabs

    return (

        <View style={{ backgroundColor: '#191919', }}>
            {/* Topo fixo */}
            <TopTabBarChat />
            <View style={{ marginBottom: 10, paddingHorizontal: 10 }}>
                <Text style={{ color: '#fff', fontSize: 16 }}>Tire o máximo proveito do KiuplayChat para interagires e colaborares com Produtores e Artistas da comuidade Kiuplay!</Text>
            </View>

            <ScrollView
                horizontal // Garante que esta rolagem seja vertical
                //style={{ backgroundColor: '#', }} // Aplica o estilo de fundo escuro
                //contentContainerStyle={styles.scroll} // Define padding e crescimento do conteúdo
                showsHorizontalScrollIndicator={false} //Oculta a barra de rolagem
                contentContainerStyle={styles.actionButtonsContent}
            >
                <View style={styles.actionButtonsContainer}>
                    {['todas', 'naolidas', 'usuarios', 'pedidos', 'grupos'].map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => handleTabChange(tab as 'todas' | 'naolidas' | 'usuarios' | 'pedidos' | 'grupos')}
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
                    <TouchableOpacity style={styles.tabButtonMakeGroup}>
                        <Text style={styles.tabTextMakeGroup}>+ Criar grupo</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>

            <ScrollView
                horizontal={false} // Garante que esta rolagem seja vertical
                style={styles.scroll} // Aplica o estilo de fundo escuro
                contentContainerStyle={styles.container} // Define padding e crescimento do conteúdo
                showsHorizontalScrollIndicator={false} //Oculta a barra de rolagem
            >
                {/* Conteúdo da tela */}
                <Text style={{ color: '#fff', margin: 20 }}>Conteúdo aqui...</Text>
                {/* Pode colocar seus blocos, listas, etc */}

                {activeTab === 'todas' && (
                    <View>
                        <Text style={{ color: '#fff', margin: 20 }}>todas</Text>
                        {/* Lista de feeds, por exemplo */}
                    </View>
                )}

                {activeTab === 'naolidas' && (
                    <View>
                        <Text style={{ color: '#fff', margin: 20 }}>Não lidas</Text>
                        {/* Lista de músicas curtidas */}
                    </View>
                )}

                {activeTab === 'usuarios' && (
                    <View>
                        <Text style={{ color: '#fff', margin: 20 }}>Descobrir usuários</Text>
                        {/* Lista de artistas seguidos */}
                    </View>
                )}

                {activeTab === 'pedidos' && (
                    <View>
                        <Text style={{ color: '#fff', margin: 20 }}>Pedidos</Text>
                        {/* Lista de artistas seguidos */}
                    </View>
                )}

                {activeTab === 'grupos' && (
                    <View>
                        <Text style={{ color: '#fff', margin: 20 }}>Grupos</Text>
                        {/* Lista de artistas seguidos */}
                    </View>
                )}
                <View style={{ height: 110, }}></View>
            </ScrollView>

        </View>

    );
}

const styles = StyleSheet.create({
    // Estilo do scroll vertical (pai)
    scroll: {
        flex: 1,
        backgroundColor: '#191919', // Fundo preto (modo dark)
    },
    container: {
        flexGrow: 1, // Permite expansão do conteúdo
        //paddingVertical: 40,
        // paddingHorizontal: 20,
    },
    containerTop: {
        backgroundColor: '#191919',      // Cor de fundo escura
        paddingVertical: 20,             // Espaçamento vertical (topo e baixo)
        paddingHorizontal: 16,           // Espaçamento lateral (esquerda e direita)
        borderBottomWidth: 1,            // Borda inferior com 1 pixel
        borderColor: '#191919',             // Cor da borda inferior (cinza escuro)
        flexDirection: 'row',            // Organiza os itens em linha (horizontal)
        //alignItems: 'center',            // Alinha verticalmente ao centro
    },
    // Estilo do botão (área clicável)
    buttonTop: {
        //padding: 6,  // Espaçamento interno do botão
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        //gap: 3,
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingVertical: 5,
        marginLeft: 10,

        //backgroundColor: '#1e1e1e',
        //justifyContent: 'space-around',
    },
    tabButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#333',
        marginHorizontal: 10,
    },
    tabButtonMakeGroup: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#1565C0',
        marginHorizontal: 10,
    },
    tabTextMakeGroup: {
        color: '#fff',
        fontWeight: 'bold',
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
    actionButtonsContent: {
        // paddingRight: 20,
        alignItems: 'center',
    },
});