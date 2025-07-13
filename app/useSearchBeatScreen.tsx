import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Vibration,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, Stack } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import * as Tone from "tone";

import BeatPulse from "@/components/beatsPulse/useBeatPulse";
import { useMetronome } from "@/hooks/useMetronome";

export default function FindBeatByAcapella() {
  /* ――― Estados principais ――― */
  const [bpm, setBpm] = useState<number>(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  // O estado 'playMode' não é mais necessário, pois os botões de rádio foram removidos.
  // const [playMode, setPlayMode] = useState<"metro" | "voice" | "both">("metro");

  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [audioFileName, setAudioFileName] = useState<string | null>(null);

  const router = useRouter();

  const [isToneContextStarted, setIsToneContextStarted] = useState(false);

  /* ――― Callback para o hook do metrônomo ――― */
  const handleMetronomeTick = useCallback(() => {
    setCurrentBeat((prev) => (prev + 1) % 4);
  }, []);

  /* ――― Hook do metrônomo (Tone.js) ――― */
  useMetronome(bpm, isPlaying, handleMetronomeTick);

  /* ――― Tap-tempo – descobre BPM ――― */
  const [tapTimes, setTapTimes] = useState<number[]>([]);
  const handleTap = () => {
    Vibration.vibrate(15);
    const now = Date.now();
    setTapTimes((prev) => {
      const times = [...prev, now].slice(-6);
      if (times.length >= 2) {
        const diffs = times
          .slice(1)
          .map((t, i) => t - times[i])
          .filter((d) => d > 150);
        if (diffs.length) {
          const avg = diffs.reduce((s, v) => s + v) / diffs.length;
          setBpm(Math.round(60000 / avg));
        }
      }
      return times;
    });
  };

  /* ――― Carregar / limpar áudio ――― */
  const pickAudio = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
        copyToCacheDirectory: true,
      });

      if (res.canceled) {
        console.log("Seleção de áudio cancelada.");
        return;
      }

      const asset = res.assets?.[0];
      if (!asset) {
        console.log("Nenhum ativo de áudio selecionado.");
        return;
      }

      setAudioUri(asset.uri);
      setAudioFileName(asset.name);
      console.log("Áudio carregado:", asset.name, asset.uri);
    } catch (error) {
      console.error("Erro ao carregar áudio:", error);
    }
  };

  /* ――― Função para Play / Stop do metrônomo ――― */
  const handlePlayStop = async () => {
    if (!isToneContextStarted) {
      try {
        await Tone.start();
        setIsToneContextStarted(true);
        console.log("Contexto de áudio do Tone.js iniciado pela interação do usuário.");
      } catch (error) {
        console.error("Falha ao iniciar o contexto de áudio do Tone.js:", error);
        return;
      }
    }
    setIsPlaying((p) => !p);
  };

  /* ――― UI ――― */
  return (
    <>
      <Stack.Screen
        options={{
          title: "Encontrar Beat",
          headerTintColor: "#fff",
          headerStyle: { backgroundColor: "#191C40" },
        }}
      />

      <LinearGradient colors={["#2F3C97", "#191C40"]} style={styles.gradient}>
        {/* BLOCO BPM + bolinhas */}
        <View style={styles.bpmBox}>
          {/* Valor BPM */}
          <View style={styles.bpmValue}>
            <Text style={styles.bpmNumber}>{bpm}</Text>
            <Text style={styles.bpmLabel}>BPM</Text>
          </View>

          {/* Botão TAP-tempo (agora no lugar dos rádio-buttons) */}
          <TouchableOpacity style={styles.tapBtn} onPress={handleTap}>
            <Ionicons name="hand-left" size={42} color="#fff" />
            <Text style={styles.tapText}>Tap tempo</Text>
          </TouchableOpacity>

          {/* Pulsos 4/4 (bolinhas visuais do metrônomo) */}
          <View style={styles.pulseRow}>
            {Array.from({ length: 4 }).map((_, i) => (
              <View key={i} style={{ marginHorizontal: 18 }}>
                <BeatPulse
                  index={i}
                  bpm={bpm}
                  active={isPlaying && currentBeat === i}
                  size={50}
                  color="#fff"
                />
              </View>
            ))}
          </View>

          {/* Nome do arquivo de áudio carregado (visível se audioUri existir) */}
          {audioFileName && (
            <Text style={styles.loadedFileText} numberOfLines={1}>
              Arquivo carregado:{" "}
              <Text style={styles.fileNameText}>{audioFileName}</Text>
            </Text>
          )}
        </View>

        {/* Botão Carregar / Remover áudio */}
        <TouchableOpacity
          style={styles.recBtn}
          onPress={() => {
            if (audioUri) {
              setAudioUri(null);
              setAudioFileName(null);
            } else {
              pickAudio();
            }
          }}
        >
          <Ionicons
            name={audioUri ? "trash" : "cloud-upload"}
            size={24}
            color="#fff"
          />
          <Text style={styles.recText}>
            {audioUri ? "Descarregar áudio" : "Carregar áudio"}
          </Text>
        </TouchableOpacity>

        {/* Botão Play / Stop do metrônomo (agora no lugar do botão Tap-Tempo) */}
        <TouchableOpacity
          style={[
            styles.playBtn,
            isPlaying && { backgroundColor: "#FF5252" },
          ]}
          onPress={handlePlayStop}
        >
          <Ionicons name={isPlaying ? "stop" : "play"} size={24} color="#fff" />
          {/*<Text style={styles.recText}>{isPlaying ? "Parar" : "Play"}</Text>*/}
        </TouchableOpacity>

        {/* Botão Voltar (visível apenas se não houver áudio carregado) */}
        {!audioUri && (
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>◀ Voltar</Text>
          </TouchableOpacity>
        )}
      </LinearGradient>
    </>
  );
}

/* ---------- Estilos do componente ---------- */
const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingVertical: 25,
    alignItems: "center",
    width: '100%',
  },

  /* BPM & rádios (antigo - agora apenas BPM Box) */
  bpmBox: {
    alignItems: "center",
    width: "90%",
    marginBottom: 30,
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  bpmValue: {
    alignItems: "center",
    marginBottom: 15,
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

  // Os estilos bpmButtons, bpmBtn, bpmBtnActive, bpmBtnText foram removidos.
  // bpmButtons: { flexDirection: "row", marginTop: 16, justifyContent: "space-between", width: "100%", },
  // bpmBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#2f4fad", paddingVertical: 12, marginHorizontal: 6, borderRadius: 25, opacity: 0.7, },
  // bpmBtnActive: { opacity: 1, borderWidth: 2, borderColor: "#1E90FF", backgroundColor: "#1E90FF", },
  // bpmBtnText: { color: "#fff", marginLeft: 8, fontSize: 14, fontWeight: 'bold', },

  /* Bolinhas de pulso */
  pulseRow: {
    flexDirection: "row",
    marginTop: 25,
    justifyContent: 'center',
    width: '100%',
  },

  /* Tap-tempo */
  // Este estilo agora é aplicado ao novo local do botão TAP-tempo
  tapBtn: {
    flexDirection: "row",
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
  },
  tapText: {
    color: "#fff",
    fontSize: 18,
    marginTop: 10,
    textAlign: "center",
    fontWeight: '500',
  },

  /* Carregar áudio */
  recBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    backgroundColor: "#00C853",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  recText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 12,
    fontWeight: 'bold',
  },

  /* Play / Stop */
  // Este estilo agora é aplicado ao novo local do botão Play/Stop
  playBtn: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  /* Outros */
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
  fileNameText: {
    fontWeight: "bold",
    color: "#fff",
  },
});
