// Importa os componentes necessários do React Native
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Importa o ícone de seta para a esquerda da biblioteca Lucide (ícones modernos compatíveis com React Native)
//import { ArrowLeft } from 'lucide-react-native';

// Importa o hook useRouter do expo-router para permitir navegação programática
import { useRouter } from 'expo-router';

// Componente funcional chamado BackTabBar
export default function TopTabBarChat() {
    // Inicializa o roteador para navegar entre as telas
    const router = useRouter();

    // JSX que define a estrutura visual da TabBar de voltar
    return (
        <View style={styles.container}>

            <Text style={styles.title}>Chat</Text>

            {/* Botão de notificações de novas musicas postados de utilizadores que voce segue*/}
            <TouchableOpacity
                onPress={() => router.back()}
                style={styles.button}>
                {/* Ícone de notificações*/}
                <Ionicons
                    name='notifications-outline'
                    size={26}
                    color='#fff'
                />
            </TouchableOpacity>

            {/* Botão de pesquisa*/}
            <TouchableOpacity
                onPress={() => router.back()}
                style={styles.button}>
                {/* Ícone de notificações*/}
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
    // Estilo da barra que envolve o botão
    container: {
        backgroundColor: '#191919',      // Cor de fundo escura
        paddingVertical: 20,             // Espaçamento vertical (topo e baixo)
        paddingHorizontal: 16,           // Espaçamento lateral (esquerda e direita)
        borderBottomWidth: 1,            // Borda inferior com 1 pixel
        borderColor: '#191919',             // Cor da borda inferior (cinza escuro)
        flexDirection: 'row',            // Organiza os itens em linha (horizontal)
        //alignItems: 'center',            // Alinha verticalmente ao centro
    },
    // Estilo do botão (área clicável)
    button: {
        padding: 6,  // Espaçamento interno do botão
    },
    title: {
        color: '#fff',
        fontSize: 20,
        //marginBottom: 8,
        flex: 1,
        //textAlign: 'center',
    },
}); 