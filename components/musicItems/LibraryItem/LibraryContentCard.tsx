// components/musicItems/LibraryItem/LibraryContentCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
// Ionicons não é mais necessário aqui, pois os botões foram removidos.
// import { Ionicons } from '@expo/vector-icons';

// NOVO: Importe o tipo genérico LibraryFeedItem (precisamos criar este arquivo de tipos)
import { LibraryFeedItem } from '@/src/types/library'; // Ajuste o caminho conforme seu projeto

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width / 2) - 30; // Largura de cada item (metade da tela - margens)

// NOVO: Interface para as props do componente, usando o tipo genérico
interface LibraryContentCardProps {
  item: LibraryFeedItem; // Agora aceita o tipo genérico
  onPress: (item: LibraryFeedItem) => void; // A função de clique agora recebe o item completo
  // As props onToggleFavorite, isFavorited, isCurrent foram removidas
}

export default function LibraryContentCard({
  item, // NOVO: Recebe o item completo
  onPress,
}: LibraryContentCardProps) {
  let coverSource;
  let titleText;
  let subtitleText;

  // NOVO: Lógica para determinar a capa, título e subtítulo com base no tipo do item
  if (item.type === 'single' || item.type === 'album' || item.type === 'ep') {
    // Para Singles, Álbuns, EPs (que são tipos de 'Track' ou similares com capa/artista)
    const musicItem = item as any; // Cast temporário para acessar propriedades comuns
    coverSource = musicItem.cover
      ? { uri: musicItem.cover }
      : require('@/assets/images/Default_Profile_Icon/unknown_track.png');
    titleText = musicItem.title;
    subtitleText = musicItem.artist;
  } else if (item.type === 'artist') {
    // Para Artistas
    const artistItem = item as any; // Cast temporário
    coverSource = artistItem.avatar
      ? { uri: artistItem.avatar }
      : require('@/assets/images/Default_Profile_Icon/unknown_artist.png');
    titleText = artistItem.name;
    subtitleText = 'Artista'; // Ou um campo de estilo/gênero do artista
  } else if (item.type === 'playlist') {
    // Para Playlists
    const playlistItem = item as any; // Cast temporário
    coverSource = playlistItem.cover
      ? { uri: playlistItem.cover }
      : require('@/assets/images/Default_Profile_Icon/kiuplayDefault.png');
    titleText = playlistItem.name;
    subtitleText = `Por ${playlistItem.creator}`;
  } else {
    // Fallback para tipos desconhecidos
    coverSource = require('@/assets/images/Default_Profile_Icon/unknown_track.png');
    titleText = 'Conteúdo Desconhecido';
    subtitleText = '';
  }

  return (
    <TouchableOpacity style={styles.columnItemContainer} onPress={() => onPress(item)}> {/* NOVO: Passa o item completo no onPress */}
      <Image source={coverSource} style={styles.columnMusicCover} />
      <Text style={styles.columnMusicTitle} numberOfLines={1}>
        {titleText}
      </Text>
      <Text style={styles.columnMusicArtist} numberOfLines={1}>
        {subtitleText}
      </Text>
      {/* Os botões de ação foram removidos, então não há mais columnActionsContainer aqui */}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Estilos do layout horizontal (original) - Manter se ainda for usar em algum lugar, caso contrário, remover
  musicItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#282828',
    borderRadius: 8,
    marginHorizontal: 15,
  },
  musicCover: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 10,
  },
  musicDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  musicTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  musicArtist: {
    color: '#aaa',
    fontSize: 13,
  },

  // Estilos para o layout em duas colunas (ajustados)
  columnItemContainer: {
    width: ITEM_WIDTH,
    backgroundColor: '#282828',
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  columnMusicCover: {
    width: '100%',
    height: ITEM_WIDTH,
    borderRadius: 4,
    marginBottom: 8,
  },
  columnMusicTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    width: '100%',
  },
  columnMusicArtist: {
    color: '#aaa',
    fontSize: 12,
    width: '100%',
    marginBottom: 8,
  },
  // Os estilos de botões e container de ações foram removidos
});