import React, { useState } from 'react';
import { View, Text, TextInput, } from 'react-native';
import { Checkbox } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';
import usePostFaixa from '@/hooks/usePostFaixa'; // Importa o Hook
import * as ImagePicker from 'expo-image-picker'; //importando o modulo responsavel por lidar com o carregamento de imagens
import { Stack } from 'expo-router';
import {
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';

import { useTranslation } from '@/src/translations/useTranslation'

/**
 * Componente responsável por renderizar a interface de
 * postagem de Faixa Single, usando o Hook usePostFaixa.
 */
export default function PostFaixaScreen() {

    const { t } = useTranslation()

    const router = useRouter();
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

    //HOOKS PARA O QUADRO DA CAPA DA FAIXA
    const [capaSingle, setCapaSingle] = useState<any>(null);  // Pode usar ImagePicker para escolher imagem
    const pickImageSingle = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled) setCapaSingle(result.assets[0]);
    };
    return (
        <>
            <Stack.Screen
                options={{
                    title: t('postFaixaScreen.title'),
                    headerStyle: { backgroundColor: '#191919' },
                    headerTintColor: '#fff',
                    headerShown: false, // Mostra o cabeçalho superior
                    // headerTitleStyle: { fontWeight: 'bold' },
                }}
            />
            <View style={{ flex: 1, backgroundColor: '#191919', }}>
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

                    <Text style={styles.titleBack}>{t('postFaixaScreen.title')}</Text>
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
                        //backgroundColor: '#fff'
                    }}>
                        {/*Quadro onde a capa é carregada a capa do single* ------------------------------------------------------------------------------*/}
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
                            onPress={pickImageSingle}      // Função para abrir o seletor de imagem
                        >
                            {capaSingle ? (
                                <Image
                                    source={{ uri: capaSingle.uri }}
                                    style={{ width: '100%', height: '100%' }}
                                />
                            ) : (
                                <Ionicons name="camera" size={40} color="#fff" />
                            )}
                        </TouchableOpacity>
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>{t('postFaixaScreen.uploadCover')}</Text>
                    </View>


                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>{t('postFaixaScreen.newTrack')}</Text>
                    <Text style={styles.texto}>{t('postFaixaScreen.hasParticipantsQuestion')}</Text>
                    <KeyboardAvoidingView
                        style={{ flex: 1, }}
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    >
                        {/* Checkbox Sim / Não */}
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Checkbox.Item
                                label={t('postFaixaScreen.yes')}
                                status={hasParticipants ? 'checked' : 'unchecked'}
                                onPress={handleHasParticipants}
                                labelStyle={{ color: '#fff', fontSize: 14 }}
                                style={{ paddingLeft: 0, marginLeft: -10, marginBottom: 0 }}
                                position='leading'
                            />
                            <Checkbox.Item
                                label={t('postFaixaScreen.no')}
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
                                        label: t('postFaixaScreen.participant', { count: i + 1 }),
                                        value: i + 1,
                                    }))}
                                    setOpen={setDropdownOpen}
                                    setValue={(callback) => {
                                        const value = callback(numParticipants);
                                        handleNumParticipantsChange(value as number);
                                    }}
                                    placeholder={t('postFaixaScreen.participantsDropdown')}
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
                                        placeholder={t('postFaixaScreen.participantNamePlaceholder', {index: index + 1})}
                                        placeholderTextColor="#FFFF"
                                    />
                                ))}
                            </View>
                        )}


                        {/* Campos comuns*/}
                        <TextInput style={styles.inputTextBox} placeholder = {t('postFaixaScreen.fields.artistName')} placeholderTextColor="#FFFF" />
                        <TextInput style={styles.inputTextBox} placeholder = {t('postFaixaScreen.fields.title')} placeholderTextColor="#FFFF" />
                        <TextInput style={styles.inputTextBox} placeholder = {t('postFaixaScreen.fields.genre')} placeholderTextColor="#FFFF" />
                        <TextInput style={styles.inputTextBox} placeholder = {t('postFaixaScreen.fields.producer')} placeholderTextColor="#FFFF" />
                        <TextInput style={styles.inputTextBox} placeholder = {t('postFaixaScreen.fields.year')} placeholderTextColor="#FFFF" />
                        <TextInput style={styles.inputTextBox} placeholder = {t('postFaixaScreen.fields.trackNumber')} placeholderTextColor="#FFFF" />

                        {/* Botão para upload do auddio */}
                        <TouchableOpacity style={styles.uploadArea}>
                            <Text style={styles.uploadText}>{t('postFaixaScreen.uploadAudio')}</Text>
                            <Ionicons name="cloud-upload" size={20} color="#fff" />
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </ScrollView>

            </View >

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
        backgroundColor: '#2a2a2a',   // mantém o fundo escuro elegante
        paddingHorizontal: 14,        // mais espaço interno horizontal
        paddingVertical: 10,          // aumenta a altura sem forçar o height fixo
        borderRadius: 8,              // cantos mais suaves
        borderWidth: 1,
        borderColor: '#555',          // cor neutra quando sem erro
        color: '#fff',                // texto branco para contraste
        fontSize: 16,                 // tamanho de fonte confortável
        marginBottom: 12,             // espaçamento entre campos
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
        //backgroundColor: '#191919',      // Cor de fundo escura
        paddingVertical: 20,             // Espaçamento vertical (topo e baixo)
        // paddingHorizontal: 10,           // Espaçamento lateral (esquerda e direita)
        //borderBottomWidth: 1,            // Borda inferior com 1 pixel
        borderColor: '#191919',             // Cor da borda inferior (cinza escuro)
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

