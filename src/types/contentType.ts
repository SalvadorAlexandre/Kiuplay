// src/types/contentType.ts

// Interface para um Perfil de Artista
export interface ArtistProfile {
    id: string;
    name: string; // Saag weelli boy
    username: string //'@saag_swb_oficial'
    avatar: string; // URL para o avatar do artista
    category: 'artist'; // Tipo de conteúdo
    bio?: string;
    genres?: string[];
    followersCount?: number;
    followingCount?: number
    singlesCount?: number,
    epsCount?: number
    albumsCount?: number
    videosCount?: number // Novo campo para vídeos
    hasMonetizationEnabled?: boolean // Novo campo para monetização
    releaseYear: string;
}

export interface Single {
    id: string; // ID único para a chave da FlatList e identificação
    uri: string; // O URI do arquivo de áudio (local ou remoto)
    title: string;
    artist: string;
    artistAvatar?: string;
    producer?: string
    feat?: string[]
    cover: string; // URL ou URI para a imagem da capa
    duration?: number;
    size?: number;
    favoritesCount?: number
    commentCount?: number
    shareCount?: number
    viewsCount?: number;
    mimeType?: string;
    genre: string; // NOVO: Adicionado para o gênero
    releaseYear: string; // Propriedade para ano de lançamento
    category: 'single'; // Categoria específica
    source: 'library-local' | 'library-cloud-feeds' | 'library-cloud-favorites';
}

// Interface para um EP
export interface ExtendedPlayEP {
    id: string;
    title: string;
    artist: string; // Artista principal do EP
    artistAvatar?: string;
    cover: string | null; // URL para a capa do EP
    category: 'ep'; // Tipo de conteúdo
    tracks: Single[]; // IDs das faixas que compõem a EP
    mainGenre: string; // NOVO: Adicionado para o gênero
    viewsCount?: number;
    favoritesCount?: number
    commentCount?: number
    shareCount?: number
    releaseYear: string;
    source?: 'library-local' | 'library-cloud-feeds' | 'library-cloud-favorites'
}

// Interface para um Álbum
export interface Album {
    id: string;
    title: string;
    artist: string; // Artista principal do álbum
    cover: string; // URL para a capa do álbum
    category: 'album'; // Tipo de conteúdo
    releaseDate: string;
    tracks: Single[]; // IDs das faixas que compõem o álbum
    mainGenre: string; // NOVO: Adicionado para o gênero
    viewsCount?: number;
    favoritesCount?: number
    commentCount?: number
    shareCount?: number
    releaseYear: string;
    source: 'library-local' | 'library-cloud-feeds' | 'library-cloud-curtidas' | 'library-cloud-seguindo';
}

// Interface para uma Playlist (O utilizador pedera criar playlists e adicionar musicas)
export interface Playlist {
    id: string;
    name: string; // Nome da playlist
    creator: string; // Criador da playlist
    cover: string; // URL para a capa da playlist
    category: 'playlist'; // Tipo de conteúdo
    tracks: Single[]; // IDs das faixas na playlist
    releaseYear: string;
}

// Interface para um Beat Exclusivo (da BeatStore)
export interface ExclusiveBeat {
    id: string;
    title: string;
    artist: string; // Artista principal (pode ser o produtor)
    producer: string // Nome do produtor
    cover: string; // Capa do beat
    artistAvatar?: string;
    uri: string; // Caminho para o arquivo de áudio (MUDEI DE 'url' PARA 'uri' PARA CONSISTÊNCIA COM TRACK)
    genre: string;
    bpm: number;
    size?: number;
    price: number; // Preço obrigatório para ExclusiveBeat
    isBuyed?: boolean // Se foi comprado
    typeUse: 'exclusive' // Tipo de uso
    duration?: number;
    category: 'beat'; // Categoria específica
    releaseYear: string;
    source: 'beatstore-feeds' | 'beatstore-favorites'; // Adicionei my-purchases
    viewsCount?: number; // Adicionei para consistência
    favoritesCount?: number; // Adicionei para consistência
    commentCount?: number; // Adicionei para consistência
    shareCount?: number; // Adicionei para consistência
}

// Interface para um Beat Gratuito (da BeatStore)
export interface FreeBeat {
    id: string;
    title: string;
    artist: string; // Artista principal (pode ser o produtor)
    producer: string // Nome do produtor
    cover: string; // Capa do beat
    artistAvatar?: string;
    uri: string; // Caminho para o arquivo de áudio (MUDEI DE 'url' PARA 'uri' PARA CONSISTÊNCIA COM TRACK)
    genre: string;
    bpm: number;
    size?: number;
    isFree: true; // É sempre gratuito
    typeUse: 'free' // Tipo de uso
    duration?: number;
    category: 'beat'; // Categoria específica
    releaseYear: string;
    viewsCount?: number;
    favoritesCount?: number
    commentCount?: number
    shareCount?: number
    downloadCount?: number
    source: 'beatstore-feeds' | 'beatstore-favorites';
}

export interface Video {
    id: string;
    title: string;
    artist: string;
    ThumbnailUrl?: string;
    videoUrl: string;
    duration?: string; // Duração em formato string (ex: "03:45")
    category: 'video'; // <- Categoria correta
    releaseDate: string;
    viewsCount?: number;
    favoritesCount?: number
    commentCount?: number | string;
    shareCount?: number
    downloadCount?: number
    source: 'library-local' | 'library-cloud-feeds' | 'library-cloud-curtidas' | 'library-cloud-seguindo'; // Adicionei source
}

export interface Promotion {
    id: string; // ID único da promoção
    contentId: string; // ID da obra promovida
    contentType: 'single' | 'album' | 'ep' | 'video' | 'playlist' | 'message';
    promoterId: string; // Quem promoveu (usuário ou artista)
    title: string; // Título do anúncio ou conteúdo
    message?: string; // Mensagem personalizada
    thumbnail?: string; // Imagem ou capa do conteúdo
    startAt: string; // Início da campanha de promoção (ISO date)
    endAt: string; // Fim da campanha
    targetAudience?: 'followers' | 'all' | 'custom'; // Público alvo
    notify: boolean; // Se deve disparar notificação push
    createdAt: string;
    category: 'promotion';
}

// src/types/contentType.ts

// ... suas outras interfaces (ArtistProfile, Single, ExtendedPlayEP, Album, Playlist, Video, Promotion, ExclusiveBeat, FreeBeat) ...

// Tipo de União para qualquer item que possa aparecer no feed da Library Cloud
export type LibraryFeedItem = ArtistProfile | Single | ExtendedPlayEP | Album | Playlist | Video | Promotion | ExclusiveBeat | FreeBeat; // <-- Adicione ExclusiveBeat e FreeBeat aqui!

// União de tipos que o player pode reproduzir (mantenha como está se estiver correto para seu player)
export type PlayableContent = Single | ExclusiveBeat | FreeBeat;