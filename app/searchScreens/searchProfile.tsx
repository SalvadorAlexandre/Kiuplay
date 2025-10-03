// app/searchScreens/searchProfile.tsx
import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform, // Adicionado para ajustes de estilo
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Stack, Href } from "expo-router";
// O debounce já está corretamente importado
import debounce from "lodash.debounce";


// Assumindo uma tipagem base para o conteúdo (Singles, EPs, etc.)
interface ContentItem {
  id: string;
  title: string;
  type: "Single" | "EP" | "Álbum" | "Exclusive Beat" | "Free Beat";
}

// Assumindo a tipagem de perfis (ajuste conforme o seu MOCKED_PROFILE)
interface Profile {
  id: string;
  name: string;
  singles?: any[];
  eps?: any[];
  albums?: any[];
  exclusiveBeats?: any[];
  freeBeats?: any[];
}


import { MOCKED_PROFILE } from "@/src/types/contentServer";

export default function ProfileSearch() {
  const [query, setQuery] = useState("");
  // 👈 Novo estado para guardar o termo SÓ APÓS O DEBOUNCE (melhora a UX da mensagem de "Nenhum resultado")
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<ContentItem[]>([]);
  const router = useRouter();

  // Pega o perfil (useMemo garante que só executa uma vez)
  const userProfile: Profile = useMemo(() => MOCKED_PROFILE[0], []);

  // --- LÓGICA DE BUSCA ---

  // 1. Função principal de busca (para ser debounced)
  const performSearch = (text: string) => {
    // Garantir que o termo de busca debounced é atualizado
    setSearchQuery(text);

    if (!text.trim()) {
      setResults([]);
      return;
    }

    const lowercasedText = text.toLowerCase().trim();

    // Agrupa e normaliza todos os itens de conteúdo em uma única lista
    const allItems: ContentItem[] = [
      ...(userProfile.singles?.map((s) => ({ ...s, type: "Single" })) || []),
      ...(userProfile.eps?.map((ep) => ({ ...ep, type: "EP" })) || []),
      ...(userProfile.albums?.map((a) => ({ ...a, type: "Álbum" })) || []),
      ...(userProfile.exclusiveBeats?.map((b) => ({ ...b, type: "Exclusive Beat" })) || []),
      ...(userProfile.freeBeats?.map((b) => ({ ...b, type: "Free Beat" })) || []),
    ] as ContentItem[]; // Assumindo que a união de todos os arrays respeita ContentItem

    const filtered = allItems.filter((item) =>
      item.title.toLowerCase().includes(lowercasedText)
    );

    setResults(filtered);
  };

  // 2. Cria a versão debounced da função, memorizada
  const debouncedSearch = useMemo(
    // Tempo reduzido para 300ms (mais responsivo para busca)
    () => debounce(performSearch, 300),
    [userProfile] // Se o userProfile puder mudar, inclua-o aqui
  );

  // 3. Handler de input que atualiza o campo e dispara o debounce
  const handleInputChange = (text: string) => {
    setQuery(text);
    debouncedSearch(text);
  };

  // 4. Handler para limpar o campo (Melhoria de UX)
  const handleClear = () => {
    setQuery("");
    setSearchQuery(""); // Limpa o termo debounced para limpar os resultados
    setResults([]); // Limpa a lista de resultados
    debouncedSearch.cancel(); // Cancela qualquer debounce pendente
  };

  // --- COMPONENTE DE RENDERIZAÇÃO DO ITEM ---

  const renderItem = ({ item }: { item: ContentItem }) => {
    let routePath = "";

    // Lógica de roteamento: mais concisa e robusta
    if (item.type === "Single" || item.type === "EP" || item.type === "Álbum") {
      const category = item.type.toLowerCase().replace("á", "a"); // "Álbum" -> "album"
      routePath = `/contentCardLibraryScreens/${category}-details/${item.id}`;
    } else if (item.type === "Exclusive Beat") {
      routePath = `/contentCardBeatStoreScreens/exclusiveBeat-details/${item.id}`;
    } else if (item.type === "Free Beat") {
      routePath = `/contentCardBeatStoreScreens/freeBeat-details/${item.id}`;
    }

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => routePath && router.push(routePath as Href)}
      >
        <Ionicons
          // Ícone dinâmico baseado no tipo
          name={item.type.includes("Beat") ? "code-working" : "musical-notes"}
          size={26}
          color="#fff"
          style={styles.itemIcon}
        />
        <View style={styles.textContainer}>
          <Text style={styles.itemText} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.itemType}>{item.type}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>

        {/* --- TOP BAR MELHORADA --- */}
        <View style={styles.searchBarContainer}>
          {/* Botão de Voltar */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Campo de Busca */}
          <TextInput
            style={styles.input}
            placeholder={`Pesquisar no perfil de ${userProfile?.name || 'Artista'}...`}
            placeholderTextColor="#aaa"
            value={query}
            onChangeText={handleInputChange}
            autoFocus
          />

          {/* Botão de Limpar (só visível com texto) */}
          {query.length > 0 && (
            <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
              <Ionicons name="close-circle" size={24} color="#aaa" />
            </TouchableOpacity>
          )}
        </View>

        {/* --- LISTA DE RESULTADOS --- */}
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={() =>
            searchQuery.length > 0 && results.length === 0 ? (
              <Text style={styles.noResults}>Nenhum resultado encontrado para "{searchQuery}".</Text>
            ) : (
              <Text style={styles.noResults}>Comece a digitar para pesquisar no seu perfil.</Text>
            )
          }
        />
      </View>
    </>
  );
}

// --- ESTILOS REVISADOS ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#191919",
    paddingTop: Platform.OS === 'android' ? 3 : 3, // Ajuste para status bar
  },
  // Contêiner que envolve todos os elementos da barra (Voltar, Input, Limpar)
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    //backgroundColor: "#1e1e1e", // Cor de fundo da barra para contraste
    paddingHorizontal: 10,
    paddingVertical: 20,
    // borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#333",
    marginBottom: 5,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 8,
  },
  clearButton: {
    padding: 5,
    marginLeft: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    //borderBottomWidth: StyleSheet.hairlineWidth,
    //borderBottomColor: "#2b2b2b",
  },
  itemIcon: {
    marginRight: 15,
  },
  textContainer: {
    flexDirection: "column",
    flex: 1, // Permite que o texto se expanda
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