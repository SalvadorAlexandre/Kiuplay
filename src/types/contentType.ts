// src/types/contentType.ts


// 🛑 NOVA: Interface Base para Perfis de Usuários (Artistas ou Comuns)
export interface UserProfile {
    id: string;
    name: string; // Ex: Saag weelli boy
    username: string // Ex: '@saag_swb_oficial'
    avatar: string; // URL para o avatar (ou avatarUrl no Redux)
    bio?: string;
    location?: string; // Ex: "Luanda, Angola"
    followersCount?: number;
    followingCount?: number
    isArtist?: boolean; // Se o usuário tem um perfil de artista
    hasMonetizationEnabled?: boolean;
    // 🛑 NOVO: Lista de beats comprados (útil para a aba "Beats Comprados")
    purchasedBeats?: PurchasedBeat[];
    // Adicione outros campos comuns se houverem
}


// ArtistProfile herda de UserProfile e, portanto, também terá `purchasedBeats`.

// Interface para um Perfil de Artista
export interface ArtistProfile extends UserProfile {
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
    releaseYear: string; //Mostra o ano em que o artista começou a usar no kiuplay
    location?: string; // Ex: "Luanda, Angola"

    singles?: Single[];
    albums?: Album[];
    eps?: ExtendedPlayEP[];
    freeBeats?: FreeBeat[];
    exclusiveBeats?: ExclusiveBeat[];
    followers?: ProfileReference[];
    following?: ProfileReference[];
}

export interface ProfileReference {
    id: string;
    name: string; // Nome de exibição
    username: string; // Username (@exemplo)
    avatar: string; // URL do avatar
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
    source: 'library-local' | 'library-cloud-feeds' | 'library-cloud-favorites' | 'library-server';

    comments?: Comment[]
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

// Beat comprado (derivado de ExclusiveBeat)
// Beat comprado (derivado de ExclusiveBeat)
export interface PurchasedBeat extends ExclusiveBeat {
    // Todos os campos de ExclusiveBeat
    buyerId: string; // Quem comprou o beat (deve ser igual ao currentOwnerId após a compra)
    sellerId: string; // 🛑 NOVO: Quem vendeu o beat (igual ao artistId)
    purchaseDate: string; // Data da compra (útil para histórico)
    downloadUrl: string; // 🛑 NOVO: URL/URI real para o comprador baixar o arquivo de alta qualidade
}

// Interface para um Beat Exclusivo (da BeatStore)
// Interface para um Beat Exclusivo (da BeatStore)
export interface ExclusiveBeat {
    id: string;
    title: string;
    artist: string; // Artista principal (pode ser o produtor)
    artistId: string; // 🛑 NOVO: ID do artista/vendedor, OBRIGATÓRIO para a lógica de compra/venda
    producer: string // Nome do produtor
    cover: string; // Capa do beat
    artistAvatar?: string;
    uri: string; // Caminho para o arquivo de áudio
    genre: string;
    bpm: number;
    size?: number;
    price: number; // Preço obrigatório para ExclusiveBeat
    // isBuyed: boolean; // 🛑 REMOVIDO/SUBSTITUÍDO: A lógica de venda será gerenciada por 'currentOwnerId'
    currentOwnerId: string; // 🛑 NOVO: ID do usuário que atualmente possui o beat (Vendedor se estiver à venda)
    isAvailableForSale: boolean; // 🛑 NOVO: Se está disponível para ser comprado na BeatStore
    isExclusiveSale: boolean; // 🛑 NOVO: Se a venda é exclusiva (só pode ser vendido uma vez)

    typeUse: 'exclusive' // Tipo de uso
    duration?: number;
    category: 'beat'; // Categoria específica
    releaseYear: string;
    source: 'beatstore-feeds' | 'beatstore-favorites' | 'user-profile';
    viewsCount?: number;
    favoritesCount?: number;
    commentCount?: number;
    shareCount?: number;
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

    comments?: Comment[]
}


export interface Promotion {
    id: string; // ID único da promoção
    contentId: string; // ID da obra promovida
    artistAvatar?: string;
    contentType: 'single' | 'album' | 'ep' | 'freebeat' | 'exclusive_beat';
    status: 'active' | 'expired' | 'pending' | 'removed';
    promoterId: string; // Quem promoveu (usuário ou artista)
    title: string; // Título do anúncio ou conteúdo
    message?: string; // Mensagem personalizada
    thumbnail?: string; // Imagem ou capa do conteúdo
    startDate: string; // Início da campanha de promoção (ISO date)
    endDate: string; // Fim da campanha
    targetAudience?: 'followers' | 'all'; // Público alvo
    createdAt: string;
    category: 'promotion';
    notify: boolean
}

// Tipos de notificações possíveis no Kiuplay
// Tipos de notificações possíveis no Kiuplay
export type NotificationType =
    | 'upload'
    | 'like'
    | 'comment'
    | 'follow'
    | 'purchase'
    | 'promotion'
    | 'share'
    | 'message'
    | 'sale'
    | 'refund'
    | 'system';

// Tipos de categorias principais
export type NotificationCategory = 'notification' | 'transaction';

export interface Notification {
    id: string; // ID único da notificação
    type: NotificationType; // Tipo da notificação
    title: string; // Título exibido na notificação
    message: string; // Mensagem detalhada
    timestamp: string; // ISO date (quando a notificação foi criada)
    isRead: boolean; // Status de leitura
    readAt?: string; // Data/hora em que foi lida
    userId?: string; // Quem gerou a notificação
    targetUserId?: string; // Quem deve receber a notificação
    contentId?: string; // Conteúdo relacionado (beat, single, EP, álbum, etc.)
    contentType?: 'single' | 'ep' | 'album' | 'freebeat' | 'exclusive_beat' | 'promotion' | 'artist' | 'message';
    avatarUrl?: string; // Avatar do usuário que gerou a notificação
    category: NotificationCategory; // 'notification' | 'transaction'
    extraData?: Record<string, any>; // Informações adicionais (ex: valor, link, etc.)
}

// NOVO: Interface para um Usuário simplificado em um comentário
export interface CommentUserReference {
    name: string;
    // Usamos string para URL externa (avatar)
    avatar: string | null;
}
// NOVO: Interface para o objeto Comentário
export interface Comment {
    id: string;
    user: CommentUserReference;
    text: string;
    timestamp: string; // Ex: '2 min atrás', 'Ontem', '2024-05-01'
    // Você pode adicionar mais campos aqui se necessário, como 'likesCount', 'userId', etc.
}


// src/types/contentType.ts

// ... suas outras interfaces (ArtistProfile, Single, ExtendedPlayEP, Album, Playlist, Video, Promotion, ExclusiveBeat, FreeBeat) ...

// Tipo de União para qualquer item que possa aparecer no feed da Library Cloud
export type LibraryFeedItem = ArtistProfile | Single | ExtendedPlayEP | Album | Promotion | ExclusiveBeat | FreeBeat; // <-- Adicione ExclusiveBeat e FreeBeat aqui!

export type BeatStoreFeedItem = ExclusiveBeat | FreeBeat;

// União de tipos que o player pode reproduzir (mantenha como está se estiver correto para seu player)
export type PlayableContent = Single | ExclusiveBeat | FreeBeat;