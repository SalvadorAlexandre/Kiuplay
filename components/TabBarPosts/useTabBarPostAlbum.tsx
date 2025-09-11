// Importa os componentes necessários do React Native
import {
    View,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';


// Importa o ícone de seta para a esquerda da biblioteca Lucide (ícones modernos compatíveis com React Native)
//import { ArrowLeft } from 'lucide-react-native';

// Importa o hook useRouter do expo-router para permitir navegação programática
import { useRouter } from 'expo-router';

// Componente funcional chamado BackTabBar
export default function TopTabBarAlbum() {
    // Inicializa o roteador para navegar entre as telas
    const router = useRouter();

    // JSX que define a estrutura visual da TabBar de voltar
    return (
        <View style={styles.container}>

            {/* Botão de pesquisa*/}
            <TouchableOpacity
                onPress={() => router.back()}
                style={styles.button}>
                {/* Ícone de notificações*/}
                <Ionicons
                    name='arrow-back'
                    size={24}
                    color='#fff'
                />
            </TouchableOpacity>

            <Text style={styles.title}>Postar Album</Text>


            <TouchableOpacity
                style={styles.buttonSave}>
                <Ionicons name="save" size={20} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 16, marginLeft: 10, }}>Salvar</Text>
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
        // paddingHorizontal: 10,           // Espaçamento lateral (esquerda e direita)
        borderBottomWidth: 1,            // Borda inferior com 1 pixel
        borderColor: '#191919',             // Cor da borda inferior (cinza escuro)
        flexDirection: 'row',            // Organiza os itens em linha (horizontal)
        //alignItems: 'center',            // Alinha verticalmente ao centro
        marginBottom: 20,
    },
    button: {
        //backgroundColor: '#333',
        marginLeft: 15,
    },
    // Estilo do botão (área clicável)
    buttonSave: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1565C0',
        paddingVertical: 5,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#555',
        alignSelf: 'flex-start',
        marginRight: 15,
        //marginBottom: 12,
        //padding: 6,  // Espaçamento interno do botão
    },
    title: {
        color: '#fff',
        fontSize: 18,
        marginLeft: 14,
        flex: 1,
        //textAlign: 'center',
    },
}); 