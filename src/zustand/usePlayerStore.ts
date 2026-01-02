//src/zustand/usePlayerStore.ts
import { create } from 'zustand';
import { createAudioPlayer, AudioPlayer } from 'expo-audio';
import { shuffleArray } from '@/src/utils/arrayUtils';
import { PlayableContent } from '@/src/types/contentType';

export type Track = PlayableContent;

interface PlayerState {
    player: AudioPlayer | null;
    queue: Track[];
    originalQueue: Track[];
    currentIndex: number;
    currentTrack: Track | null;
    isExpanded: boolean;
    isShuffle: boolean;
    repeatMode: 'off' | 'track' | 'all';
    isLoading: boolean;

    // Actions
    loadQueue: (tracks: Track[], startIndex?: number) => void;
    loadTrack: (index: number) => void;
    togglePlay: () => void;
    playNext: () => void;
    playPrevious: () => void;
    toggleShuffle: () => void;
    setRepeatMode: (mode: 'off' | 'track' | 'all') => void;
    toggleExpanded: () => void;
    seekTo: (seconds: number) => void;
    releasePlayer: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
    player: null,
    queue: [],
    originalQueue: [],
    currentIndex: -1,
    currentTrack: null,
    isExpanded: false,
    isShuffle: false,
    repeatMode: 'off',
    isLoading: false,

    setLoading: (loading: boolean) => set({ isLoading: loading }),


    loadQueue: (tracks, startIndex = 0) => {
        set({
            queue: [...tracks],
            originalQueue: [...tracks],
            currentIndex: startIndex,
            isShuffle: false,
        });
        get().loadTrack(startIndex);
    },

    loadTrack: (index) => {
        const status = get();
        const track = status.queue[index];

        if (!track || !track.uri) return;

        // Se já existe um player, apenas trocamos a fonte e o loop
        if (status.player) {
            console.log("[DEBUG] Reutilizando player e mantendo listener ativo");
            status.player.pause();
            status.player.replace(track.uri);
            status.player.loop = status.repeatMode === 'track'; // Aplica loop nativo

            set({ currentTrack: track, currentIndex: index });
            status.player.play();
            return;
        }

        // --- CRIAÇÃO INICIAL (Apenas uma vez) ---
        const newPlayer = createAudioPlayer(track.uri);

        set({
            player: newPlayer,
            currentTrack: track,
            currentIndex: index,
        });

        newPlayer.loop = status.repeatMode === 'track';
        newPlayer.play();
    },

    togglePlay: () => {
        const { player } = get();
        if (!player) return;
        // 'playing' é uma propriedade booleana nativa do AudioPlayer
        player.playing ? player.pause() : player.play();
    },

    playNext: () => {
        const { currentIndex, queue, repeatMode, releasePlayer } = get();
        const nextIndex = currentIndex + 1;

        if (nextIndex < queue.length) {
            get().loadTrack(nextIndex);
        } else if (repeatMode === 'all') {
            get().loadTrack(0);
        } else {
            console.log('Fim da playlist')
            releasePlayer()
        }
    },

    playPrevious: () => {
        const { player, currentIndex } = get();
        // A documentação diz que currentTime é em segundos (number)
        if (player && player.currentTime > 3) {
            player.seekTo(0);
        } else if (currentIndex > 0) {
            get().loadTrack(currentIndex - 1);
        }
    },

    seekTo: (seconds) => {
        get().player?.seekTo(seconds);
    },

    toggleShuffle: () => {
        const { isShuffle, originalQueue, currentTrack } = get();
        if (!isShuffle) {
            let shuffled = shuffleArray(originalQueue);
            if (currentTrack) {
                shuffled = [currentTrack, ...shuffled.filter(t => t.id !== currentTrack.id)];
            }
            set({ isShuffle: true, queue: shuffled, currentIndex: 0 });
        } else {
            const index = originalQueue.findIndex(t => t.id === currentTrack?.id);
            set({ isShuffle: false, queue: [...originalQueue], currentIndex: index >= 0 ? index : 0 });
        }
    },

    setRepeatMode: (mode) => {
        const { player } = get();
        set({ repeatMode: mode });
        // Se quiser usar o loop nativo do hardware para uma única música:
        if (player) player.loop = (mode === 'track');
    },

    releasePlayer: () => {
        const { player } = get();
        player?.remove(); // Limpa da memória
        set({ player: null, currentTrack: null });
    },

    toggleExpanded: () => set(state => ({ isExpanded: !state.isExpanded })),
}));






{/**
    
    loadTrack: (index) => {
        const status = get(); // Pegando o estado atual completo
        const existingPlayer = status.player;
        const track = status.queue[index];

        existingPlayer?.loop == true

        console.log(`[DEBUG] Tentando carregar faixa no índice: ${index}`);
        console.log(`[DEBUG] Player existente:`, existingPlayer ? "SIM (ID: " + existingPlayer.id + ")" : "NÃO (null)");

        if (!track || !track.uri) {
            console.error("[DEBUG] Erro: Track inválida ou sem URI", track);
            return;
        }

        // --- LÓGICA DE SUBSTITUIÇÃO (REPLACE) ---
        if (existingPlayer) {
            console.log("[DEBUG] Ação: Executando .replace() para:", track.title);

            // Segurança extrema para Web: Pausa antes de trocar
            existingPlayer.pause();

            try {
                existingPlayer.replace(track.uri);

                set({
                    currentTrack: track,
                    currentIndex: index
                });

                existingPlayer.play();
                console.log("[DEBUG] Sucesso: Replace executado e play() chamado.");
                return;
            } catch (error) {
                console.error("[DEBUG] Falha no replace, tentando recriar player:", error);
                existingPlayer.remove();
            }
        }

        // --- LÓGICA DE CRIAÇÃO (APENAS SE NÃO HOUVER PLAYER) ---
        console.log("[DEBUG] Ação: Criando nova instância para:", track.title);
        const newPlayer = createAudioPlayer(track.uri);

        newPlayer.addListener('playbackStatusUpdate', (s) => {
            if (s.playbackState === 'finished') {
                console.log("[DEBUG] Evento: Música finalizada.");
                const currentState = get();
                if (currentState.repeatMode === 'track') {
                    newPlayer.seekTo(0);
                    newPlayer.play();
                } else {
                    currentState.playNext();
                }
            }
        });

        set({
            player: newPlayer,
            currentTrack: track,
            currentIndex: index,
        });

        newPlayer.play();
    },


    */}