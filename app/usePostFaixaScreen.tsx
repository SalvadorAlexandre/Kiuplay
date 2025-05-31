import React from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Checkbox } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';
import usePostFaixa from '@/hooks/usePostFaixa'; // Importa o Hook
import * as ImagePicker from 'expo-image-picker'; //importando o modulo responsavel por lidar com o carregamento de imagens
import { StyleSheet,
    ScrollView,
    TouchableOpacity
} from 'react-native';



/**
 * Componente responsável por renderizar a interface de
 * postagem de Faixa Single, usando o Hook usePostFaixa.
 */
export default function PostFaixaScreen(){
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

    return (
        <ScrollView
            horizontal={false} // Garante que esta rolagem seja vertical
            style={styles.scroll} // Aplica o estilo de fundo escuro
            contentContainerStyle={styles.container} // Define padding e crescimento do conteúdo
            showsHorizontalScrollIndicator={false} //Oculta a barra de rolagem
        >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Faixa Single</Text>
            <Text style={styles.texto}>Há participações nesta faixa?</Text>

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

