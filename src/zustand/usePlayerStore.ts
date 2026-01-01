//src/zustand/usePlayerStore.ts
import { create } from 'zustand';
import { createAudioPlayer, AudioPlayer } from 'expo-audio';
import { shuffleArray } from '@/src/utils/arrayUtils';
import { PlayableContent } from '@/src/types/contentType';

// Definição do tipo Track conforme solicitado
export type Track = PlayableContent;

interface PlayerState {
    player: AudioPlayer | null;
    currentTrack: Track | null;
    queue: Track[];          // Fila que está sendo lida no momento
    originalQueue: Track[];  // Backup da ordem original
    currentIndex: number;
    isPlaying: boolean;
    isExpanded: boolean;
    isShuffle: boolean;
    repeatMode: 'off' | 'track' | 'all';

    // Actions
    loadQueue: (tracks: Track[], startIndex: number) => void;
    loadTrack: (index: number) => void;
    togglePlay: () => void;
    playNext: () => void;
    playPrevious: () => void;
    toggleShuffle: () => void;
    setRepeatMode: (mode: 'off' | 'track' | 'all') => void;
    toggleExpanded: () => void;
    seekTo: (millis: number) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
    player: null,
    currentTrack: null,
    queue: [],
    originalQueue: [],
    currentIndex: -1,
    isPlaying: false,
    isExpanded: false,
    isShuffle: false,
    repeatMode: 'off',

    loadQueue: (tracks: Track[], startIndex = 0) => {
        set({
            originalQueue: [...tracks],
            queue: [...tracks],
            currentIndex: startIndex,
            isShuffle: false
        });
        get().loadTrack(startIndex);
    },

    loadTrack: (index: number) => {
        const { queue, player: oldPlayer } = get();
        const track = queue[index];

        if (!track) return;

        if (oldPlayer) {
            oldPlayer.pause();
            //oldPlayer.release()
            //oldPlayer.removeListener('playbackStatusUpdate', (status))
            // No SDK 53+, listeners são limpos automaticamente ao substituir o player,
            // mas pausar evita sobreposição de áudio em transições rápidas.
        }

        // Supondo que PlayableContent utilize 'uri' ou 'url' para o arquivo
        const trackSource = track.uri;
        if (!trackSource) {
            console.error("Track sem fonte de áudio válida");
            return;
        }

        const newPlayer = createAudioPlayer(trackSource);

        newPlayer.addListener('playbackStatusUpdate', (status) => {
            const { repeatMode, playNext } = get();

            // Sincroniza o estado de reprodução global
            set({ isPlaying: status.playing });

            if (status.playbackState === 'finished') {
                if (repeatMode === 'track') {
                    newPlayer.seekTo(0);
                    newPlayer.play();
                } else {
                    playNext();
                }
            }
        });

        set({
            player: newPlayer,
            currentTrack: track,
            currentIndex: index,
            isPlaying: true
        });

        newPlayer.play();
    },

    toggleShuffle: () => {
        const { isShuffle, originalQueue, currentTrack } = get();
        const nextShuffleState = !isShuffle;

        if (nextShuffleState) {
            // Ativando Shuffle
            let shuffled = shuffleArray(originalQueue);

            // Mantém a track atual no topo da nova lista
            if (currentTrack) {
                shuffled = [
                    currentTrack,
                    ...shuffled.filter(t => t.id !== currentTrack.id)
                ];
            }

            set({
                isShuffle: true,
                queue: shuffled,
                currentIndex: 0
            });
        } else {
            // Desativando Shuffle: restaura ordem original
            const originalIndex = originalQueue.findIndex(t => t.id === currentTrack?.id);

            set({
                isShuffle: false,
                queue: [...originalQueue],
                currentIndex: originalIndex !== -1 ? originalIndex : 0
            });
        }
    },

    playNext: () => {
        const { currentIndex, queue, repeatMode } = get();
        const nextIndex = currentIndex + 1;

        if (nextIndex < queue.length) {
            get().loadTrack(nextIndex);
        } else if (repeatMode === 'all' && queue.length > 0) {
            get().loadTrack(0);
        }
    },

    playPrevious: () => {
        const { currentIndex, player } = get();

        // Se a música passou de 3s, apenas reinicia ela
        if (player && (player.currentTime > 3000)) {
            player.seekTo(0);
        } else if (currentIndex > 0) {
            get().loadTrack(currentIndex - 1);
        }
    },

    togglePlay: () => {
        const { player } = get();
        if (!player) return;
        player.playing ? player.pause() : player.play();
    },


    setRepeatMode: (mode) => set({ repeatMode: mode }),

    toggleExpanded: () => set((state) => ({ isExpanded: !state.isExpanded })),

    seekTo: (millis: number) => {
        const { player } = get();
        player?.seekTo(millis);
    }
}));