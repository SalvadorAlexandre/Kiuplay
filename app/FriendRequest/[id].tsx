// app/FriendRequestDetail/[id].tsx
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";

export default function FriendRequestDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // Mock de dados fictícios
  const request = {
    id,
    name: "Marcos Vinicius",
    avatar: "https://i.pravatar.cc/150?img=12",
    bio: "Produtor de beats e compositor.",
  };

  const handleAccept = () => {
    alert(`Pedido aceito de ${request.name}`);
    router.back();
  };

  const handleReject = () => {
    alert(`Pedido recusado de ${request.name}`);
    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: (`${request.name}`),
          headerStyle: { backgroundColor: '#191919', },
          headerTintColor: '#fff',
          //headerTitleStyle: { fontWeight: 'bold' },
          headerShown: true,
        }}
      />
      <View style={styles.container}>
        <Image
          source={
            request.avatar
              ? { uri: request.avatar }
              : require("@/assets/images/Default_Profile_Icon/icon_profile_white_120px.png")
          }
          style={styles.avatar}
        />
        <Text style={styles.name}>{request.name}</Text>
        <Text style={styles.bio}>{request.bio}</Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
            <Text style={styles.buttonText}>Aceitar pedido</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
            <Text style={styles.buttonText}>Recusar</Text>
          </TouchableOpacity>
        </View>
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
  bio: {
    color: "#aaa",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  acceptButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  rejectButton: {
    backgroundColor: "#c0392b",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});