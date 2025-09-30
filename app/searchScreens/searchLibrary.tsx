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
// Importar função debounce para otimização
import debounce from 'lodash.debounce';

// 1. MELHORIA DE TIPAGEM: Definir um tipo comum
// Tornamos 'category' opcional e string para maior segurança
interface ContentItem {
    id: string;
    title?: string;
    name?: string;
    category?: string; // Pode ser 'undefined' ou uma string como 'single', 'album', 'ep', etc.
}

// Assumindo que MOCKED_CLOUD_FEED_DATA é do tipo ContentItem[]
import { MOCKED_CLOUD_FEED_DATA } from "@/src/types/contentServer";

export default function LibrarySearch() {
    const [query, setQuery] = useState("");
    const router = useRouter();

    // Estado que só é atualizado após o debounce
    const [searchQuery, setSearchQuery] = useState("");

    // --- LÓGICA DE PESQUISA (Otimizada com useCallback) ---

    // Função de filtro: Memorizada para evitar recriação desnecessária
    const filterData = useCallback((text: string): ContentItem[] => {
        if (!text) return [];

        const lowercasedText = text.toLowerCase().trim();

        return MOCKED_CLOUD_FEED_DATA.filter((item: ContentItem) => {
            // Acesso seguro ao campo de pesquisa (title ou name)
            const searchField = "title" in item && item.title
                ? item.title
                : ("name" in item && item.name ? item.name : '');

            return searchField.toLowerCase().includes(lowercasedText);
        });
    }, []);

    // Função Debounced: Memorizada para garantir que o timer do debounce é mantido
    const debouncedSetSearchQuery = useMemo(
        // Só executa o setSearchQuery 300ms após a última tecla
        () => debounce((text: string) => setSearchQuery(text), 300),
        []
    );

    // Handler de input: Atualiza o input visualmente e dispara o debounce
    const handleInputChange = (text: string) => {
        setQuery(text);
        // Chamar a função debounced (não o setSearchQuery diretamente)
        debouncedSetSearchQuery(text);
    };

    // Resultados: Filtra apenas quando searchQuery (debounced) muda
    const results = useMemo(() => filterData(searchQuery), [searchQuery, filterData]);

    // --- UX HANDLERS ---

    const handleClear = () => {
        setQuery("");
        // Imediatamente limpa os resultados
        setSearchQuery("");
    };

    // --- RENDERIZAÇÃO DE ITEM (Correção de Tipagem/Navegação) ---

    const renderItem = ({ item }: { item: ContentItem }) => {
        // Acesso seguro às propriedades para exibição
        const displayTitle = "title" in item && item.title ? item.title : item.name;
        const isArtist = !("category" in item) || item.category === undefined;
        const displayType = isArtist ? "Artista" : item.category;

        return (
            <TouchableOpacity
                style={styles.item}
                onPress={() => {

                    if (isArtist) {
                        router.push(`/contentCardLibraryScreens/artist-profile/${item.id}`);
                        // Lógica para todos os outros itens que não são Artistas
                        //router.push(`/` );
                    } else if (item.category && item.category.trim() !== "") {
                        // Navegação para Conteúdo (se 'category' existe e tem valor)
                        router.push(`/contentCardLibraryScreens/${item.category}-details/${item.id}` as Href);

                    } else {
                        // Fallback para debug ou para ignorar itens malformados
                        console.warn("Navegação ignorada para item mal formado:", item);
                    }
                }}
            >
                <Ionicons
                    name={isArtist ? "person-circle" : "musical-notes"}
                    size={26}
                    color="#fff"
                    style={styles.itemIcon}
                />

                <View style={styles.textContainer}>
                    <Text style={styles.itemText} numberOfLines={1}>
                        {displayTitle}
                    </Text>
                    <Text style={styles.itemType}>
                        {displayType}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };


    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.container}>
                {/* TopBar e Clear Button */}
                <View style={styles.searchBar}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
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
                    {/* Botão de limpar só aparece quando há texto */}
                    {query.length > 0 && (
                        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
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
                            <Text style={styles.noResults}>Nenhum resultado encontrado para "{searchQuery}".</Text>
                        ) : (
                            <Text style={styles.noResults}>Comece a digitar para pesquisar na sua biblioteca.</Text>
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
        // PADDING: Uso mais explícito do SafeAreaView é recomendado, mas mantendo o seu estilo.
        paddingTop: Platform.OS === 'android' ? 3 : 3,
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
        //borderBottomWidth: StyleSheet.hairlineWidth,
        //borderBottomColor: "#2b2b2b",
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