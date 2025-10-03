import React, { useState } from 'react';
import { Checkbox } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';
import usePostFaixa from '@/hooks/usePostEP'; // Importa o Hook
import * as ImagePicker from 'expo-image-picker'; //importando o modulo responsavel por lidar com o carregamento de imagens
import { Stack } from 'expo-router';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
} from 'react-native';
import { useRouter } from 'expo-router';

/**
 * Componente responsável por renderizar a interface de
 * postagem de EP, usando o Hook usePostEP.
 */
export default function PostEPScreen() {
    const router = useRouter()
    // Importa os estados e manipuladores do Hook
    const {
        hasParticipants,
        noParticipants,
        dropdownOpen,
        numParticipants,
        participantNames,
        setDropdownOpen,
        handleHasParticipants,
        handleNoParticipants,
        handleNumParticipantsChange,
        handleParticipantNameChange,
    } = usePostFaixa();

    // useState para controlar o estado do DropDownPicker
    const [numFaixasOpen, setNumFaixasOpen] = useState(false);
    const [numFaixas, setNumFaixas] = useState<number | null>(null);  // Correção: Tipo number | null para permitir seleção única
    const [numFaixasItems, setNumFaixasItems] = useState<{ label: string; value: number }[]>(
        Array.from({ length: 6 - 3 + 1 }, (_, i) => ({
            label: `${i + 3} faixas`,  // Correção: label tipado como string
            value: i + 3,              // Correção: value tipado como number
        }))
    );
    const [postedFaixa, setPostedFaixa] = useState<number>(0) //estado para controlar o numero de faixas que foram postadas

    //HOOKS PARA O QUADRO DA CAPA DO ALBUM
    const [capaEP, setCapaEP] = useState<any>(null);  // Pode usar ImagePicker para escolher imagem
    const pickImageEP = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled) setCapaEP(result.assets[0]);
    };


    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Postar EP',
                    headerStyle: { backgroundColor: '#191919' },
                    headerTintColor: '#fff',
                    headerShown: false, // Mostra o cabeçalho superior
                    //headerTitleStyle: { fontWeight: 'bold' },
                }}
            />
            <View style={{ flex: 1, backgroundColor: '#191919' }}>
                <View style={styles.containerBack}>

                    {/* Botão de pesquisa*/}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.buttonBack}>
                        {/* Ícone de notificações*/}
                        <Ionicons
                            name='arrow-back'
                            size={24}
                            color='#fff'
                        />
                    </TouchableOpacity>

                    <Text style={styles.titleBack}>Postar EP</Text>
                </View>
             
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
                        // backgroundColor: '#fff'
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
                            onPress={pickImageEP}      // Função para abrir o seletor de imagem
                        >
                            {capaEP ? (
                                <Image
                                    source={{ uri: capaEP.uri }}
                                    style={{ width: '100%', height: '100%' }}
                                />
                            ) : (
                                <Ionicons name="camera" size={40} color="#fff" />
                            )}
                        </TouchableOpacity>
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>Extended Play de Saag Weelli Boy</Text>
                        <Text style={{ color: '#fff', fontSize: 15, marginBottom: 10 }}>Rap • Pegasus • 2025 </Text>
                    </View>

                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Informações do EP</Text>

                    <TextInput
                        style={styles.inputTextBox}
                        placeholder="Nome do Artista"
                        placeholderTextColor="#FFFF"

                    //value={nomeArtistaAlbum}
                    //onChangeText={setNomeArtistaAlbum}
                    />

                    <TextInput
                        style={styles.inputTextBox}
                        placeholder="Título do EP"
                        placeholderTextColor="#FFFF"

                    //value={tituloAlbum}
                    //onChangeText={setTitutloAlbum}
                    //editable={!!nomeArtistaAlbum}
                    />

                    <TextInput
                        style={styles.inputTextBox}
                        placeholder="Gênero principal"
                        placeholderTextColor="#FFFF"

                    //value={generoAlbum}
                    //onChangeText={setGeneroAlbum}
                    //editable={!!tituloAlbum}
                    />

                    {/* dropdownpiker que permite escolher o número de faixas a postar de 8 a 30* */}
                    <DropDownPicker<number>
                        //  disabled={!generoAlbum}
                        open={numFaixasOpen}
                        value={numFaixas}
                        items={numFaixasItems}
                        setOpen={setNumFaixasOpen}
                        setValue={setNumFaixas}  // Correção principal: adicionar setValue para gerenciar a seleção
                        setItems={setNumFaixasItems}

                        placeholder="Seleciona o número de faixas"
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
                                style={{ transform: [{ rotate: dropdownOpen ? '180deg' : '0deg' }] }}
                            />
                        )}
                        ArrowUpIconComponent={() => (
                            <Ionicons
                                name='chevron-up'
                                size={20}
                                color='#fff'
                                style={{ transform: [{ rotate: dropdownOpen ? '0deg' : '180deg' }] }}
                            />
                        )}

                    />

                    <TextInput
                        style={styles.inputTextBox}
                        placeholder="Ano de lançamento"
                        placeholderTextColor="#FFFF"

                    // value={anoLancamentoAlbum}
                    // onChangeText={setAnoLancamentoAlbum}
                    // editable={!!numFaixas}
                    />

                    <TextInput
                        style={styles.inputTextBox}
                        placeholder="Número do EP"
                        placeholderTextColor="#FFFF"

                    // value={numeroAlbum}
                    // onChangeText={setNumeroAlbum}
                    // editable={!!anoLancamentoAlbum}
                    />

                    {/*Aqui vem o botao salvar, Equanto o utilizador nao salvar os componentes abaixo comtinuarao desable podes fazer isso companheiro*/}
                    <TouchableOpacity style={styles.uploadArea}>
                        <Text style={styles.uploadText}>Salvar dados do EP</Text>
                    </TouchableOpacity>

                    <View
                        style={{
                            flexDirection: 'row',      // Coloca o Text e o ícone na mesma linha
                            // justifyContent: 'space-between', // Um vai para esquerda e outro para a direita
                            alignItems: 'center',      // Alinha verticalmente no centro
                            // paddingHorizontal: 1,
                            //marginBottom: 8,
                            flex: 1
                        }}
                    >
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', }}>Faixa Single</Text>
                        {/*QUANDO O UTILIZADOR ESCOLHER O NUMERO DE FAIXAS A POSTAR ESSE TESTO SERA EXIBIDO* */}
                        {numFaixas !== null && (
                            <Text style={{ color: '#fff', fontSize: 16, marginLeft: 5 }}>(Faixas a postar: {numFaixas}...postadas: {postedFaixa})</Text>
                        )}
                    </View>

                    <Text style={{ color: '#fff', fontSize: 16, marginTop: 10, }}>Há participações nesta faixa?</Text>

                    {/* Checkbox Sim / Não */}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Checkbox.Item
                            label="Sim"
                            status={hasParticipants ? 'checked' : 'unchecked'}
                            onPress={handleHasParticipants}
                            labelStyle={{ color: '#fff', fontSize: 14 }}
                            style={{ paddingLeft: 0, marginLeft: -10, marginBottom: 0 }}
                            position='leading'
                        />
                        <Checkbox.Item
                            label="Não"
                            status={noParticipants ? 'checked' : 'unchecked'}
                            onPress={handleNoParticipants}
                            labelStyle={{ color: '#fff', fontSize: 14 }}
                            style={{ paddingLeft: 0, marginLeft: -10, marginBottom: 0 }}
                            position='leading'
                        />
                    </View>

                    {/* Campos se houver participantes */}
                    {hasParticipants && (
                        <View style={{ width: '100%' }}>
                            <DropDownPicker
                                open={dropdownOpen}
                                value={numParticipants}
                                items={Array.from({ length: 20 }, (_, i) => ({
                                    label: `${i + 1} participante${i + 1 > 1 ? 's' : ''}`,
                                    value: i + 1,
                                }))}
                                setOpen={setDropdownOpen}
                                setValue={(callback) => {
                                    const value = callback(numParticipants);
                                    handleNumParticipantsChange(value as number);
                                }}
                                placeholder="Quantos participantes?"
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
                                        style={{ transform: [{ rotate: dropdownOpen ? '180deg' : '0deg' }] }}
                                    />
                                )}
                                ArrowUpIconComponent={() => (
                                    <Ionicons
                                        name='chevron-up'
                                        size={20}
                                        color='#fff'
                                        style={{ transform: [{ rotate: dropdownOpen ? '0deg' : '180deg' }] }}
                                    />
                                )}
                            />

                            {/* Campos de nomes dos participantes */}
                            {numParticipants !== null && participantNames.map((name, index) => (
                                <TextInput
                                    key={index}
                                    style={styles.inputTextBox}
                                    value={name}
                                    onChangeText={(text) => handleParticipantNameChange(index, text)}
                                    placeholder={`Nome do participante ${index + 1}`}
                                    placeholderTextColor="#FFFF"
                                />
                            ))}
                        </View>
                    )}

                    {/* Campos comuns*/}
                    <TextInput style={styles.inputTextBox} placeholder="Título da músca" placeholderTextColor="#FFFF" />
                    <TextInput style={styles.inputTextBox} placeholder="Gênero musical" placeholderTextColor="#FFFF" />
                    <TextInput style={styles.inputTextBox} placeholder="Produtor" placeholderTextColor="#FFFF" />
                    <TextInput style={styles.inputTextBox} placeholder="Ano de lançamento" placeholderTextColor="#FFFF" />
                    <TextInput style={styles.inputTextBox} placeholder="Número da faixa" placeholderTextColor="#FFFF" />



                    {/* Botão para upload do auddio */}
                    <TouchableOpacity style={styles.uploadArea}>
                        <Text style={styles.uploadText}>Carregar audio</Text>
                        <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </>

    );
};

export const styles = StyleSheet.create({
    scroll: {
        flex: 1,
        backgroundColor: '#191919',
    },
    container: {
        flexGrow: 1,
        //paddingVertical: 40,
        paddingHorizontal: 20,
    },
    frame: {
        width: 200,
        height: 200,
        borderRadius: 10,
        backgroundColor: '#2a2a2a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagem: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
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
        marginBottom: 12,
    },
    uploadText: {
        color: '#fff',
        fontSize: 16,
        marginRight: 10,
    },

    containerBack: {
        backgroundColor: '#191919',      // Cor de fundo escura
        paddingVertical: 20,             // Espaçamento vertical (topo e baixo)
        // paddingHorizontal: 10,           // Espaçamento lateral (esquerda e direita)
        //borderBottomWidth: 1,            // Borda inferior com 1 pixel
        //borderColor: '#191919',             // Cor da borda inferior (cinza escuro)
        flexDirection: 'row',            // Organiza os itens em linha (horizontal)
        //alignItems: 'center',            // Alinha verticalmente ao centro
        marginBottom: 20,
    },
    buttonBack: {
        //backgroundColor: '#333',
        marginLeft: 15,
    },
    titleBack: {
        color: '#fff',
        fontSize: 18,
        marginLeft: 14,
        flex: 1,
        //textAlign: 'center',
    },
});


