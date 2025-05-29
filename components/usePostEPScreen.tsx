import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Checkbox } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';
import usePostFaixa from '@/hooks/usePostEP'; // Importa o Hook
import { StyleSheet } from 'react-native';


/**
 * Componente responsável por renderizar a interface de
 * postagem de EP, usando o Hook usePostEP.
 */
const PostEPScreen = () => {
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

    return (
        <View style={{ alignItems: 'flex-start', paddingVertical: 10 }}>

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

            {/* Botão para upload de capa do album*/}
            <Pressable style={styles.uploadArea}>
                <Text style={styles.uploadText}>Carregar capa</Text>
                <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
            </Pressable>

            {/*Aqui vem o botao salvar, Equanto o utilizador nao salvar os componentes abaixo comtinuarao desable podes fazer isso companheiro*/}
            <Pressable style={styles.uploadArea}>
                <Text style={styles.uploadText}>Salvar</Text>
            </Pressable>

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

            <Text style={{color: '#fff', fontSize: 16, marginTop: 10,}}>Há participações nesta faixa?</Text>

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


            {/* Botão para upload de capa */}
            <Pressable style={styles.uploadArea}>
                <Text style={styles.uploadText}>Carregar capa</Text>
                <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
            </Pressable>

            {/* Botão para upload do auddio */}
            <Pressable style={styles.uploadArea}>
                <Text style={styles.uploadText}>Carregar audio</Text>
                <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
            </Pressable>
        </View>
    );
};

export const styles = StyleSheet.create({
    scroll: {
        flex: 1,
        backgroundColor: '#191919',
    },
    container: {
        flexGrow: 1,
        paddingVertical: 40,
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
});

export default PostEPScreen;

