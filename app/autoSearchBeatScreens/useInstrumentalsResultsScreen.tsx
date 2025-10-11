import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { MOCKED_BEATSTORE_FEED_DATA } from "@/src/types/contentServer";
import { FreeBeat, ExclusiveBeat } from "@/src/types/contentType";

type BeatItem = FreeBeat | ExclusiveBeat;

export default function InstrumentalsScreen() {
  const { bpm } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [beats, setBeats] = useState<BeatItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstrumentals = async () => {
      setLoading(true);
      setError(null);
      try {
        const targetBpm = parseFloat(bpm as string);
        const tolerance = 8; // tolerância em BPM (+/-)

        await new Promise((resolve) => setTimeout(resolve, 1200));

        // 🔍 Filtra os beats com base no BPM
        const filtered = MOCKED_BEATSTORE_FEED_DATA.filter(
          (beat) =>
            beat.bpm >= targetBpm - tolerance && beat.bpm <= targetBpm + tolerance
        ) as BeatItem[];

        setBeats(filtered);
      } catch (err) {
        console.error("Erro ao buscar instrumentais:", err);
        setError("Não foi possível carregar os instrumentais.");
      } finally {
        setLoading(false);
      }
    };

    if (bpm) fetchInstrumentals();
    else {
      setLoading(false);
      setError("Nenhum BPM especificado para a busca.");
    }
  }, [bpm]);

  // 🧭 Navegação conforme o tipo do beat
  const handleBeatPress = (item: BeatItem) => {
    if (item.typeUse === "free") {
      router.push(`/contentCardBeatStoreScreens/freeBeat-details/${item.id}`);
    } else if (item.typeUse === "exclusive") {
      router.push(`/contentCardBeatStoreScreens/exclusiveBeat-details/${item.id}`);
    } else {
      console.warn("Tipo de item desconhecido para navegação:", item);
    }
  };

  // 🎵 Renderização de cada beat
  const renderItem = ({ item }: { item: BeatItem }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      activeOpacity={0.8}
      onPress={() => handleBeatPress(item)}
    >
      {/* Capa do beat */}
      <Image source={{ uri: item.cover }} style={styles.coverImage} />

      {/* Detalhes do beat */}
      <View style={{ flex: 1 }}>
        <Text style={styles.titleText} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.subText} numberOfLines={1}>
          {item.producer} • {item.genre} • {item.bpm} BPM
        </Text>

        {/* Tipo e origem */}
        <View style={styles.badgeRow}>
          <View
            style={[
              styles.badge,
              {
                backgroundColor:
                  item.typeUse === "exclusive" ? "#FF4500" : "#1E90FF",
              },
            ]}
          >
            <Ionicons
              name={item.typeUse === "exclusive" ? "diamond" : "musical-notes"}
              color="#fff"
              size={14}
            />
            <Text style={styles.badgeText}>
              {item.typeUse === "exclusive" ? "Exclusive" : "Free"}
            </Text>
          </View>

          <Text style={styles.sourceText}>{item.source}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: `Resultados para (${bpm || "—"} BPM)`,
          headerTintColor: "#fff",
          headerStyle: { backgroundColor: "#191C40" },
        }}
      />
      <LinearGradient colors={["#2F3C97", "#191C40"]} style={styles.gradient}>
        {loading ? (
          <View style={styles.centeredView}>
            <ActivityIndicator size="large" color="#1E90FF" />
            <Text style={styles.loadingText}>Buscando instrumentais...</Text>
          </View>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : beats.length === 0 ? (
          <Text style={styles.noResultsText}>
            Nenhum beat encontrado próximo a {bpm} BPM.
          </Text>
        ) : (
          <FlatList
            data={beats}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </LinearGradient>
    </>
  );
}

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    padding: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#ccc",
    marginTop: 10,
  },
  errorText: {
    color: "#FF6B6B",
    textAlign: "center",
    fontSize: 16,
    marginTop: 30,
  },
  noResultsText: {
    color: "#ccc",
    textAlign: "center",
    fontSize: 16,
    marginTop: 30,
  },
  listContainer: {
    paddingBottom: 30,
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  coverImage: {
    width: 65,
    height: 65,
    borderRadius: 8,
    marginRight: 10,
  },
  titleText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  subText: {
    color: "#aaa",
    fontSize: 13,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 10,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 4,
  },
  sourceText: {
    color: "#888",
    fontSize: 12,
  },
});