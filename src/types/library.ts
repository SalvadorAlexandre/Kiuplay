// src/types/library.ts (NOVO ARQUIVO)
import { Track } from '@/src/redux/playerSlice'; // Importa a interface Track existente

// A interface 'Track' já é um 'single' por padrão, então podemos estendê-la
// ou simplesmente usá-la como um dos tipos da união.
// Para clareza, vamos adicionar 'type: "single"' à Track em playerSlice.ts se ainda não o fizemos.
// Se Track já tem 'type?: "single"', então não precisa de uma nova interface Single.

// Interface para um Álbum ou EP
export interface AlbumOrEP {
  id: string;
  title: string;
  artist: string; // Artista principal do álbum/EP
  cover: string; // URL para a capa do álbum/EP
  type: 'album' | 'ep'; // Tipo de conteúdo
  releaseDate?: string;
  trackIds?: string[]; // IDs das faixas que compõem o álbum/EP
  genre: string; // NOVO: Adicionado para o gênero
  viewsNumber?: number;
  // Adicione outras propriedades relevantes para álbuns/EPs
}

export interface ExtendedPlayEP {
  id: string;
  title: string;
  artist: string; // Artista principal do álbum/EP
  cover: string; // URL para a capa do álbum/EP
  type: 'album' | 'ep'; // Tipo de conteúdo
  releaseDate?: string;
  trackIds?: string[]; // IDs das faixas que compõem o álbum/EP
  genre: string; // NOVO: Adicionado para o gênero
  viewsNumber?: number;
  // Adicione outras propriedades relevantes para álbuns/EPs
}

// Interface para um Perfil de Artista
export interface ArtistProfile {
  id: string;
  name: string; // Nome do artista
  avatar: string; // URL para o avatar do artista
  type: 'artist'; // Tipo de conteúdo
  bio?: string;
  genres?: string[];
  followersCount?: number;
  // Adicione outras propriedades relevantes para artistas
}

// Interface para uma Playlist
export interface Playlist {
  id: string;
  name: string; // Nome da playlist
  creator: string; // Criador da playlist
  cover: string; // URL para a capa da playlist
  type: 'playlist'; // Tipo de conteúdo
  description?: string;
  trackIds?: string[]; // IDs das faixas na playlist
  // Adicione outras propriedades relevantes para playlists
}

// Interface para um Beat (instrumental da BeatStore)
export interface Beat {
  id: string;
  title: string;
  artist: string;
  cover: string; // Capa do beat
  audioUrl: string; // Caminho para o arquivo de áudio
  genre: string;
  bpm?: number;
  price?: number;
  isFree?: boolean;
  duration?: number;
  type: 'beat'; // <- Diferencia este tipo
  source: 'beatstore-feeds' | 'beatstore-curtidas' | 'beatstore-seguindo';
}

export interface Single extends Track {
  type: 'single';
  source: 'library-local' | 'library-cloud-feeds' | 'library-cloud-curtidas' | 'library-cloud-seguindo';
}

// Tipo de União para qualquer item que possa aparecer no feed da Library Cloud
export type LibraryFeedItem = Single | AlbumOrEP | ArtistProfile | Playlist;

// NOVO: Adicione 'type?: "single"' à interface Track em src/redux/playerSlice.ts
// Se você ainda não fez isso, por favor, abra src/redux/playerSlice.ts
// e adicione `type?: 'single';` à interface Track.
// Isso é importante para que o 'item.type' seja reconhecido para Singles.
/*
// Exemplo de como Track deve ficar em src/redux/playerSlice.ts
export interface Track {
  id: string;
  uri: string;
  title: string;
  artist: string;
  cover: string;
  artistAvatar?: string;
  duration?: number;
  size?: number;
  mimeType?: string;
  source: 'library-local' | 'library-cloud-feeds' | 'library-cloud-curtidas' | 'library-cloud-seguindo' | 'beatstore-feeds' | 'beatstore-curtidas' | 'beatstore-seguindo' | 'unknown';
  type?: 'single'; // <--- ADICIONE ESTA LINHA
  genre?: string; // NOVO: Adicionado para o gênero
}
*/