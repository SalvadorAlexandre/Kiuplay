// app/autoSearchBeatScreens/useSearchBeatScreen.tsx
import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import { useTranslation } from "@/src/translations/useTranslation"; // ✅ Hook de idioma

import BeatPulse from "@/components/beatsPulse/useBeatPulse";
import { useMetronome } from "@/hooks/BpmManager/useMetronome";
import { useTapTempo } from "@/hooks/BpmManager/useTapTime";
import { useToneAudioContext } from "@/hooks/BpmManager/useToneAudioContext";
import { useBpmControl } from "@/hooks/BpmManager/useBpmControl";

export default function FindBeatByAcapella() {
  const { t } = useTranslation();
  const router = useRouter();

  /* ――― Estados principais ――― */
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState<number>(4);

  const { bpm, setBpm, increaseBpm, decreaseBpm } = useBpmControl({
    initialBpm: 120,
    minBpm: 40,
    maxBpm: 240,
  });

  const { ensureToneContextStarted } = useToneAudioContext();

  /* ――― Callback do metrônomo ――― */
  const handleMetronomeTick = useCallback((beatIndex: number) => {
    setCurrentBeat(beatIndex);
  }, []);

  /* ――― Hook de metrônomo ――― */
  useMetronome({
    bpm,
    isPlaying,
    onTick: handleMetronomeTick,
    beatsPerMeasure,
  });

  /* ――― Hook Tap Tempo ――― */
  const { handleTap: tapHandler } = useTapTempo({
    onBpmChange: setBpm,
    onToneStartRequest: ensureToneContextStarted,
  });

  /* ――― Play/Stop ――― */
  const handlePlayStop = async () => {
    await ensureToneContextStarted();
    setIsPlaying((p) => !p);
  };

  /* ――― Navegação: Buscar Instrumentais ――― */
  const handleSearchInstrumentals = () => {
    router.push({
      pathname: "/autoSearchBeatScreens/useInstrumentalsResultsScreen",
      params: { bpm: bpm.toString() },
    });
  };

  /* ――― Textos animados ――― */
  const animatedOpacity = useRef(new Animated.Value(1)).current;
  const [currentInstructionText, setCurrentInstructionText] = useState(0);

  const texts = [
    { title: t("screens.autobeat.instructions.tip1"), body: "" },
    { title: t("screens.autobeat.instructions.tip2"), body: "" },
    { title: t("screens.autobeat.instructions.tip3"), body: "" },
  ];

  useEffect(() => {
    let interval: number = 0;

    if (!isPlaying) {
      interval = setInterval(() => {
        Animated.timing(animatedOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          setCurrentInstructionText((prev) => (prev === 0 ? 1 : 0));
          Animated.timing(animatedOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
        });
      }, 5000);
    } else {
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
          title: t("screens.autobeat.title"),
          headerTintColor: "#fff",
          headerStyle: { backgroundColor: "#191C40" },
        }}
      />

      <LinearGradient colors={["#2F3C97", "#191C40"]} style={styles.gradient}>
        {/* BLOCO BPM + bolinhas */}
        <View style={{ alignItems: "center" }}>
          <View style={styles.bpmBox}>
            {/* Valor BPM e botões */}
            <View style={styles.bpmControlRow}>
              <TouchableOpacity onPress={decreaseBpm} style={styles.bpmAdjustButton}>
                <Ionicons name="remove-outline" size={32} color="#fff" />
              </TouchableOpacity>

              <View style={styles.bpmValue}>
                <Text style={styles.bpmNumber}>{bpm}</Text>
                <Text style={styles.bpmLabel}>{t("screens.autobeat.bpmLabel")}</Text>
              </View>

              <TouchableOpacity onPress={increaseBpm} style={styles.bpmAdjustButton}>
                <Ionicons name="add-outline" size={32} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Seleção de Compasso */}
            <View style={styles.timeSignatureControl}>
              {[1, 2, 3, 4].map((beats) => (
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

            {/* Tap tempo */}
            <TouchableOpacity
              style={[styles.tapBtn, isPlaying && styles.disabledTapBtn]}
              onPress={tapHandler}
              disabled={isPlaying}
            >
              <Ionicons name="hand-left" size={32} color="#fff" />
              <Text style={styles.tapText}>{t("screens.autobeat.tapTempo")}</Text>
            </TouchableOpacity>

            {/* Pulsos visuais */}
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
          {/* Botão Play/Stop */}
          <TouchableOpacity
            style={[styles.playBtn, isPlaying && { backgroundColor: "#FF5252" }]}
            onPress={handlePlayStop}
          >
            <Ionicons name={isPlaying ? "stop" : "play"} size={32} color="#fff" />
          </TouchableOpacity>

          {/* Buscar instrumental */}
          <TouchableOpacity
            style={styles.searchInstrumentalBtn}
            onPress={handleSearchInstrumentals}
          >
            <Ionicons name="search" size={24} color="#fff" />
            <Text style={styles.searchInstrumentalText}>
              {t("screens.autobeat.searchButton")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Textos de instrução */}
        <Animated.View style={[styles.instructionBox, { opacity: animatedOpacity }]}>
          {texts[currentInstructionText].title ? (
            <Text style={styles.instructionTitle}>
              {texts[currentInstructionText].title}
            </Text>
          ) : null}
        </Animated.View>
      </LinearGradient>
    </>
  );
}

/* 
✅ Observação:
Ignorando StyleSheet conforme pedido — 
se quiser posso te devolver a versão com os estilos incluídos.
*/

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
