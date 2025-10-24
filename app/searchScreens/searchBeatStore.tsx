//app/searchScreens/searchBeatStore.tsx
import React, { useState, useMemo, useCallback } from "react";
import {
    View,
    TextInput,
    FlatList,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Stack, Href } from "expo-router";
import debounce from "lodash.debounce";

import { MOCKED_BEATSTORE_FEED_DATA } from "@/src/types/contentServer";
import { BeatStoreFeedItem } from "@/src/types/contentType";

import { useTranslation } from "@/src/translations/useTranslation";

export default function UseSearchBeatScreen() {

    const { t } = useTranslation()

    const [query, setQuery] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    // 🔍 Filtro otimizado
    const filterData = useCallback((text: string): BeatStoreFeedItem[] => {
        if (!text) return [];
        const lower = text.toLowerCase().trim();

        return MOCKED_BEATSTORE_FEED_DATA.filter((item) => {
            const searchableText = `${item.title ?? ""} ${item.producer ?? ""}`.toLowerCase();
            return searchableText.includes(lower);
        });
    }, []);

    // ⏱️ Debounce evita re-renderização a cada tecla
    const debouncedSetSearchQuery = useMemo(
        () => debounce((text: string) => setSearchQuery(text), 300),
        []
    );

    const handleInputChange = (text: string) => {
        setQuery(text);
        debouncedSetSearchQuery(text);
    };

    const handleClear = () => {
        setQuery("");
        setSearchQuery("");
    };

    const results = useMemo(() => filterData(searchQuery), [searchQuery, filterData]);

    // 🎧 Função de navegação
    const handleSearchItemPress = (item: BeatStoreFeedItem) => {
        if (item.typeUse === "free") {
            router.push(`/contentCardBeatStoreScreens/freeBeat-details/${item.id}` as Href);
        } else if (item.typeUse === "exclusive") {
            router.push(`/contentCardBeatStoreScreens/exclusiveBeat-details/${item.id}` as Href);
        } else {
           console.warn(t('search_beat_store.unknown_item_type'));
        }
    };

    // 🎨 Renderização de cada resultado (igual ao estilo do searchProfile)
    const renderItem = ({ item }: { item: BeatStoreFeedItem }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => handleSearchItemPress(item)}
        >
            <Ionicons
                name={item.typeUse === "exclusive" ? "diamond" : "musical-notes"}
                size={26}
                color="#fff"
                style={styles.itemIcon}
            />
            <View style={styles.textContainer}>
                {/* 🎵 Título */}
                <Text style={styles.itemText} numberOfLines={1}>
                    {item.title}
                </Text>

                {/* 🔸 Tipo (Exclusive ou Free) */}
                <Text style={styles.itemType}>
                    {item.typeUse === "exclusive" ? "Exclusive Beat" : "Free Beat"}
                </Text>

                {/* 🎧 BPM e Gênero */}
                <View style={styles.metaRow}>
                    {item.bpm && (
                        <Text style={styles.metaText}>
                            {item.bpm} BPM
                        </Text>
                    )}
                    {item.genre && (
                        <Text style={styles.metaText}>
                            {item.bpm ? " • " : ""}{item.genre}
                        </Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.container}>
                {/* 🔝 Barra de pesquisa */}
                <View style={styles.searchBar}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>

                    <TextInput
                        style={styles.input}
                        placeholder={t('search_beat_store.placeholder')}
                        placeholderTextColor="#aaa"
                        value={query}
                        onChangeText={handleInputChange}
                        autoFocus
                    />

                    {query.length > 0 && (
                        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                            <Ionicons name="close-circle" size={24} color="#aaa" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* 🧾 Resultados */}
                <FlatList
                    data={results}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ paddingBottom: 40 }}
                    ListEmptyComponent={() =>
                        searchQuery.length > 0 ? (
                            <Text style={styles.noResults}>
                                {t('search_beat_store.no_results', { query: searchQuery })}
                            </Text>
                        ) : (
                            <Text style={styles.noResults}>
                                {t('search_beat_store.start_typing')}
                            </Text>
                        )
                    }
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#191919",
        paddingTop: Platform.OS === "android" ? 3 : 3,
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        //backgroundColor: "#1e1e1e",
        paddingHorizontal: 10,
        paddingVertical: 20,
        //borderBottomColor: "#333",
    },
    backButton: {
        padding: 5,
        marginRight: 5,
    },
    input: {
        flex: 1,
        color: "#fff",
        fontSize: 16,
        paddingVertical: 8,
    },
    clearButton: {
        padding: 5,
        marginLeft: 5,
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
    },
    itemIcon: {
        marginRight: 15,
    },
    textContainer: {
        flexDirection: "column",
        flex: 1,
    },
    itemText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    itemType: {
        color: "#aaa",
        fontSize: 12,
        marginTop: 2,
    },
    noResults: {
        color: "#aaa",
        textAlign: "center",
        marginTop: 40,
        fontSize: 16,
    },

    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 2,
    },
    metaText: {
        color: "#888",
        fontSize: 12,
    },
});