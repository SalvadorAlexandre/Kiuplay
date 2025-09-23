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
    epsCount?: number;
    albumsCount?: number
    freeBeatsCount?: number
    exclusiveBeatsCount?: number;
    hasMonetizationEnabled?: boolean; // Novo campo para monetização
    releaseYear: string;

    singles?: Single[];
    albums?: Album[];
    eps?: ExtendedPlayEP[];
    freeBeats?: FreeBeat[];
    exclusiveBeats?: ExclusiveBeat[];
}

export interface Single {
    id: string; // ID único para a chave da FlatList e identificação
    uri: string; // O URI do arquivo de áudio (local ou remoto)
    title: string;
    artist: string;
    artistId?: string;
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
    artistId?: string;
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
    source: 'library-local' | 'library-cloud-feeds' | 'library-cloud-favorites' | 'library-artistProfile';
}

// Interface para um Álbum
export interface Album {
    id: string;
    title: string;
    artist: string; // Artista principal do álbum
    artistId?: string;
    cover?: string; // URL para a capa do álbum
    artistAvatar?: string;
    category: 'album'; // Tipo de conteúdo;
    tracks: Single[]; // IDs das faixas que compõem o álbum
    mainGenre: string; // NOVO: Adicionado para o gênero
    viewsCount?: number;
    favoritesCount?: number
    commentCount?: number
    shareCount?: number
    releaseYear: string;
    source: 'library-local' | 'library-cloud-feeds' | 'library-cloud-curtidas' | 'library-cloud-seguindo' | 'library-artistProfile';
}

// Interface para um Beat Exclusivo (da BeatStore)
export interface ExclusiveBeat {
    id: string;
    title: string;
    artist: string; // Artista principal (pode ser o produtor)
    artistId?: string;
    producer: string // Nome do produtor
    cover: string; // Capa do beat
    artistAvatar?: string;
    uri: string; // Caminho para o arquivo de áudio (MUDEI DE 'url' PARA 'uri' PARA CONSISTÊNCIA COM TRACK)
    genre: string;
    bpm: number;
    size?: number;
    price: number; // Preço obrigatório para ExclusiveBeat
    isBuyed: boolean // Se foi comprado
    typeUse: 'exclusive' // Tipo de uso
    duration?: number;
    category: 'beat'; // Categoria específica
    releaseYear: string;
    source: 'beatstore-feeds' | 'beatstore-favorites' | 'user-profile';
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
    artistId?: string;
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


export interface Promotion {
    id: string; // ID único da promoção
    contentId: string; // ID da obra promovida
    artistAvatar?: string;
    contentType: 'single' | 'album' | 'ep' | 'video' | 'freebeat' | 'exclusive_beat' | 'message';
    status: 'active' | 'expired' | 'pending' | 'removed';
    promoterId: string; // Quem promoveu (usuário ou artista)
    title: string; // Título do anúncio ou conteúdo
    message?: string; // Mensagem personalizada
    thumbnail?: string; // Imagem ou capa do conteúdo
    startDate: string; // Início da campanha de promoção (ISO date)
    endDate: string; // Fim da campanha
    targetAudience?: 'followers' | 'friends' | 'all'; // Público alvo
    notify: boolean; // Se deve disparar notificação push
    createdAt: string;
    category: 'promotion';
}

export type NotificationType = 'upload' | 'like' | 'comment' | 'follow' | 'purchase' | 'promotion' | 'message' | 'friend_request';
export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: string; // ISO format date
    isRead: boolean;
    userId?: string; // quem gerou a notificação
    contentId?: string; // conteúdo relacionado (beat, single, etc.)
    contentType?: 'single' | 'ep' | 'album' | 'freebeat' | 'exclusive_beat' | 'message' | 'artist' | 'promotion';
    avatarUrl?: string;
    category: 'notification';
}


// src/types/contentType.ts

// ... suas outras interfaces (ArtistProfile, Single, ExtendedPlayEP, Album, Playlist, Video, Promotion, ExclusiveBeat, FreeBeat) ...

// Tipo de União para qualquer item que possa aparecer no feed da Library Cloud
export type LibraryFeedItem = ArtistProfile | Single | ExtendedPlayEP | Album | Promotion | ExclusiveBeat | FreeBeat; // <-- Adicione ExclusiveBeat e FreeBeat aqui!

export type BeatStoreFeedItem = ExclusiveBeat | FreeBeat;

// União de tipos que o player pode reproduzir (mantenha como está se estiver correto para seu player)
export type PlayableContent = Single | ExclusiveBeat | FreeBeat;