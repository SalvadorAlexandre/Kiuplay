//app/profileScreens/usePostEPScreen
import React, { useState } from 'react';
import { Checkbox } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';
import usePostFaixa from '@/hooks/usePostEP'; // Importa o Hook
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
import { StatusAlbumEpModal } from '@/components/uploadAlbumEpModal';
import { useTranslation } from '@/src/translations/useTranslation'

/**
 * Componente responsável por renderizar a interface de
 * postagem de EP, usando o Hook usePostEP.
 */
export default function PostEPScreen() {

    const { t } = useTranslation()

    const router = useRouter()
    // Importa os estados e manipuladores do Hook
    const {
        // Estados do EP
        epData,
        capaEP,
        tituloEP,
        setTituloEP,
        generoPrincipal,
        setGeneroPrincipal,
        pickImageEP,
        saveEPDraft,
        isSavingDraft,

        // Faixas
        numFaixas,
        setNumFaixas,
        numFaixasOpen,
        setNumFaixasOpen,
        numFaixasItems,
        setNumFaixasItems,
        postedFaixa,

        // Participantes
        hasParticipants,
        noParticipants,
        dropdownOpen,
        setDropdownOpen,
        numParticipants,
        participantNames,
        handleHasParticipants,
        handleNoParticipants,
        handleNumParticipantsChange,
        handleParticipantNameChange,

        titleFaixa,
        setTitleFaixa,
        genreFaixa,
        setGenreFaixa,
        producerFaixa,
        setProducerFaixa,
        audioFaixa,
        setAudioFaixa,

        modalVisible,
        modalType,
        modalMessage,
        uploadProgress,
        setModalVisible,
        triggerAbortEP, // Use esta no botão de apagar
        executeAbortEP, // Use esta no onConfirm do Modal
        handleAddTrack,
        finishRelease,

        pickAudioEp
    } = usePostFaixa();

    const isStep1Complete = !!epData; // Booleano que indica se o rascunho já foi salvo
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-PT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: t('postEP.headerTitle'),
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
                        <Ionicons name='arrow-back' size={24} color='#fff' />
                    </TouchableOpacity>

                    <Text style={styles.titleBack}>{t('postEP.headerTitle')}</Text>
                </View>

                <ScrollView
                    horizontal={false}
                    style={styles.scroll}
                    contentContainerStyle={styles.container}
                    showsHorizontalScrollIndicator={false}
                >
                    {/* --- SECÇÃO 1: DADOS DO EP VISUALIZAÇÃO APÓS SALVAR: O CARD DE RESUMO --- */}
                    {isStep1Complete ? (
                        <>
                            <View style={styles.cardResumo}>
                                {capaEP && (
                                    <Image
                                        source={{ uri: capaEP.uri }}
                                        style={styles.miniCapa}
                                        resizeMode="cover"
                                    />
                                )}
                                <View style={{ flex: 1, marginLeft: 15 }}>
                                    <Text style={styles.resumoTitle}>{tituloEP}</Text>
                                    <Text style={styles.resumoSub}>{generoPrincipal}</Text>

                                    {/* Barra de Progresso Visual das Músicas */}
                                    <View style={styles.progressBarBg}>
                                        <View style={[
                                            styles.progressBarFill,
                                            { width: `${(postedFaixa / (numFaixas || 1)) * 100}%` }
                                        ]} />
                                    </View>
                                    <Text style={styles.progressText}>
                                        {t('postEP.trackCountLabel', { total: numFaixas, posted: postedFaixa })}
                                    </Text>
                                </View>
                                <Ionicons name="cloud-done" size={24} color="#4CAF50" />
                            </View>

                            {/* TEXTO DE DATA PENDENTE */}
                            {epData.createdAt && (
                                <Text style={styles.pendingText}>
                                    {t('postEP.pendingSince') || 'Pendente desde'}: {formatDate(epData.createdAt)}
                                </Text>
                            )}

                            <View style={styles.actionButtonsRow}>
                                {/* BOTÃO APAGAR */}
                                <TouchableOpacity
                                    style={[styles.btnActionSmall, styles.btnAbortBorder]}
                                    onPress={triggerAbortEP}
                                    disabled={isSavingDraft}
                                >
                                    <Ionicons name="trash-outline" size={18} color="#FF5252" />
                                    <Text style={styles.btnAbortTextSmall}>Apagar</Text>
                                </TouchableOpacity>

                                {/* BOTÃO CONFIRMAR (Só aparece ou destaca quando todas as faixas forem enviadas) */}
                                <TouchableOpacity
                                    style={[
                                        styles.btnActionSmall,
                                        postedFaixa >= (numFaixas || 0) ? styles.btnConfirmActive : styles.btnConfirmDisabled
                                    ]}
                                    onPress={finishRelease}
                                    disabled={isSavingDraft || postedFaixa < (numFaixas || 0)}
                                >
                                    <Ionicons name="checkmark-done-outline" size={18} color={postedFaixa >= (numFaixas || 0) ? "#000" : "#666"} />
                                    <Text style={[styles.btnConfirmText, { color: postedFaixa >= (numFaixas || 0) ? "#000" : "#666" }]}>
                                        Finalizar
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </>

                    ) : (
                        /* FORMULÁRIO ORIGINAL: APARECE APENAS SE NÃO ESTIVER COMPLETO */
                        <>
                            <View style={{
                                width: "100%", marginBottom: 10, alignItems: 'center', justifyContent: 'center',
                            }}>
                                <TouchableOpacity
                                    disabled={isStep1Complete}
                                    style={[styles.coverUploadBox, isStep1Complete && { opacity: 0.7 }]}
                                    onPress={pickImageEP}
                                >
                                    {capaEP ? (
                                        <Image
                                            source={{ uri: capaEP.uri }}
                                            style={{ width: '100%', height: '100%' }}
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <Ionicons name="camera" size={40} color="#fff" />
                                    )}
                                </TouchableOpacity>
                                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>{t('postEP.uploadCover')}</Text>
                            </View>

                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>{t('postEP.sectionInfoTitle')}</Text>

                            <TextInput
                                style={[styles.inputTextBox, isStep1Complete && { backgroundColor: '#252525', color: '#888' }]}
                                placeholder={t('postEP.epTitlePlaceholder')}
                                placeholderTextColor="#ccc"
                                value={tituloEP}
                                onChangeText={setTituloEP}
                                editable={!isStep1Complete}
                            />

                            <TextInput
                                style={[styles.inputTextBox, isStep1Complete && { backgroundColor: '#252525', color: '#888' }]}
                                placeholder={t('postEP.mainGenrePlaceholder')}
                                placeholderTextColor="#ccc"
                                value={generoPrincipal}
                                onChangeText={setGeneroPrincipal}
                                editable={!isStep1Complete}
                            />

                            {/* dropdownpiker que permite escolher o número de faixas a postar de 8 a 30* */}
                            <DropDownPicker<number>
                                disabled={isStep1Complete}
                                open={numFaixasOpen}
                                value={numFaixas}
                                items={numFaixasItems}
                                setOpen={setNumFaixasOpen}
                                setValue={setNumFaixas}  // Correção principal: adicionar setValue para gerenciar a seleção
                                setItems={setNumFaixasItems}

                                placeholder={t('postEP.numTracksPlaceholder')}
                                style={styles.dropdownStyle}
                                textStyle={{ color: '#fff' }}
                                placeholderStyle={{ color: '#ccc' }}
                                dropDownContainerStyle={styles.dropdownContainerStyle}
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

                            <TouchableOpacity
                                style={styles.uploadArea}
                                onPress={saveEPDraft}
                                disabled={isSavingDraft}
                            >
                                <Text style={styles.uploadText}>
                                    {isSavingDraft ? "Salvando..." : t('postEP.saveEPButton')}
                                </Text>
                                <Ionicons name='save' size={20} color={'#fff'} />
                            </TouchableOpacity>
                        </>
                    )}

                    <View style={{ height: 1, backgroundColor: '#333', marginVertical: 20 }} />

                    {/* --- SECÇÃO 2: DADOS DAS FAIXAS (BLOQUEADA ATÉ SALVAR EP) --- */}
                    <View
                        style={{ opacity: isStep1Complete ? 1 : 0.4 }}
                        pointerEvents={isStep1Complete ? 'auto' : 'none'} // ESTA É A CHAVE: Impede cliques
                    >
                        <View
                            style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
                        >
                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', }}>{t('postEP.singleTrackTitle')}</Text>
                            {/*QUANDO O UTILIZADOR ESCOLHER O NUMERO DE FAIXAS A POSTAR ESSE TESTO SERA EXIBIDO* */}
                            {numFaixas !== null && (
                                <Text style={{ color: '#fff', fontSize: 16, marginLeft: 5 }}>
                                    {t('postEP.trackCountLabel', { total: numFaixas, posted: postedFaixa })}
                                </Text>
                            )}
                        </View>

                        <Text style={{ color: '#fff', fontSize: 16, marginTop: 10, }}>{t('postEP.hasParticipantsQuestion')}</Text>

                        {/* Checkbox Sim / Não */}
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Checkbox.Item
                                label={t('postEP.yes')}
                                status={hasParticipants ? 'checked' : 'unchecked'}
                                onPress={handleHasParticipants}
                                labelStyle={{ color: '#fff', fontSize: 14 }}
                                style={{ paddingLeft: 0, marginLeft: -10, marginBottom: 0 }}
                                position='leading'
                            />
                            <Checkbox.Item
                                label={t('postEP.no')}
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
                                        label: t('postEP.participantName', { count: i + 1 }),
                                        value: i + 1,
                                    }))}
                                    setOpen={setDropdownOpen}
                                    setValue={(callback) => {
                                        const value = callback(numParticipants);
                                        handleNumParticipantsChange(value as number);
                                    }}
                                    placeholder={t('postEP.numParticipantsPlaceholder')}
                                    style={styles.dropdownStyle}
                                    textStyle={{ color: '#fff' }}
                                    placeholderStyle={{ color: '#ccc' }}
                                    dropDownContainerStyle={styles.dropdownContainerStyle}
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
                                        placeholder={t('postEP.participantNamePlaceholder', { index: index + 1 })}
                                        placeholderTextColor="#FFFF"
                                    />
                                ))}
                            </View>
                        )}

                        {/* Campos comuns*/}
                        <TextInput
                            style={styles.inputTextBox}
                            placeholder={t('postEP.songTitlePlaceholder')}
                            value={titleFaixa}
                            onChangeText={setTitleFaixa}
                            placeholderTextColor="#FFFF" />
                        <TextInput
                            style={styles.inputTextBox}
                            placeholder={t('postEP.songGenrePlaceholder')}
                            value={genreFaixa}
                            onChangeText={setGenreFaixa}
                            placeholderTextColor="#FFFF" />
                        <TextInput
                            style={styles.inputTextBox}
                            placeholder={t('postEP.producerPlaceholder')}
                            value={producerFaixa}
                            onChangeText={setProducerFaixa}
                            placeholderTextColor="#FFFF"
                        />

                        {/* 1. BOTÃO DE SELECIONAR (PICKER) */}
                        <TouchableOpacity
                            style={[styles.uploadArea, audioFaixa && styles.uploadAreaSelected]}
                            onPress={pickAudioEp}
                        >
                            {audioFaixa && (
                                <Text style={styles.fileSizeText}>
                                    {(audioFaixa.size / (1024 * 1024)).toFixed(2)} MB
                                </Text>
                            )}
                            <Ionicons
                                name={audioFaixa ? "document-text" : "musical-notes"}
                                size={24}
                                color={audioFaixa ? "#fff" : "#888"}
                            />
                            <Text
                                numberOfLines={2}
                                ellipsizeMode='tail'
                                style={styles.uploadText}>
                                {audioFaixa ? audioFaixa.name : t('postEP.selectAudio')}
                            </Text>
                        </TouchableOpacity>

                        {/* 2. BOTÃO DE ENVIAR PARA O BACKEND (SUBMIT) */}
                        {audioFaixa && (
                            <TouchableOpacity
                                style={styles.btnConfirmUpload}
                                onPress={handleAddTrack}
                                disabled={isSavingDraft || !titleFaixa}
                            >
                                <Ionicons name="cloud-upload" size={20} color="#fff" style={{ marginRight: 8 }} />
                                <Text style={styles.btnConfirmUploadText}>
                                    {t('postEP.confirmAndUpload') || "Confirmar e Enviar Faixa"}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={{ height: 40 }} />
                </ScrollView>

                {/* O MODAL ÚNICO QUE GERE TUDO */}
                < StatusAlbumEpModal
                    visible={modalVisible}
                    type={modalType}
                    message={modalMessage}
                    progress={uploadProgress}
                    onClose={() => setModalVisible(false)}
                    onConfirm={() => {
                        // Quando clica em "Sim" no modal de confirmação
                        executeAbortEP();
                    }}
                />
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
        marginBottom: 12,
    },
    uploadText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 5,
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
    coverUploadBox: {
        width: 150,           // Largura do quadrado
        height: 150,          // Altura do quadrado (mesmo que a largura = quadrado)
        borderRadius: 10,     // Cantos arredondados
        backgroundColor: '#333', // Cor do fundo do quadrado (cinza escuro)
        justifyContent: 'center',  // Centraliza conteúdo verticalmente
        alignItems: 'center',      // Centraliza conteúdo horizontalmente
        marginBottom: 10,      // Espaçamento abaixo
        overflow: 'hidden',    // Faz a imagem se encaixar dentro do quadrado
    },
    dropdownContainerStyle: {
        backgroundColor: '#2a2a2a',
        borderColor: '#fff',
        borderWidth: 1,
    },
    dropdownStyle: {
        backgroundColor: '#2a2a2a',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#555',
    },

    cardResumo: {
        backgroundColor: '#252525',
        borderRadius: 12,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#333',
    },
    miniCapa: {
        width: 70,
        height: 70,
        borderRadius: 8,
    },
    resumoTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    resumoSub: {
        color: '#aaa',
        fontSize: 14,
        marginBottom: 8,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: '#444',
        borderRadius: 3,
        width: '100%',
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#E02041', // Cor de destaque da sua app
    },
    progressText: {
        color: '#fff',
        fontSize: 12,
        marginTop: 5,
        fontWeight: '600',
    },
    btnAbortText: {
        color: '#FF5252',
        fontSize: 14,
        fontWeight: '600',
    },
    actionButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        gap: 10, // Espaço entre os botões
    },
    btnActionSmall: {
        flex: 1, // Faz com que ambos tenham o mesmo tamanho
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
    },
    btnAbortBorder: {
        borderColor: '#FF5252',
        backgroundColor: 'transparent',
    },
    btnAbortTextSmall: {
        color: '#FF5252',
        fontWeight: 'bold',
        marginLeft: 5,
    },
    btnConfirmActive: {
        backgroundColor: '#333', // Teu amarelo ouro
        borderColor: '#333',
    },
    btnConfirmDisabled: {
        backgroundColor: '#333',
        borderColor: '#444',
    },
    btnConfirmText: {
        fontWeight: 'bold',
        marginLeft: 5,
    },
    pendingText: {
        color: '#888', // Cinza para não roubar a atenção
        fontSize: 18,
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 5,
        fontStyle: 'italic',
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
    btnConfirmUpload: {
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
    btnConfirmUploadText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
});


