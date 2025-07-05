// app/UserProfile/[id].tsx
import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter, Stack} from "expo-router";

export default function UserProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // Mock de dados fictícios
  const user = {
    id,
    name: "DJ BeatMaster",
    avatar: "https://i.pravatar.cc/200?img=5",
    bio: "Produtor musical profissional. Beats exclusivos.",
    isFollowing: false,
  };

  const [following, setFollowing] = useState(user.isFollowing);

  const handleFollow = () => {
    setFollowing(!following);
  };

  const handleMessage = () => {
    router.push({
      pathname: "/ChatDetail/[id]",
      params: { id: user.id },
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: (`${name}`),
          headerStyle: { backgroundColor: '#191919', },
          headerTintColor: '#fff',
          //headerTitleStyle: { fontWeight: 'bold' },
          headerShown: true,
        }}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={
            user.avatar
              ? { uri: user.avatar }
              : require("@/assets/images/Default_Profile_Icon/icon_profile_white_120px.png")
          }
          style={styles.avatar}
        />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.bio}>{user.bio}</Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, following ? styles.unfollowButton : styles.followButton]}
            onPress={handleFollow}
          >
            <Text style={styles.buttonText}>
              {following ? "Deixar de seguir" : "Seguir"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.messageButton} onPress={handleMessage}>
            <Text style={styles.buttonText}>Enviar mensagem</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
    justifyContent: "center",
    gap: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  followButton: {
    backgroundColor: "#1565C0",
  },
  unfollowButton: {
    backgroundColor: "#555",
  },
  messageButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});