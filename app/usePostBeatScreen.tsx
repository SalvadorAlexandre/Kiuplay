import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'expo-image-picker'; //importando o modulo responsavel por lidar com o carregamento de imagens
import { usePostBeat } from '@/hooks/usePostBeat';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router'
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native';

export default function PostBeatScreen() {
    const {
        nomeProdutor, setNomeProdutor,
        tituloBeat, setTituloBeat,
        generoBeat, setGeneroBeat,
        preco, setPreco,
        tipoLicencaOpen, setTipoLicencaOpen,
        tipoLicenca, setTipoLicenca,
        tipoLicencaItems, setTipoLicencaItems,
        capaBeat, setCapaBeat,
        beatFile, setBeatFile,
    } = usePostBeat();

    const pickBeatFile = async () => {
        let result = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
        if (result.type === 'success') setBeatFile(result);
    };

    //const [capaBeat, setCapaBeat] = useState<any>(null);  // Pode usar ImagePicker para escolher imagem
    // Pode usar ImagePicker para escolher imagem
    const pickImageBeat = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled) setCapaBeat(result.assets[0]);
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Postar beat',
                    headerStyle: { backgroundColor: '#191919' },
                    headerTintColor: '#fff',
                    headerTitleStyle: { fontWeight: 'bold' },
                }}
            />

            <ScrollView
                horizontal={false} // Garante que esta rolagem seja vertical
                style={styles.scroll} // Aplica o estilo de fundo escuro
                contentContainerStyle={styles.container} // Define padding e crescimento do conteúdo
                showsHorizontalScrollIndicator={false} //Oculta a barra de rolagem
            >

                <View style={{
                    width: "100%",
                    marginBottom: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    //backgroundColor: '#fff'
                }}>
                    {/*Quadro onde a capa é carregada a capa do album* ------------------------------------------------------------------------------*/}
                    <TouchableOpacity
                        style={{
                            width: 150,           // Largura do quadrado
                            height: 150,          // Altura do quadrado (mesmo que a largura = quadrado)
                            borderRadius: 10,     // Cantos arredondados
                            backgroundColor: '#333', // Cor do fundo do quadrado (cinza escuro)
                            justifyContent: 'center',  // Centraliza conteúdo verticalmente
                            alignItems: 'center',      // Centraliza conteúdo horizontalmente
                            marginBottom: 10,      // Espaçamento abaixo
                            overflow: 'hidden',    // Faz a imagem se encaixar dentro do quadrado
                        }}
                        onPress={pickImageBeat}      // Função para abrir o seletor de imagem
                    >
                        {capaBeat ? (
                            <Image
                                source={{ uri: capaBeat.uri }}
                                style={{ width: '100%', height: '100%' }}
                            />
                        ) : (
                            <Ionicons name="camera" size={40} color="#fff" />
                        )}
                    </TouchableOpacity>
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>Beat de Saag Weelli Boy</Text>
                    <Text style={{ color: '#fff', fontSize: 15, marginBottom: 10 }}>Rap • Pegasus • 2025 </Text>
                </View>

                <TextInput
                    value={nomeProdutor}
                    onChangeText={setNomeProdutor}
                    style={styles.inputTextBox}
                    placeholder="Nome do produtor"
                    placeholderTextColor="#FFFF"
                //value={nomeArtistaAlbum}
                //onChangeText={setNomeArtistaAlbum}
                />
                <TextInput
                    value={nomeProdutor}
                    onChangeText={setNomeProdutor}
                    style={styles.inputTextBox}
                    placeholder="Título do beat"
                    placeholderTextColor="#FFFF"
                />

                <TextInput
                    value={nomeProdutor}
                    onChangeText={setNomeProdutor}
                    style={styles.inputTextBox}
                    placeholder="Gênero do beat"
                    placeholderTextColor="#FFFF"
                />
                <DropDownPicker
                    open={tipoLicencaOpen}
                    value={tipoLicenca}
                    items={tipoLicencaItems}
                    setOpen={setTipoLicencaOpen}
                    setValue={setTipoLicenca}
                    setItems={setTipoLicencaItems}
                    placeholder="Selecione o tipo de uso"

                    style={{
                        backgroundColor: '#2a2a2a',
                        marginBottom: 10,
                        borderWidth: 1,
                        borderColor: '#555',
                    }}
                    textStyle={{ color: '#fff' }}
                    placeholderStyle={{ color: '#ccc' }}
                    dropDownContainerStyle={{
                        backgroundColor: '#2a2a2a',
                        borderColor: '#fff',
                        borderWidth: 1,
                    }}
                    TickIconComponent={() => <Ionicons name='checkmark' size={20} color={'#fff'} />}
                    ArrowDownIconComponent={() => (
                        <Ionicons
                            name='chevron-down'
                            size={20}
                            color='#fff'
                            style={{ transform: [{ rotate: tipoLicencaOpen ? '180deg' : '0deg' }] }}
                        />
                    )}
                    ArrowUpIconComponent={() => (
                        <Ionicons
                            name='chevron-up'
                            size={20}
                            color='#fff'
                            style={{ transform: [{ rotate: tipoLicencaOpen ? '0deg' : '180deg' }] }}
                        />
                    )}
                />
                <Text style={{ color: '#fff', fontSize: 16, marginBottom: 5}}>Upload do beat</Text>
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#333',
                        paddingVertical: 10,
                        paddingHorizontal: 16,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: '#555',
                        marginBottom: 10
                    }}
                    onPress={pickBeatFile}
                >
                    <Text style={{ color: '#fff', fontSize: 16}}>Selecionar arquivo</Text>
                </TouchableOpacity>
                {beatFile && <Text>Selecionado: {beatFile.name}</Text>}

                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#333',
                        paddingVertical: 10,
                        paddingHorizontal: 16,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: '#555',
                        marginBottom: 10
                        // alignSelf: 'flex-start',
                        //marginBottom: 12,
                    }}>
                    <Text style={{ color: '#fff', fontSize: 16, marginLeft: 10, }}>Publicar beat</Text>
                </TouchableOpacity>

            </ScrollView>
        </>

    );
};

const styles = StyleSheet.create({
    scroll: {
        flex: 1, // Faz com que o componente ocupe todo o espaço disponível dentro do contêiner flex
        backgroundColor: '#191919', // Fundo preto (modo dark)
    },
    // Estilo do container do conteúdo vertical
    container: {
        flexGrow: 1, // Permite expansão do conteúdo
        paddingVertical: 40,   // Adiciona 40 de espaçamento interno (padding) nas partes superior e inferior do componente
        paddingHorizontal: 20, // Adiciona 20 de espaçamento interno (padding) nas partes esquerda e direita do componente
    },
    texto: {
        color: '#fff',
        fontSize: 16,
    },
    inputTextBox: {
        backgroundColor: '#2a2a2a',
        paddingHorizontal: 11,
        height: 35,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#555',
        color: '#fff',
        marginBottom: 10,
        width: '100%',
    },
    uploadArea: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#333',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#555',
        marginBottom: 10,
        width: "100%",
    },
    uploadText: {
        color: '#fff',
        fontSize: 16,
        marginRight: 10,
    },
})
