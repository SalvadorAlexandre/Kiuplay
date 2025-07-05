import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Stack } from "expo-router";

export default function CreateGroupScreen() {
    const [groupName, setGroupName] = useState("");
    const [description, setDescription] = useState("");

    const router = useRouter();

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
                <Text style={styles.title}>Criar Novo Grupo</Text>

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
    title: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
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
});