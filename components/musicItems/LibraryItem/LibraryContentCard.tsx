// components/musicItems/LibraryItem/LibraryContentCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, } from 'react-native';
import { LibraryFeedItem, AlbumOrEP, ArtistProfile, Playlist } from '@/src/types/library';
import { Track } from '@/src/redux/playerSlice';
import { useAppSelector } from '@/src/redux/hooks'; // NOVO: Importe o hook useAppSelector do Redux


interface LibraryContentCardProps {
  item: LibraryFeedItem;
  onPress: (item: LibraryFeedItem) => void;
}

export default function LibraryContentCard({
  item,
  onPress,
}: LibraryContentCardProps) {
  // NOVO: Lê o status de conexão do Redux global
  // Se isConnected for null (ainda não verificado na inicialização), trataremos como "sem conexão" para exibir a imagem padrão.
  const isConnected = useAppSelector((state) => state.network.isConnected);

  let coverSource;
  let titleText;
  let subtitleText;
  let genreText: string | undefined;
  let categoryText: string | undefined;
  let typeLabel: string | undefined;

  // Função auxiliar para determinar a fonte da imagem
  const getDynamicCoverSource = (coverUrl: string | undefined | null, defaultImage: any) => {
    // Condição para exibir a imagem padrão:
    // 1. Se isConnected é false (sem conexão) ou null (status inicial desconhecido)
    // 2. OU se a coverUrl não existe (null/undefined)
    // 3. OU se a coverUrl é uma string vazia (após remover espaços)
    if (isConnected === false || coverUrl === null || coverUrl === undefined || coverUrl.trim() === '') {
      return defaultImage;
    }
    // Caso contrário, tenta carregar a imagem da URL
    return { uri: coverUrl };
  };

  // Lógica para determinar a coverSource, título e subtítulo com base no tipo do item
  if (item.type === 'single' || item.type === 'album' || item.type === 'ep') {
    const musicItem = item as Track | AlbumOrEP;
    coverSource = getDynamicCoverSource(
      musicItem.cover,
      require('@/assets/images/Default_Profile_Icon/unknown_track.png')
    );
    titleText = musicItem.title;
    subtitleText = musicItem.artist;
    genreText = musicItem.genre;
    categoryText = musicItem.type!.charAt(0).toUpperCase() + musicItem.type!.slice(1);
  } else if (item.type === 'artist') {
    const artistItem = item as ArtistProfile;
    coverSource = getDynamicCoverSource(
      artistItem.avatar,
      require('@/assets/images/Default_Profile_Icon/unknown_artist.png')
    );
    titleText = artistItem.name;
    subtitleText = artistItem.genres?.join(', ') || '';
    typeLabel = 'Artista';
  } else if (item.type === 'playlist') {
    const playlistItem = item as Playlist;
    coverSource = getDynamicCoverSource(
      playlistItem.cover,
      require('@/assets/images/Default_Profile_Icon/kiuplayDefault.png')
    );
    titleText = playlistItem.name;
    subtitleText = `Por ${playlistItem.creator}`;
    typeLabel = 'Playlist';
  } else {
    // Para tipos de item desconhecidos, sempre exibe a imagem padrão de unknown_track
    coverSource = require('@/assets/images/Default_Profile_Icon/unknown_track.png');
    titleText = 'Conteúdo Desconhecido';
    subtitleText = '';
  }


  return (
    <TouchableOpacity style={styles.cardContainer} onPress={() => onPress(item)}>
      {/* NOVO: Imagem de background desfocada (Primeiro filho para ficar na base) */}
      <Image
        source={coverSource}
        style={styles.blurredBackground}
        blurRadius={10} // Nível de desfoque
        resizeMode="cover" // Garante que a imagem cubra o espaço
      />
      {/* NOVO: Overlay para escurecer o background (Segundo filho para ficar sobre o background) */}
      <View style={styles.overlay} />

      {/* MANTIDO: A estrutura original do seu conteúdo principal,
          com ajustes de zIndex e cor de fundo para permitir o desfoque */}
      <View style={[styles.mainContentWrapper, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
        <Image source={coverSource} style={styles.cardCoverImage} />
      </View>

      <View style={styles.musicDetails}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {titleText}
        </Text>
        <Text style={styles.cardSubtitle} numberOfLines={1}>
          {subtitleText}
        </Text>

        {genreText && (item.type === 'single' || item.type === 'album' || item.type === 'ep') && (
          <Text style={styles.cardGenreText} numberOfLines={1}>
            Gênero: {genreText}
          </Text>
        )}

        {categoryText && (item.type === 'single' || item.type === 'album' || item.type === 'ep') && (
          <Text style={styles.cardCategoryText} numberOfLines={1}>
            {categoryText}
          </Text>
        )}
        {typeLabel && (item.type === 'playlist' || item.type === 'artist') && (
          <Text style={styles.cardTypeLabelText} numberOfLines={1}>
            {typeLabel}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    height: 250, // MANTIDO
    marginHorizontal: 3, // MANTIDO
    marginBottom: 10, // MANTIDO
    backgroundColor: '#282828', // MANTIDO
    borderRadius: 8, // MANTIDO
    padding: 7, // MANTIDO
    overflow: 'hidden', // NOVO: ESSENCIAL para cortar o background desfocado com o borderRadius
    position: 'relative', // NOVO: ESSENCIAL para que os elementos posicionados absolutamente funcionem
  },
  // NOVO: Estilo para a imagem de background desfocada
  blurredBackground: {
    ...StyleSheet.absoluteFillObject, // Posiciona a imagem para preencher todo o container pai (cardContainer)
    zIndex: 0, // Garante que fique na camada mais baixa
  },
  // NOVO: Estilo para o overlay escuro sobre o background desfocado
  overlay: {
    ...StyleSheet.absoluteFillObject, // Preenche todo o container
    backgroundColor: 'rgba(0,0,0,0.5)', // Cor preta com 50% de opacidade
    zIndex: 1, // Fica sobre o background, mas abaixo do conteúdo principal
  },
  // NOVO: Wrapper para o conteúdo principal da imagem, com zIndex para sobreposição
  mainContentWrapper: {
    backgroundColor: 'rgba(255,255,255,0.05)', // Fundo semi-transparente para ver o desfoque
    flex: 1, // MANTIDO: Ocupa o espaço flexível
    borderRadius: 8, // MANTIDO
    padding: 5, // MANTIDO
    zIndex: 2, // NOVO: Garante que este conteúdo fique acima do overlay e do background
  },
  musicDetails: {
    // flex: 1, // MANTIDO (se estava no seu código real)
    justifyContent: 'center', // MANTIDO
    zIndex: 2, // NOVO: Garante que os detalhes da música fiquem acima do overlay e do background
  },
  cardCoverImage: {
    width: '100%', // MANTIDO
    height: '100%', // MANTIDO
    borderRadius: 8, // MANTIDO
    // marginBottom: 8, // MANTIDO
  },
  cardTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
    width: '100%',
  },
  cardSubtitle: {
    color: '#aaa',
    fontSize: 12,
    width: '100%',
    marginBottom: 2,
  },
  cardCategoryText: {
    color: '#bbb',
    fontSize: 11,
    width: '100%',
    marginBottom: 2,
  },
  cardGenreText: {
    color: '#bbb',
    fontSize: 11,
    width: '100%',
  },
  cardTypeLabelText: {
    color: '#999',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 4,
    width: '100%',
  },
});