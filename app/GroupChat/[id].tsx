// app/GroupDetail/[id].tsx
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";

export default function GroupDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    // Mock de dados fictícios
    const group = {
        id,
        name: "Rappers Angola",
        avatar: "https://i.pravatar.cc/150?img=15",
        description: "Grupo de rap underground de Angola com 8 membros ativos.",
    };

    const handleJoin = () => {
        alert(`Você entrou no grupo: ${group.name}`);
        router.back();
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: (`${group.name}`),
                    headerStyle: { backgroundColor: '#191919',},
                    headerTintColor: '#fff',
                    //headerTitleStyle: { fontWeight: 'bold' },
                    headerShown: true,
                }}
            />
            <View style={styles.container}>
                <Image
                    source={
                        group.avatar
                            ? { uri: group.avatar }
                            : require("@/assets/images/Default_Profile_Icon/icon_profile_white_120px.png")
                    }
                    style={styles.avatar}
                />

                <Text style={styles.name}>{group.name}</Text>
                <Text style={styles.description}>{group.description}</Text>

                <TouchableOpacity style={styles.joinButton} onPress={handleJoin}>
                    <Text style={styles.buttonText}>Entrar no grupo</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingVertical: 40,
        paddingHorizontal: 16,
        backgroundColor: "#191919",
        flex: 1,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 16,
        backgroundColor: "#444",
    },
    name: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 8,
    },
    description: {
        color: "#aaa",
        fontSize: 16,
        textAlign: "center",
        marginBottom: 24,
    },
    joinButton: {
        backgroundColor: "#1565C0",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
    },
});