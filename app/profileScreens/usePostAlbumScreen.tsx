//app/profileScreens/usePostAlbumScreen
import React, { useState } from 'react';
import { Checkbox } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';
import usePostFaixa from '@/hooks/usePostAlbum'; // Importa o Hook usePostAlbum
import * as ImagePicker from 'expo-image-picker'; //importando o modulo responsavel por lidar com o carregamento de imagens
import { Stack } from 'expo-router';
import {
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Text,
    View,
    TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';

import { useTranslation } from '@/src/translations/useTranslation'
/**
 * Componente responsável por renderizar a interface de
 * postagem de Album, usando o Hook usePostAlbum.
*/
export default function PostAlbumScreen() {

    const { t } = useTranslation()

    const router = useRouter()
    // Importa os estados e manipuladores do Hook
    const {
        hasParticipants,
        noParticipants,
        numParticipants,
        participantNames,
        dropdownParticipantsOpen, setDropdownParticipantsOpen,
        handleHasParticipants,
        handleNoParticipants,
        handleNumParticipantsChange,
        handleParticipantNameChange,
        numFaixasOpen, setNumFaixasOpen,
    } = usePostFaixa();

    // useState para controlar o estado do DropDownPicker
    //const [numFaixasOpen, setNumFaixasOpen] = useState(false);
    const [numFaixas, setNumFaixas] = useState<number | null>(null);  // Correção: Tipo number | null para permitir seleção única
    const [numFaixasItems, setNumFaixasItems] = useState<{ label: string; value: number }[]>(
        Array.from({ length: 30 - 8 + 1 }, (_, i) => ({
            label: t('postAlbum.trackCountOption', { count: i + 8 }),  // Correção: label tipado como string
            value: i + 8,              // Correção: value tipado como number
        }))
    );

    //HOOKS PARA O QUADRO DA CAPA DO ALBUM
    const [capaAlbum, setCapaAlbum] = useState<any>(null);  // Pode usar ImagePicker para escolher imagem
    const pickImageAlbum = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled) setCapaAlbum(result.assets[0]);
    };


    const [postedFaixa, setPostedFaixa] = useState<number>(0) //estado para controlar o numero de faixas que foram postadas
    //ESTADOS PARA AS INFORMAÇÕES DO ALBUM RESPONSAVEIS POR CONTROLAR A VALIDAÇÃO DOS DADOS A SEREM INSERIDOS
    const [nomeArtistaAlbum, setNomeArtistaAlbum] = useState('') //ESTADO PARA O NOME DO ARTISTA DO ALBUM
    const [tituloAlbum, setTitutloAlbum] = useState('') //estado para o titulo do album
    const [generoAlbum, setGeneroAlbum] = useState('') //estado para o genero principal do album
    const [anoLancamentoAlbum, setAnoLancamentoAlbum] = useState('') //estado para o ano de lan;amento do album
    const [numeroAlbum, setNumeroAlbum] = useState('') //estado para o genero principal do album

    const handleSaveAlbum = () => {
        /*Metodo de salvamento de album*/
        //setAlbumSaved(true)
    }

    return (

        <>
            <Stack.Screen
                options={{
                    title: 'Postar album',
                    headerStyle: { backgroundColor: '#191919', },
                    headerTintColor: '#fff',
                    //headerTitleStyle: { fontWeight: 'bold' },
                    headerShown: false,
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

                    <Text style={styles.titleBack}>{t('postAlbum.headerTitle')}</Text>

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
                            onPress={pickImageAlbum}      // Função para abrir o seletor de imagem
                        >
                            {capaAlbum ? (
                                <Image
                                    source={{ uri: capaAlbum.uri }}
                                    style={{ width: '100%', height: '100%' }}
                                />
                            ) : (
                                <Ionicons name="camera" size={40} color="#fff" />
                            )}
                        </TouchableOpacity>
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>{t('postAlbum.uploadCover')}</Text>
                    </View>
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>{t('postAlbum.sectionInfoTitle')}</Text>

                    <TextInput
                        style={styles.inputTextBox}
                        placeholder={t('postAlbum.artistNamePlaceholder')}
                        placeholderTextColor="#FFFF"

                    //value={nomeArtistaAlbum}
                    //onChangeText={setNomeArtistaAlbum}
                    />

                    <TextInput
                        style={styles.inputTextBox}
                        placeholder={t('postAlbum.albumTitlePlaceholder')}
                        placeholderTextColor="#FFFF"

                    //value={tituloAlbum}
                    //onChangeText={setTitutloAlbum}
                    //editable={!!nomeArtistaAlbum}
                    />

                    <TextInput
                        style={styles.inputTextBox}
                        placeholder={t('postAlbum.mainGenrePlaceholder')}
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

                        placeholder={t('postAlbum.numTracksPlaceholder')}
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
                                style={{ transform: [{ rotate: numFaixasOpen ? '180deg' : '0deg' }] }}
                            />
                        )}
                        ArrowUpIconComponent={() => (
                            <Ionicons
                                name='chevron-up'
                                size={20}
                                color='#fff'
                                style={{ transform: [{ rotate: numFaixasOpen ? '0deg' : '180deg' }] }}
                            />
                        )}

                    />

                    <TextInput
                        style={styles.inputTextBox}
                        placeholder={t('postAlbum.releaseYearPlaceholder')}
                        placeholderTextColor="#FFFF"

                    // value={anoLancamentoAlbum}
                    // onChangeText={setAnoLancamentoAlbum}
                    // editable={!!numFaixas}
                    />

                    <TextInput
                        style={styles.inputTextBox}
                        placeholder={t('postAlbum.albumNumberPlaceholder')}
                        placeholderTextColor="#FFFF"

                    // value={numeroAlbum}
                    // onChangeText={setNumeroAlbum}
                    // editable={!!anoLancamentoAlbum}
                    />

                    {/*Aqui vem o botao salvar, Equanto o utilizador nao salvar os componentes abaixo comtinuarao desable podes fazer isso companheiro*/}
                    <TouchableOpacity style={styles.uploadArea}>
                        <Text style={styles.uploadText}>{t('postAlbum.saveAlbumButton')}</Text>
                        <Ionicons name='save' size={20} color={'#fff'} />
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
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', marginTop: 10 }}>{t('postAlbum.singleTrackTitle')}</Text>
                        {/*QUANDO O UTILIZADOR ESCOLHER O NUMERO DE FAIXAS A POSTAR ESSE TESTO SERA EXIBIDO* */}
                        {numFaixas !== null && (
                            <Text style={{ color: '#fff', fontSize: 16, marginLeft: 5, marginTop: 10 }}>{t('postEP.trackCountLabel', { total: numFaixas, posted: postedFaixa })}</Text>
                        )}
                    </View>

                    <Text style={{ color: '#fff', fontSize: 16, marginTop: 10, }}>{t('postAlbum.hasParticipantsQuestion')}</Text>

                    {/* Checkbox Sim / Não */}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Checkbox.Item
                            label={t('postAlbum.yes')}
                            status={hasParticipants ? 'checked' : 'unchecked'}
                            onPress={handleHasParticipants}
                            labelStyle={{ color: '#fff', fontSize: 14 }}
                            style={{ paddingLeft: 0, marginLeft: -10, marginBottom: 0 }}
                            position='leading'
                        />
                        <Checkbox.Item
                            label={t('postAlbum.no')}
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
                                open={dropdownParticipantsOpen}
                                value={numParticipants}
                                items={Array.from({ length: 20 }, (_, i) => ({
                                    label: t('postAlbum.participantName', { count: i + 1 }),
                                    value: i + 1,
                                }))}
                                setOpen={setDropdownParticipantsOpen}
                                setValue={(callback) => {
                                    const value = callback(numParticipants);
                                    handleNumParticipantsChange(value as number);
                                }}
                                placeholder={t('postAlbum.numParticipantsPlaceholder')}
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
                                        style={{ transform: [{ rotate: dropdownParticipantsOpen ? '180deg' : '0deg' }] }}
                                    />
                                )}
                                ArrowUpIconComponent={() => (
                                    <Ionicons
                                        name='chevron-up'
                                        size={20}
                                        color='#fff'
                                        style={{ transform: [{ rotate: dropdownParticipantsOpen ? '0deg' : '180deg' }] }}
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
                                    placeholder={t('postAlbum.participantNamePlaceholder', { index: index + 1 })}
                                    placeholderTextColor="#FFFF"
                                />
                            ))}
                        </View>
                    )}

                    {/* Campos comuns*/}
                    <TextInput style={styles.inputTextBox} placeholder={t('postAlbum.artistNameSong')} placeholderTextColor="#FFFF" />
                    <TextInput style={styles.inputTextBox} placeholder={t('postAlbum.songTitlePlaceholder')} placeholderTextColor="#FFFF" />
                    <TextInput style={styles.inputTextBox} placeholder={t('postAlbum.songGenrePlaceholder')} placeholderTextColor="#FFFF" />
                    <TextInput style={styles.inputTextBox} placeholder={t('postAlbum.producerPlaceholder')} placeholderTextColor="#FFFF" />
                    <TextInput style={styles.inputTextBox} placeholder={t('postAlbum.trackYearPlaceholder')} placeholderTextColor="#FFFF" />
                    <TextInput style={styles.inputTextBox} placeholder={t('postAlbum.trackNumberPlaceholder')} placeholderTextColor="#FFFF" />

                    {/*Quadro onde a capa é carregada a capa da faixa* ------------------------------------------------------------------------------*/}

                    {/* Botão para upload do auddio */}
                    <TouchableOpacity style={styles.uploadArea}>
                        <Text style={styles.uploadText}>{t('postAlbum.uploadAudioButton')}</Text>
                        <Ionicons name="cloud-upload" size={20} color="#fff" />
                    </TouchableOpacity>

                </ScrollView>
            </View>

        </>

    );
};

export const styles = StyleSheet.create({

    scroll: {
        flex: 1, // Faz com que o componente ocupe todo o espaço disponível dentro do contêiner flex
        backgroundColor: '#191919', // Fundo preto (modo dark)
    },
    // Estilo do container do conteúdo vertical
    container: {
        flexGrow: 1, // Permite expansão do conteúdo
        // paddingVertical: 40,   // Adiciona 40 de espaçamento interno (padding) nas partes superior e inferior do componente
        paddingHorizontal: 20, // Adiciona 20 de espaçamento interno (padding) nas partes esquerda e direita do componente
    },
    texto: {
        color: '#fff',
        fontSize: 16,
    },
    inputTextBox: {
        width: '100%',
        backgroundColor: '#1c1c1c',
        color: '#fff',
        height: 55,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#333',
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



