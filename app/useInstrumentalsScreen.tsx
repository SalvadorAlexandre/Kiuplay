import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router'; // Importe useLocalSearchParams
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Defina a interface para a estrutura de um instrumental (exemplo)
interface Instrumental {
  id: string;
  name: string;
  artist: string;
  bpm: number;
  // Adicione outras propriedades relevantes, como 'audioUrl'
}

export default function InstrumentalsScreen() {
  // Use useLocalSearchParams para obter os parâmetros da rota
  const { bpm } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [instrumentals, setInstrumentals] = useState<Instrumental[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Exemplo de dados de instrumentais (substitua pela sua chamada de API real)
  const mockInstrumentals: Instrumental[] = [
    { id: '1', name: 'Chill Vibes', artist: 'BeatMaster', bpm: 120 },
    { id: '2', name: 'Energetic Flow', artist: 'RhythmKing', bpm: 130 },
    { id: '3', name: 'Smooth Jazz', artist: 'GrooveGuru', bpm: 90 },
    { id: '4', name: 'Trap Anthem', artist: 'ProducerX', bpm: 140 },
    { id: '5', name: 'Acoustic Dreams', artist: 'MelodyMaker', bpm: 100 },
    { id: '6', name: 'Driving Beat', artist: 'TempoPro', bpm: 125 },
    { id: '7', name: 'Uplifting Chords', artist: 'HarmonyHz', bpm: 118 },
    { id: '8', name: 'Lofi Study', artist: 'FocusBeats', bpm: 85 },
  ];

  useEffect(() => {
    // Simulando uma chamada de API para buscar instrumentais
    const fetchInstrumentals = async () => {
      setLoading(true);
      setError(null);
      try {
        const targetBpm = parseFloat(bpm as string); // Converte o BPM de string para número
        const tolerance = 5; // Tolerância de BPM para instrumentais próximos (ex: +/- 5 BPM)

        // Simula o atraso de uma API
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Filtra os instrumentais mockados com base no BPM aproximado
        const filtered = mockInstrumentals.filter(inst =>
          inst.bpm >= (targetBpm - tolerance) && inst.bpm <= (targetBpm + tolerance)
        );

        setInstrumentals(filtered);
      } catch (err) {
        console.error("Erro ao buscar instrumentais:", err);
        setError("Não foi possível carregar os instrumentais.");
      } finally {
        setLoading(false);
      }
    };

    if (bpm) { // Garante que temos um BPM para buscar
      fetchInstrumentals();
    } else {
      setLoading(false);
      setError("Nenhum BPM especificado para a busca.");
    }
  }, [bpm]); // Recarrega os instrumentais se o BPM mudar

  const renderInstrumentalItem = ({ item }: { item: Instrumental }) => (
    <View style={styles.instrumentalItem}>
      <Ionicons name="musical-note" size={24} color="#1E90FF" style={{ marginRight: 10 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.instrumentalName}>{item.name}</Text>
        <Text style={styles.instrumentalArtist}>{item.artist} - {item.bpm} BPM</Text>
      </View>
      <TouchableOpacity style={styles.playButton}>
        <Ionicons name="play" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: `Instrumentais para ${bpm || 'o BPM'}`, // Título dinâmico
          headerTintColor: "#fff",
          headerStyle: { backgroundColor: "#191C40" },
        }}
      />
      <LinearGradient colors={["#2F3C97", "#191C40"]} style={styles.gradient}>
        <Text style={styles.title}>Instrumentais Encontrados:</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#1E90FF" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : instrumentals.length === 0 ? (
          <Text style={styles.noResultsText}>Nenhum instrumental encontrado para este BPM ({bpm}).</Text>
        ) : (
          <FlatList
            data={instrumentals}
            keyExtractor={(item) => item.id}
            renderItem={renderInstrumentalItem}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    width: '100%',
    paddingBottom: 20,
  },
  instrumentalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    width: '100%',
  },
  instrumentalName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  instrumentalArtist: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 2,
  },
  playButton: {
    backgroundColor: '#1E90FF',
    padding: 8,
    borderRadius: 20,
    marginLeft: 'auto', // Empurra o botão para a direita
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  errorText: {
    color: '#FF5252',
    fontSize: 16,
    textAlign: 'center',
  },
  noResultsText: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  }
});