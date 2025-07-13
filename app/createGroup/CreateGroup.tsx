import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Stack } from "expo-router";
import * as ImagePicker from "expo-image-picker";


export default function CreateGroupScreen() {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [groupName, setGroupName] = useState("");
    const [description, setDescription] = useState("");

    const router = useRouter();

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
            allowsEditing: true,
            aspect: [1, 1],
        });

        if (!result.canceled && result.assets.length > 0) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleCreateGroup = () => {
        if (!groupName.trim()) {
            Alert.alert("Erro", "O nome do grupo é obrigatório.");
            return;
        }

        // Aqui você pode chamar sua API ou lógica de criação
        console.log("Grupo criado:", groupName, description);

        // Depois volta para a lista de grupos
        router.back();
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Novo Grupo',
                    headerStyle: { backgroundColor: '#191919', },
                    headerTintColor: '#fff',
                    //headerTitleStyle: { fontWeight: 'bold' },
                    headerShown: true,
                }}
            />
            <View style={styles.container}>

                <TouchableOpacity onPress={handlePickImage} style={styles.imagePicker}>
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                    ) : (
                        <Ionicons name="camera" size={40} color="#aaa" />
                    )}
                </TouchableOpacity>


                <View style={styles.infoContainer}>
                    <Text style={styles.nameGroup}>{groupName}</Text>
                    <Text style={styles.descriptionGroup}>{description}</Text>
                </View>

                <TextInput
                    style={styles.input}
                    placeholder="Nome do Grupo"
                    placeholderTextColor="#888"
                    value={groupName}
                    onChangeText={setGroupName}
                />

                <TextInput
                    style={[styles.input, { height: 100 }]}
                    placeholder="Descrição"
                    placeholderTextColor="#888"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />
                {/* Botões extras de gestão */}
                <View style={styles.optionsContainer}>
                    <TouchableOpacity style={styles.optionButton}>
                        <Text style={styles.optionText}>Gerir permissões</Text>
                        <Ionicons name="chevron-forward" size={20} color="#aaa" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionButton}>
                        <Text style={styles.optionText}>Gerir administradores</Text>
                        <Ionicons name="chevron-forward" size={20} color="#aaa" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionButton}>
                        <Text style={styles.optionText}>Convidar membros</Text>
                        <Ionicons name="chevron-forward" size={20} color="#aaa" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.createButton} onPress={handleCreateGroup}>
                    <Ionicons name="add-circle-outline" size={20} color="#fff" />
                    <Text style={styles.createButtonText}>Criar Grupo</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#191919",
        padding: 20,
    },
    nameGroup: {
        color: "#fff",
        fontSize: 19,
        fontWeight: "bold",
        //marginBottom: 20,
    },
    descriptionGroup: {
        color: "#aaa",
        fontSize: 16,
        textAlign: "center",
        marginBottom: 24,
    },
    infoContainer: {
        alignItems: "center",
        justifyContent: "center",
        //flexDirection: "row",
        //marginBottom: 20,
        width: '100%',
    },
    input: {
        backgroundColor: "#333",
        color: "#fff",
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        marginBottom: 16,
    },
    createButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#28a745",
        paddingVertical: 12,
        borderRadius: 8,
    },
    createButtonText: {
        color: "#fff",
        fontSize: 16,
        marginLeft: 8,
    },
    imagePicker: {
        alignSelf: "center",
        backgroundColor: "#333",
        borderRadius: 100,
        width: 100,
        height: 100,
        marginBottom: 5,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    imagePreview: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    livePreview: {
        color: "#aaa",
        marginBottom: 8,
    },
    optionsContainer: {
        marginTop: 24,
        marginBottom: 24,
        //borderTopWidth: 1,
        borderTopColor: "#333",
        paddingTop: 12,
    },
    optionButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#222",
    },
    optionText: {
        color: "#fff",
        fontSize: 16,
    },
});