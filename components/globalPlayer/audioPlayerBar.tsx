// components/globalPlayer/audioPlayerBar.tsx
import { usePlayerStore } from '@/src/zustand/usePlayerStore';
import { AudioPlayerContent } from './audioPlayerContent'

/**
 * 2. COMPONENTE PRINCIPAL (O Guardião)
 */
export default function AudioPlayerBar() {
  const { player, currentTrack } = usePlayerStore();

  // Se não houver player ou música, não renderiza nada e não ativa os hooks do filho
  if (!player || !currentTrack) {
    return null;
  }

  // Aqui o player é enviado com segurança para o filho
  return <AudioPlayerContent player={player} />;
}