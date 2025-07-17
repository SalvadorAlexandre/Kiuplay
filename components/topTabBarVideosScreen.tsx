// components/topTabBarVideosScreen.tsx
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Definindo a interface para as props do componente TopTabBarVideos
interface TopTabBarVideosProps {
    // Adicionando a prop 'activeTab' que será recebida do componente pai (VideoClipesScreen)
    activeTab: 'feeds' | 'curtidas' | 'seguindo';
}

// O componente agora aceita 'activeTab' como uma prop
export default function TopTabBarVideos({ activeTab }: TopTabBarVideosProps) {
    const router = useRouter();

    // Função para navegar para a tela de notificações
    const handleNotificationsPress = () => {
        // Rota para a tela de notificações (confirmando o caminho que você usa)
        router.push('/notificationsScreens/videoNotifications/notifications');
    };

    // Função para navegar para a tela de pesquisa
    const handleSearchPress = () => {
        // Passando a aba ativa como um parâmetro para a tela de pesquisa
        router.push({
            pathname: '/searchScreens/videoSearch/search', // Rota para a tela de pesquisa (confirmando o caminho que você usa)
            params: { activeTab: activeTab }, // <--- AQUI A MUDANÇA: Passando a aba ativa
        });
    };

    return (
        <View style={styles.container}>

            <Text style={styles.title}>Vídeos</Text> {/* Título para a barra */}

            {/* Botão de notificações de novos videos postados */}
            <TouchableOpacity
                onPress={handleNotificationsPress}
                style={styles.button}
                accessibilityLabel="Ver novas notificações de vídeos"
            >
                <Ionicons
                    name='notifications-outline'
                    size={26}
                    color='#fff'
                />
            </TouchableOpacity>

            {/* Botão de pesquisa */}
            <TouchableOpacity
                onPress={handleSearchPress}
                style={styles.button}
                accessibilityLabel="Abrir tela de pesquisa"
            >
                <Ionicons
                    name='search-outline'
                    size={26}
                    color='#fff'
                />
            </TouchableOpacity>

        </View>
    );
}

// Define os estilos usados no componente
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#191919',
        paddingVertical: 20,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderColor: '#191919',
        flexDirection: 'row',
        alignItems: 'center', // Alinha verticalmente ao centro
    },
    button: {
        padding: 6,
        marginLeft: 10, // Espaçamento entre os botões
    },
    title: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold', // Título com mais destaque
        flex: 1, // Ocupa o espaço restante e empurra os botões para a direita
    },
});