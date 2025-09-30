import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router"; // Adicionado useRouter aqui
import BeatPulse from "@/components/beatsPulse/useBeatPulse";
import { useMetronome } from "@/hooks/BpmManager/useMetronome";
import { useTapTempo } from "@/hooks/BpmManager/useTapTime"; // Mantido conforme sua instrução
import { useToneAudioContext } from "@/hooks/BpmManager/useToneAudioContext";
import { useBpmControl } from "@/hooks/BpmManager/useBpmControl";

export default function FindBeatByAcapella() {
  /* ――― Estados principais ――― */
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);

  // Novo estado para o número de batidas por compasso
  const [beatsPerMeasure, setBeatsPerMeasure] = useState<number>(4); // Padrão 4/4

  // Usa o hook para gerenciar o BPM e suas funções de ajuste
  const { bpm, setBpm, increaseBpm, decreaseBpm } = useBpmControl({
    initialBpm: 120,
    minBpm: 40,
    maxBpm: 240,
  });

  // Usa o hook para gerenciar o contexto de áudio do Tone.js
  const { ensureToneContextStarted } = useToneAudioContext();

  /* ――― Callback para o hook do metrônomo ――― */
  const handleMetronomeTick = useCallback((beatIndex: number) => {
    setCurrentBeat(beatIndex);
  }, []);

  // NOVO: Hook para navegação
  const router = useRouter();

  // NOVO: Função para lidar com o clique no botão "Buscar Instrumental"
  const handleSearchInstrumentals = () => {
    router.push({
      pathname: '/autoSearchBeatScreens/useInstrumentalsScreen', // Rota para a sua nova tela de instrumentais
      params: { bpm: bpm.toString() }, // Passa o BPM atual como parâmetro
    });
  };

  /* ――― Hook do metrônomo (Tone.js) ――― */
  useMetronome({
    bpm,
    isPlaying,
    onTick: handleMetronomeTick,
    beatsPerMeasure, // Passando o compasso para o hook do metrônomo
  });

  // Usa useTapTempo, passando setBpm e a função para iniciar o contexto Tone.js
  const { handleTap: tapHandler } = useTapTempo({
    onBpmChange: setBpm,
    onToneStartRequest: ensureToneContextStarted,
  });

  /* ――― Função para Play / Stop do metrônomo ――― */
  const handlePlayStop = async () => {
    await ensureToneContextStarted(); // Garante que o contexto de áudio esteja ativo
    setIsPlaying((p) => !p); // Apenas alterna o estado de play/pause
  };

  /* ――― Lógica de Animação dos Textos de Instrução ――― */
  const animatedOpacity = useRef(new Animated.Value(1)).current;
  const [currentInstructionText, setCurrentInstructionText] = useState(0);

  const texts = [
    {
      title: "Acelere a busca por instrumentais a seu estilo e economize tempo.",
      body: "",
    },
    {
      title: "Os melhores instrumentais compatíveis com o teu ritmo estão no Kiuplay!",
      body: "",
    },
    {
      title: "Comece a cantar!",
      body: "",
    }
  ];

  useEffect(() => {
    let interval: number = 0; // Tipo corrigido para number

    if (!isPlaying) {
      // Quando o metrônomo está parado, anima entre os dois primeiros textos
      interval = setInterval(() => {
        Animated.timing(animatedOpacity, {
          toValue: 0,
          duration: 500, // Tempo de fade out
          useNativeDriver: true,
        }).start(() => {
          setCurrentInstructionText((prevIndex) => (prevIndex === 0 ? 1 : 0));
          Animated.timing(animatedOpacity, {
            toValue: 1,
            duration: 500, // Tempo de fade in
            useNativeDriver: true,
          }).start();
        });
      }, 5000);
    } else {
      // Quando o metrônomo está tocando, exibe "Comece a cantar!"
      clearInterval(interval);
      Animated.timing(animatedOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setCurrentInstructionText(2);
        Animated.timing(animatedOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    }

    return () => clearInterval(interval);
  }, [isPlaying]);

  /* ――― UI ――― */
  return (
    <>
      <Stack.Screen
        options={{
          title: "Kiuplay Autobeat",
          headerTintColor: "#fff",
          headerStyle: { backgroundColor: "#191C40" },
        }}
      />

      <LinearGradient colors={["#2F3C97", "#191C40"]} style={styles.gradient}>
        {/* BLOCO BPM + bolinhas */}
        <View style={{ alignItems: "center", }}>
          <View style={styles.bpmBox}>
            {/* Valor BPM e botões de ajuste */}
            <View style={styles.bpmControlRow}>
              <TouchableOpacity onPress={decreaseBpm} style={styles.bpmAdjustButton}>
                <Ionicons name="remove-outline" size={32} color="#fff" />
              </TouchableOpacity>

              <View style={styles.bpmValue}>
                <Text style={styles.bpmNumber}>{bpm}</Text>
                <Text style={styles.bpmLabel}>BPM</Text>
              </View>

              <TouchableOpacity onPress={increaseBpm} style={styles.bpmAdjustButton}>
                <Ionicons name="add-outline" size={32} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Seleção de Compasso - APENAS 1/4, 2/4, 3/4, 4/4 */}
            <View style={styles.timeSignatureControl}>
              {[1, 2, 3, 4].map((beats) => ( // AGORA APENAS DE 1 A 4
                <TouchableOpacity
                  key={beats}
                  style={[
                    styles.timeSignatureButton,
                    beatsPerMeasure === beats && styles.timeSignatureButtonActive,
                  ]}
                  onPress={() => setBeatsPerMeasure(beats)}
                >
                  <Text style={styles.timeSignatureText}>{beats}/4</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Botão TAP-tempo */}
            <TouchableOpacity
              style={[
                styles.tapBtn,
                isPlaying && styles.disabledTapBtn
              ]}
              onPress={tapHandler}
              disabled={isPlaying}
            >
              <Ionicons name="hand-left" size={32} color="#fff" />
              <Text style={styles.tapText}>Tap tempo</Text>
            </TouchableOpacity>

            {/* Pulsos Visuais - DINÂMICOS CONFORME O COMPASSO */}
            <View style={styles.pulseRow}>
              {Array.from({ length: beatsPerMeasure }).map((_, i) => (
                <View key={i} style={{ marginHorizontal: 8 }}>
                  <BeatPulse
                    index={i}
                    bpm={bpm}
                    active={isPlaying && currentBeat === i}
                    size={40}
                    color="#fff"
                  />
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={{ alignItems: "center" }}>
          {/* Botão Play / Stop do metrônomo */}
          <TouchableOpacity
            style={[styles.playBtn, isPlaying && { backgroundColor: "#FF5252" }]}
            onPress={handlePlayStop}
          >
            <Ionicons name={isPlaying ? "stop" : "play"} size={32} color="#fff" />
          </TouchableOpacity>

          {/* NOVO BOTÃO: Buscar instrumental */}
          <TouchableOpacity
            style={styles.searchInstrumentalBtn} // Novo estilo para o botão
            onPress={handleSearchInstrumentals} // Função para navegar
          >
            <Ionicons name="search" size={24} color="#fff" />
            <Text style={styles.searchInstrumentalText}>Buscar Instrumental</Text>
          </TouchableOpacity>
        </View>

        {/* Textos de Instrução Animados */}
        <Animated.View style={[styles.instructionBox, { opacity: animatedOpacity }]}>
          {texts[currentInstructionText].title ? (
            <Text style={styles.instructionTitle}>
              {texts[currentInstructionText].title}
            </Text>
          ) : null}
          {texts[currentInstructionText].body ? (
            <Text style={styles.instructionBody}>
              {texts[currentInstructionText].body}
            </Text>
          ) : null}
        </Animated.View>
      </LinearGradient>
    </>
  );
}

/* ---------- Estilos do componente ---------- */
const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingVertical: 25,
    //alignItems: "center",
    width: '100%',
  },

  bpmBox: {
    alignItems: "center",
    width: "95%",
    marginBottom: 10,
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  bpmControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  bpmAdjustButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
    //backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 10,
  },
  bpmValue: {
    alignItems: "center",
  },
  bpmNumber: {
    color: "#fff",
    fontSize: 64,
    fontWeight: "bold",
  },
  bpmLabel: {
    color: "#ccc",
    fontSize: 18,
  },

  pulseRow: {
    flexDirection: "row",
    marginTop: 25,
    justifyContent: 'center',
    width: '100%',
  },

  tapBtn: {
    //flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    backgroundColor: "#1E90FF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    marginTop: 3,
  },
  tapText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
    fontWeight: '500',
  },

  playBtn: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: 'rgba(0,0,0,0.2)',
    justifyContent: "center",
    alignItems: "center",
    //marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  recText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 12,
    fontWeight: 'bold',
  },

  backLink: {
    color: "#ccc",
    marginTop: 30,
    fontSize: 16,
  },
  loadedFileText: {
    color: "#fff",
    marginTop: 15,
    fontSize: 14,
    fontStyle: 'italic',
  },
  // NOVO ESTILO PARA O BOTÃO DESABILITADO
  disabledTapBtn: {
    backgroundColor: '#888', // Uma cor mais escura ou acinzentada para indicar que está desabilitado
    opacity: 0.6, // Reduz a opacidade para reforçar o estado desabilitado
  },

  // NEW STYLE: For time signature selection
  timeSignatureControl: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap', // Allows buttons to wrap to the next line
    marginTop: 15,
    marginBottom: 10,
    width: '100%',
  },
  timeSignatureButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 5,
    marginBottom: 8, // Spacing between button rows
    borderWidth: 1,
    borderColor: 'transparent',
  },
  timeSignatureButtonActive: {
    backgroundColor: '#1E90FF', // Highlight color for active button
    borderColor: '#fff',
  },
  timeSignatureText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  //---------------------------------------------
  instructionBox: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 15, // Adicionado para dar um respiro nas laterais
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.2)', // Fundo para o box de instrução
    alignItems: 'center',
  },
  instructionTitle: {
    color: 'rgb(255, 115, 0)',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5, // Espaçamento entre título e corpo
  },
  instructionBody: {
    color: "#ccc",
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 20,
  },

  // NOVO ESTILO: Botão "Buscar Instrumental"
  searchInstrumentalBtn: {
    flexDirection: "row", // Ícone e texto lado a lado
    alignItems: "center",
    backgroundColor: "#1E90FF", // Cor que se destaque
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginTop: 20, // Espaço entre o botão play/pause e este
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  searchInstrumentalText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
