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
import { useRouter, Stack } from "expo-router";
import debounce from "lodash.debounce";

interface ContentItem {
    id: string;
    title?: string;
    name?: string;
    category?: string;
}

import { MOCKED_CLOUD_FEED_DATA } from "@/src/types/contentServer";

export default function LibrarySearch() {
    const [query, setQuery] = useState("");
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    const filterData = useCallback((text: string): ContentItem[] => {
        if (!text) return [];

        const lowercasedText = text.toLowerCase().trim();

        return MOCKED_CLOUD_FEED_DATA.filter((item: ContentItem) => {
            const searchField =
                "title" in item && item.title
                    ? item.title
                    : "name" in item && item.name
                        ? item.name
                        : "";

            return searchField.toLowerCase().includes(lowercasedText);
        });
    }, []);

    const debouncedSetSearchQuery = useMemo(
        () => debounce((text: string) => setSearchQuery(text), 300),
        []
    );

    const handleInputChange = (text: string) => {
        setQuery(text);
        debouncedSetSearchQuery(text);
    };

    const results = useMemo(
        () => filterData(searchQuery),
        [searchQuery, filterData]
    );

    const handleClear = () => {
        setQuery("");
        setSearchQuery("");
    };

    const handleSearchItemPress = (item: ContentItem) => {
        if (item.category === "single") {
            router.push(`/contentCardLibraryScreens/single-details/${item.id}`);
        } else if (item.category === "album") {
            router.push(`/contentCardLibraryScreens/album-details/${item.id}`);
        } else if (item.category === "ep") {
            router.push(`/contentCardLibraryScreens/ep-details/${item.id}`);
        } else if (item.category === "artist" || !item.category) {
            router.push(`/contentCardLibraryScreens/artist-profile/${item.id}`);
        } else {
            console.warn("Tipo de item desconhecido:", item.category);
        }
    };

    const renderItem = ({ item }: { item: ContentItem }) => {
        const displayTitle =
            "title" in item && item.title ? item.title : item.name;

        const isArtist =
            !item.category || item.category.trim() === "" || item.category === "artist";

        const displayType = isArtist ? "Artista" : item.category;

        // 🎨 Ícones personalizados por tipo
        let iconName: keyof typeof Ionicons.glyphMap = "musical-notes";
        if (isArtist) iconName = "person-circle";
        else if (item.category === "single") iconName = "musical-note";
        else if (item.category === "album") iconName = "albums";
        else if (item.category === "ep") iconName = "albums";

        return (
            <TouchableOpacity
                style={styles.item}
                onPress={() => handleSearchItemPress(item)}
            >
                <Ionicons
                    name={iconName}
                    size={26}
                    color="#fff"
                    style={styles.itemIcon}
                />

                <View style={styles.textContainer}>
                    <Text style={styles.itemText} numberOfLines={1}>
                        {displayTitle}
                    </Text>
                    <Text style={styles.itemType}>{displayType}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.container}>
                <View style={styles.searchBar}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>

                    <TextInput
                        style={styles.input}
                        placeholder="Pesquisar na Library..."
                        placeholderTextColor="#aaa"
                        value={query}
                        onChangeText={handleInputChange}
                        autoFocus
                    />

                    {query.length > 0 && (
                        <TouchableOpacity
                            onPress={handleClear}
                            style={styles.clearButton}
                        >
                            <Ionicons name="close-circle" size={24} color="#aaa" />
                        </TouchableOpacity>
                    )}
                </View>

                <FlatList
                    data={results}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    keyboardShouldPersistTaps="handled"
                    ListEmptyComponent={() =>
                        searchQuery.length > 0 ? (
                            <Text style={styles.noResults}>
                                Nenhum resultado encontrado para "{searchQuery}".
                            </Text>
                        ) : (
                            <Text style={styles.noResults}>
                                Comece a digitar para pesquisar na sua biblioteca.
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
        backgroundColor: "#1e1e1e",
        paddingHorizontal: 10,
        paddingVertical: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#333",
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
        marginRight: 10,
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
});