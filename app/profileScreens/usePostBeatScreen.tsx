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
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from '@/src/translations/useTranslation'
import CurrencyInput from 'react-native-currency-input'; // ✅ Importamos o novo componente
import { UploadModal } from '@/components/uploadModal';

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
        //availableCurrencies,
        selectedCurrency,
        handleCurrencyChange,
        currentCurrencySymbol,
        exclusiveCurrencies,

        setCurrencyPickerOpen,
        currencyPickerOpen,

        pickBeatFile,
        pickBeatFileAndAnalyze,
        bpm,
        setBpm,
        loadingBPM,
        bpmError,
        pickImageBeat,

        handleSubmitBeatWithModal,
        uploadLoading,
        uploadError,

        setUploadModalVisible,
        resetForm,

        uploadModalVisible,
        uploadProgress,
        uploadStatus,
        uploadMessage,
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
                    <KeyboardAvoidingView
                        style={{ flex: 1, }}
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    >

                        <View style={{
                            width: "100%",
                            marginBottom: 10,
                            alignItems: 'center',
                            justifyContent: 'center',
                            //backgroundColor: '#fff'
                        }}>
                            {/*Quadro onde a capa é carregada a capa do album* ---------------------------*/}
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
                                        items={exclusiveCurrencies}
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

                                            if (newValue === 'USD' || newValue === 'EUR') {
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
                                            console.log('💰 [CurrencyInput] onChangeValue valor digitado:', value);
                                            console.log('💲 [CurrencyInput] Símbolo atual:', currentCurrencySymbol);
                                            console.log('🪙 [CurrencyInput] Moeda selecionada:', selectedCurrency);
                                            handlePrecoChange(value)
                                        }}
                                        prefix={`${currentCurrencySymbol}`}
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
                                </View>
                            )}

                            {/* --- SEÇÃO EXCLUSIVA --- */}
                            {tipoLicenca === 'exclusivo' && (
                                <View style={{ zIndex: 1000 }}>
                                    {/* DropDownPicker e CurrencyInput aqui... */}
                                    <View style={styles.infoCardExclusive}>
                                        <View style={styles.infoTitleRow}>
                                            <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
                                            <Text style={styles.infoTitleGreen}>{t('postBeat.exclusiveInfo.title')}</Text>
                                        </View>
                                        <Text style={styles.infoBody}>
                                            {t('postBeat.exclusiveInfo.body')}
                                        </Text>
                                    </View>
                                </View>
                            )}

                            {/* --- SEÇÃO LIVRE --- */}
                            {tipoLicenca === 'livre' && (
                                <View style={styles.infoCardFree}>
                                    <View style={styles.infoTitleRow}>
                                        <Ionicons name="alert-circle" size={20} color="#FF9800" />
                                        <Text style={styles.infoTitleOrange}>{t('postBeat.freeInfo.title')}</Text>
                                    </View>
                                    <Text style={styles.infoBody}>
                                        {t('postBeat.freeInfo.body')}
                                    </Text>
                                </View>
                            )}
                        </View>


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
                                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                                <Text style={styles.bpmStatusText}>
                                    BPM: {bpm} {t('postBeat.bpmSuccess')}
                                </Text>
                            </View>
                        )}
                        {/** 👆 FIM: BLOCO DE STATUS BPM*/}

                        {(tipoLicenca === 'exclusivo' || tipoLicenca === 'livre') && (
                            <View>

                                {/* 1. BOTÃO DE SELECIONAR (PICKER) */}
                                <TouchableOpacity
                                    // 🔹 Desativamos o botão se loadingBPM for true
                                    disabled={loadingBPM}
                                    style={[
                                        styles.selectFileButton,
                                        beatFile && styles.uploadAreaSelected, // Muda a cor se houver ficheiro
                                        // 🔹 Estilo opcional para parecer "apagado" quando desativado
                                        loadingBPM && { opacity: 0.6 }
                                    ]}
                                    onPress={pickBeatFileAndAnalyze}
                                >
                                    {beatFile && (
                                        <Text style={styles.fileSizeText}>
                                            {/* Usamos o operador ?. para evitar erro e verificamos se size existe */}
                                            {beatFile.size
                                                ? (beatFile.size / (1024 * 1024)).toFixed(2)
                                                : "0.00"} MB
                                        </Text>
                                    )}

                                    <Ionicons
                                        name={beatFile ? "document-text" : "musical-notes"}
                                        size={22}
                                        color={beatFile ? "#fff" : "#888"}
                                    />
                                    <Text
                                        numberOfLines={1}
                                        ellipsizeMode='tail'
                                        style={styles.uploadText}
                                    >
                                        {beatFile ? beatFile.name : t('postBeat.selectFileButton')}
                                    </Text>

                                </TouchableOpacity>

                                {/* 2. BOTÃO DE ENVIAR (SUBMIT) */}
                                {/* Condição: Tem de ter o ficheiro E não pode estar a carregar o BPM E o BPM tem de estar definido (ou erro de BPM tratado) */}
                                {beatFile && !loadingBPM && bpm !== null && (
                                    <TouchableOpacity
                                        onPress={handleSubmitBeatWithModal}
                                        disabled={uploadLoading}
                                        style={[styles.publishButton, { marginTop: 12 }]}
                                    >
                                        {uploadLoading ? (
                                            <ActivityIndicator color="#fff" />
                                        ) : (
                                            <>
                                                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
                                                    {t('postBeat.publishButton')}
                                                </Text>
                                                <Ionicons name="cloud-upload" size={20} color="#fff" style={{ marginLeft: 8 }} />
                                            </>
                                        )}
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                    </KeyboardAvoidingView>
                    <View style={{ height: 80 }} />
                </ScrollView>

                <UploadModal
                    visible={uploadModalVisible}
                    progress={uploadProgress}
                    status={uploadStatus}
                    message={uploadMessage}
                    onClose={() => {
                        // 1. Se o upload foi um sucesso, limpamos os campos
                        if (uploadStatus === 'success') {
                            resetForm();
                        }

                        // 2. Fechamos o modal (independentemente de ser sucesso ou erro)
                        setUploadModalVisible(false);
                    }}
                />
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
    selectFileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#333',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#555',
        //marginBottom: 12,
    },
    publishButton: {
        backgroundColor: '#333', // Cor de destaque para ação positiva
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 12,
        marginTop: 5,
        elevation: 3, // Sombra no Android
        shadowColor: '#000', // Sombra no iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    uploadAreaSelected: {
        borderColor: '#FFD700',
        borderStyle: 'solid',
        backgroundColor: '#222',
    },
    fileSizeText: {
        color: '#888',
        fontSize: 12,
        marginTop: 5,
    },


    infoCardExclusive: {
        backgroundColor: 'rgba(76, 175, 80, 0.1)', // Verde suave atrás
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(76, 175, 80, 0.3)',
        //marginTop: 15,
        marginBottom: 10,
    },
    infoCardFree: {
        backgroundColor: 'rgba(255, 152, 0, 0.1)', // Laranja suave atrás
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 152, 0, 0.3)',
        //marginTop: 5,
        marginBottom: 10,
    },
    infoTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoTitleGreen: {
        color: '#4CAF50',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 8,
    },
    infoTitleOrange: {
        color: '#FF9800',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 8,
    },
    infoBody: {
        color: '#ccc',
        fontSize: 16,
        lineHeight: 20,
    },

})