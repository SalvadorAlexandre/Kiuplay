import React from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'expo-image-picker';
import { usePostBeat } from '@/hooks/usePostBeat';
import { 
    View,
    Text,
    TextInput,
    Button,
    Image,
    TouchableOpacity
} from 'react-native';

export const PostBeatScreen = () => {
    const {
        nomeProdutor, setNomeProdutor,
        tituloBeat, setTituloBeat,
        generoBeat, setGeneroBeat,
        preco, setPreco,
        tipoLicencaOpen, setTipoLicencaOpen,
        tipoLicenca, setTipoLicenca,
        tipoLicencaItems, setTipoLicencaItems,
        capa, setCapa,
        beatFile, setBeatFile,
    } = usePostBeat();

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync();
        if (!result.canceled) setCapa(result.assets[0]);
    };

    const pickBeatFile = async () => {
        let result = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
        if (result.type === 'success') setBeatFile(result);
    };

    return (
        <View style={{ padding: 16 }}>
           
            <Text>Nome do produtor</Text>
            <TextInput value={nomeProdutor} onChangeText={setNomeProdutor} style={{ borderWidth: 1, marginBottom: 8 }} />

            <Text>Título do beat</Text>
            <TextInput value={tituloBeat} onChangeText={setTituloBeat} style={{ borderWidth: 1, marginBottom: 8 }} />

            <Text>Gênero do beat</Text>
            <TextInput value={generoBeat} onChangeText={setGeneroBeat} style={{ borderWidth: 1, marginBottom: 8 }} />

            <Text>Preço</Text>
            <TextInput value={preco} onChangeText={setPreco} keyboardType="numeric" style={{ borderWidth: 1, marginBottom: 8 }} />

            <Text>Tipo de licença</Text>
            <DropDownPicker
                open={tipoLicencaOpen}
                value={tipoLicenca}
                items={tipoLicencaItems}
                setOpen={setTipoLicencaOpen}
                setValue={setTipoLicenca}
                setItems={setTipoLicencaItems}
                placeholder="Selecione o tipo"
                style={{ marginBottom: 8 }}
            />
             {capa && <Image source={{ uri: capa.uri }} style={{ width: '100%', height: 100, borderRadius: 6}} />}
            <Text>Capa ou Thumbnail</Text>
            <TouchableOpacity onPress={pickImage}>
                <Text>Selecionar imagem</Text>
            </TouchableOpacity>
            

            <Text>Upload do beat (MP3 com marca d'água)</Text>
            <TouchableOpacity onPress={pickBeatFile} style={{ borderWidth: 1, padding: 8, marginBottom: 8 }}>
                <Text>Selecionar arquivo</Text>
            </TouchableOpacity>
            {beatFile && <Text>Selecionado: {beatFile.name}</Text>}

            <Button title="Publicar Beat" onPress={() => alert('Beat publicado!')} />
        </View>

        
    );
    
};
