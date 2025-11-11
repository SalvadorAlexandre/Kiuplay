//app/profileScreen/usePostBeatScreen.tsx
import React, { useRef, useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
//import * as ImagePicker from 'expo-image-picker'; //importando o modulo responsavel por lidar com o carregamento de imagens
import { usePostBeat } from '@/hooks/usePostBeat';
import { Stack } from 'expo-router'
//import * as DocumentPicker from 'expo-document-picker'; //Modulo responsavel por prmitir carregamento de arquivos
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from '@/src/translations/useTranslation'
import CurrencyInput from 'react-native-currency-input'; // ✅ Importamos o novo componente

export default function PostBeatScreen() {

    const { t } = useTranslation()

    const router = useRouter()
    const {
        nomeProdutor, setNomeProdutor,
        tituloBeat, setTituloBeat,
        generoBeat, setGeneroBeat,
        preco, handlePrecoChange,
        tipoLicencaOpen, setTipoLicencaOpen,
        tipoLicenca, setTipoLicenca,
        tipoLicencaItems, setTipoLicencaItems,
        capaBeat, setCapaBeat,
        beatFile, setBeatFile,
        precoPlaceholder,
        precoError, setPreco,

        // 👇 ADICIONA ESTES NOVOS RETORNOS:
        availableCurrencies,
        selectedCurrency,
        handleCurrencyChange,
        currentCurrencySymbol,

        setCurrencyPickerOpen, currencyPickerOpen,

        userRegion,
        pickBeatFile,
        pickBeatFileAndAnalyze,
        bpm,
        setBpm,
        loadingBPM,
        bpmError,
        pickImageBeat
    } = usePostBeat();

    return (
        <>
            <Stack.Screen
                options={{
                    title: t('postBeat.headerTitle'),
                    headerStyle: { backgroundColor: '#191919' },
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

                    <Text style={styles.titleBack}>{t('postBeat.headerTitle')}</Text>
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
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>{t('postBeat.uploadCover')}</Text>
                    </View>

                    <TextInput
                        value={nomeProdutor}
                        onChangeText={setNomeProdutor}
                        style={styles.inputTextBox}
                        placeholder={t('postBeat.producerNamePlaceholder')}
                        placeholderTextColor="#FFFF"
                    //value={nomeArtistaAlbum}
                    //onChangeText={setNomeArtistaAlbum}
                    />
                    <TextInput
                        value={tituloBeat}
                        onChangeText={setTituloBeat}
                        style={styles.inputTextBox}
                        placeholder={t('postBeat.beatTitlePlaceholder')}
                        placeholderTextColor="#FFFF"
                    />

                    <TextInput
                        value={generoBeat}
                        onChangeText={setGeneroBeat}
                        style={styles.inputTextBox}
                        placeholder={t('postBeat.beatGenrePlaceholder')}
                        placeholderTextColor="#FFFF"
                    />

                    <TextInput
                        value={bpm ? `${bpm} BPM` : ''}
                        //onChangeText={}
                        style={styles.inputTextBox}
                        placeholder={t('postBeat.beatBpmPlaceholder')}
                        placeholderTextColor="#FFFF"
                    />

                    {/* ✅ Combo box de seleção de tipo de licensa */}
                    {/* ✅ Envolve tudo em uma View para controlar o empilhamento */}
                    <View style={{ zIndex: 2000 }}>
                        {/* ✅ Combo box de seleção de tipo de licença */}
                        <DropDownPicker
                            open={tipoLicencaOpen}
                            value={tipoLicenca}
                            items={tipoLicencaItems}
                            // ✅ Ajuste do setOpen para TypeScript + fechar o outro picker
                            setOpen={(stateOrCallback) => {
                                const newState =
                                    typeof stateOrCallback === 'function'
                                        ? stateOrCallback(tipoLicencaOpen)
                                        : stateOrCallback;

                                setTipoLicencaOpen(newState);

                                // Se este picker abrir, fecha o picker de moeda
                                if (newState) setCurrencyPickerOpen(false);
                            }}
                            setValue={setTipoLicenca}
                            setItems={setTipoLicencaItems}
                            placeholder={t('postBeat.selectLicenseTypePlaceholder')}
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
                                zIndex: 3000, // ⬆️ prioridade mais alta
                                elevation: 3000,
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
                        {tipoLicenca === 'exclusivo' && (
                            <View style={{ zIndex: 1000 }}> {/* 🔹 prioridade menor, mas ainda acima do resto */}
                                {/* ✅ Combo box de seleção de moeda */}
                                <DropDownPicker
                                    open={currencyPickerOpen}
                                    value={selectedCurrency}
                                    items={availableCurrencies.map(opt => ({
                                        label: opt.label,
                                        value: opt.value,
                                    }))}
                                    setOpen={(stateOrCallback) => {
                                        const newState =
                                            typeof stateOrCallback === 'function'
                                                ? stateOrCallback(currencyPickerOpen)
                                                : stateOrCallback;
                                        console.log('DropdownPicker estado aberto/fechado', newState)
                                        setCurrencyPickerOpen(newState);

                                        // Se este picker abrir, fecha o picker de licença
                                        if (newState) {
                                            console.log('Picker de licença foi fechado')
                                            setTipoLicencaOpen(false);
                                        }
                                    }}
                                    setValue={(callbackOrValue) => {
                                        const newValue =
                                            typeof callbackOrValue === 'function'
                                                ? callbackOrValue(selectedCurrency)
                                                : callbackOrValue;
                                        console.log('Valor selecionado', newValue)
                                        if (typeof newValue === 'string') {
                                            handleCurrencyChange(newValue);
                                        }
                                    }}
                                    placeholder={t('postBeat.selectCurrencyPlaceholder')}
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
                                        zIndex: 2000,
                                        elevation: 2000,
                                    }}
                                    TickIconComponent={() => (
                                        <Ionicons name='checkmark' size={20} color={'#fff'} />
                                    )}
                                    ArrowDownIconComponent={() => (
                                        <Ionicons name='chevron-down' size={20} color='#fff' />
                                    )}
                                    ArrowUpIconComponent={() => (
                                        <Ionicons name='chevron-up' size={20} color='#fff' />
                                    )}
                                />

                                {/* ✅ Campo de preço com símbolo dinâmico */}
                                <CurrencyInput
                                    value={preco}
                                    onChangeValue={(value) => {
                                        console.log('💰 [CurrencyInput] onChangeValue → valor digitado:', value);
                                        console.log('💲 [CurrencyInput] Símbolo atual:', currentCurrencySymbol);
                                        console.log('🪙 [CurrencyInput] Moeda selecionada:', selectedCurrency);
                                        handlePrecoChange(value)
                                    }}
                                    prefix={`${currentCurrencySymbol} `}
                                    delimiter='.'
                                    separator=','
                                    precision={2}
                                    keyboardType='numeric'
                                    placeholder={precoPlaceholder}
                                    style={[
                                        styles.inputTextBox,
                                        { borderColor: precoError ? 'red' : '#555' },
                                    ]}
                                />
                                {precoError && <Text style={styles.errorText}>{precoError}</Text>}

                                <Text style={{ color: '#aaa', fontSize: 15, marginBottom: 10 }}>
                                    {t('postBeat.exclusiveInfo')}
                                </Text>
                            </View>
                        )}

                        {tipoLicenca === 'livre' && (
                            <Text style={{ color: '#aaa', fontSize: 15, marginBottom: 10 }}>
                                {t('postBeat.freeInfo')}
                            </Text>
                        )}
                    </View>
                    {beatFile &&
                        <Text
                            numberOfLines={1}
                            ellipsizeMode='tail'
                            style={{
                                color: '#fff',
                                fontSize: 16,
                                marginBottom: 5,
                                maxWidth: '100%'
                            }}>
                            {t('postBeat.uploadingFileLabel', { fileName: beatFile.name })}
                        </Text>}

                    {/**👇 INÍCIO: NOVO BLOCO DE STATUS BPM
                    1. Status de Análise (Loading)
                    */}
                    {loadingBPM && (
                        <View style={[styles.bpmStatusContainer, styles.loadingBpmContainer]}>
                            {/* Usamos ActivityIndicator aqui */}
                            <ActivityIndicator size="small" color="#fff" />
                            <Text style={styles.bpmStatusText}>
                                {t('postBeat.bpmAnalyzing')}
                            </Text>
                        </View>
                    )}

                    {/** // 2. Erro na Análise*/}
                    {bpmError && !loadingBPM && (
                        <View style={styles.bpmStatusContainer}>
                            <Ionicons name="alert-circle" size={20} color="#ff3333" />
                            <Text style={styles.bpmErrorText}>
                                {bpmError}
                            </Text>
                        </View>
                    )}

                    {/** 3. BPM Encontrado (Sucesso) */}
                    {bpm !== null && !loadingBPM && (
                        <View style={[styles.bpmStatusContainer, styles.successBpmContainer]}>
                            <Ionicons name="checkmark-circle" size={20} color="#fff" />
                            <Text style={styles.bpmStatusText}>
                                BPM: {bpm} {t('postBeat.bpmSuccess')}
                            </Text>
                        </View>
                    )}
                    {/** 👆 FIM: BLOCO DE STATUS BPM*/}

                    {(tipoLicenca === 'exclusivo' || tipoLicenca === 'livre') && (

                        <View>
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
                                    marginBottom: 10,
                                    gap: 10,
                                }}
                                onPress={pickBeatFileAndAnalyze}
                            >
                                <Text style={{ color: '#fff', fontSize: 16 }}>{t('postBeat.selectFileButton')}</Text>
                                <Ionicons name='save' size={20} color={'#fff'} />
                            </TouchableOpacity>

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
                                    marginBottom: 10,
                                    gap: 10,
                                    // alignSelf: 'flex-start',
                                    //marginBottom: 12,
                                }}>
                                <Text style={{ color: '#fff', fontSize: 16, marginLeft: 10, }}>
                                    {t('postBeat.publishButton')}
                                </Text>
                                <Ionicons name='cloud-upload' size={20} color={'#fff'} />
                            </TouchableOpacity>
                        </View>
                    )}



                </ScrollView>
            </View>
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
        //paddingVertical: 40,   // Adiciona 40 de espaçamento interno (padding) nas partes superior e inferior do componente
        paddingHorizontal: 20, // Adiciona 20 de espaçamento interno (padding) nas partes esquerda e direita do componente
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
    errorText: {
        color: '#FF4D4D',
        fontSize: 16,
        marginTop: 4,
        marginBottom: 5,
        fontStyle: 'italic',
    },

    // Estilo para o emoji das exceções (Globo/Euro)
    flagIconEmoji: {
        fontSize: 20,
    },
    // Estilo para o contêiner do item selecionado (Header do Picker)
    selectedLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // Adicione padding ou margem conforme necessário
    },
    dropdownLabel: {
        color: '#fff',
        marginLeft: 8, // Espaço entre a bandeira e o texto
    },
    // Estilo para o contêiner de cada item na lista suspensa
    currencyItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 15,
    },
    // Estilo para o label de cada item na lista
    dropdownItemLabel: {
        color: '#E0E0E0',
        marginLeft: 10,
        fontSize: 16,
    },
    // Estilo do Contêiner que envolve o ícone e o texto do status
    bpmStatusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: '#2a2a2a', // Fundo um pouco mais claro que o principal
        borderRadius: 8,
        marginBottom: 10,
        gap: 10, // Espaçamento entre o ícone e o texto
        borderWidth: 1,
        // Cor da borda será definida pelo sucesso/erro/loading, mas podemos usar um padrão.
        borderColor: '#555',
    },
    // Estilo para o texto de status (usado para Loading e Sucesso)
    bpmStatusText: {
        color: '#fff', // Verde vibrante para sucesso e loading
        fontSize: 16,
        //fontWeight: 'bold',
        flexShrink: 1, // Permite que o texto quebre a linha se for muito longo
    },

    // Estilo para o texto de ERRO (sobrepõe a cor verde)
    bpmErrorText: {
        color: '#fff', // Vermelho forte para erros
        fontSize: 16,
        fontWeight: 'bold',
        flexShrink: 1,
    },
    // Estilo Específico para Loading
    loadingBpmContainer: {
        borderColor: '#00ff00', // Borda verde para indicar que o processo está ativo
    },
    // Estilo Específico para Sucesso
    successBpmContainer: {
        borderColor: '#00ff00', // Borda verde para indicar sucesso
    },

})
