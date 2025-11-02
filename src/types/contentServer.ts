//src/types/contentServer.ts
import { LibraryFeedItem, BeatStoreFeedItem, Album, ArtistProfile, Single, ExtendedPlayEP, ExclusiveBeat, FreeBeat, } from '@/src/types/contentType';

import { Notification } from '@/src/types/contentType';

// src/mocks/mockWallets.ts
import { LinkedWallet } from '@/src/types/walletType';
import { UserProfile } from '@/src/types/contentType';

export const mockUserProfile: UserProfile = {
    id: 'user-001',
    name: 'Saag Weelli Boy swb',
    username: '@saag_swb_oficial',
    avatar: 'https://cdn.kiuplay.com/avatars/saag.png',
    bio: 'Artista, produtor e fundador do Kiuplay 🎶',
    genres: ['Trap', 'Hip Hop', 'Afrobeat'],
    location: 'Luanda, Angola',
    followersCount: 1240,
    followingCount: 320,
    isArtist: true,
    singlesCount: 1,
    epsCount: 1,
    albumsCount: 1,
    freeBeatsCount: 1,
    exclusiveBeatsCount: 1,
    releaseYear: '2018',
    hasMonetizationEnabled: true,
};

export const mockLinkedWallets: LinkedWallet[] = [
    {
        id: 'wallet-aoa-001',
        provider: 'Pix',
        type: 'local',
        status: 'inactive',
        currency: 'BRL',
        region: 'pt-BR',
        accountId: '0023-458-9823',
        balance: 2545075,
        createdAt: '2025-10-01T10:00:00Z',
        lastTransactionDate: '2025-10-26T18:45:00Z',
        userId: mockUserProfile.id,
        user: mockUserProfile,
        transactions: [
            {
                id: 'tx-001',
                type: 'sale',
                amount: 30800,
                date: '2025-10-10T12:00:00Z',
                description: "Venda do beat 'TrapSoul Vibes'",
                status: 'completed',
                relatedContentId: 'beat-204',
                relatedContentType: 'beat',
            },
            {
                id: 'tx-002',
                type: 'withdrawal',
                amount: -15700,
                date: '2025-10-20T17:00:00Z',
                description: 'Saque via Multicaixa Express',
                status: 'completed',
            },
            {
                id: 'tx-003',
                type: 'withdrawal',
                amount: -15700,
                date: '2025-10-20T17:00:00Z',
                description: 'Saque via Multicaixa Express',
                status: 'completed',
            },
            {
                id: 'tx-004',
                type: 'withdrawal',
                amount: -15700,
                date: '2025-10-20T17:00:00Z',
                description: 'Saque via Multicaixa Express',
                status: 'completed',
            },
            {
                id: 'tx-005',
                type: 'sale',
                amount: 30800,
                date: '2025-10-10T12:00:00Z',
                description: "Venda do beat 'TrapSoul Vibes'",
                status: 'completed',
                relatedContentId: 'beat-204',
                relatedContentType: 'beat',
            },
            {
                id: 'tx-006',
                type: 'withdrawal',
                amount: -15700,
                date: '2025-10-20T17:00:00Z',
                description: 'Saque via Multicaixa Express',
                status: 'completed',
            },
        ]
    },
    {
        id: 'wallet-usd-001',
        provider: 'PayPal',
        type: 'international',
        status: 'active',
        currency: 'USD',
        region: 'en-US',
        accountId: 'saagweelli@paypal.com',
        balance: 84967890434,
        createdAt: '2025-09-15T09:00:00Z',
        lastTransactionDate: '2025-10-20T17:00:00Z',
        userId: mockUserProfile.id,
        user: mockUserProfile,
        transactions: [
            {
                id: 'tx-001',
                type: 'sale',
                amount: 3000,
                date: '2025-10-10T12:00:00Z',
                description: "Venda do beat 'TrapSoul Vibes'",
                status: 'completed',
                relatedContentId: 'beat-204',
                relatedContentType: 'beat',
            },
            {
                id: 'tx-002',
                type: 'withdrawal',
                amount: -1500,
                date: '2025-10-20T17:00:00Z',
                description: 'Saque via Multicaixa Express',
                status: 'completed',
            },
            {
                id: 'tx-003',
                type: 'sale',
                amount: 3000,
                date: '2025-10-10T12:00:00Z',
                description: "Venda do beat 'TrapSoul Vibes'",
                status: 'completed',
                relatedContentId: 'beat-204',
                relatedContentType: 'beat',
            },
            {
                id: 'tx-004',
                type: 'sale',
                amount: 3000,
                date: '2025-10-10T12:00:00Z',
                description: "Venda do beat 'TrapSoul Vibes'",
                status: 'completed',
                relatedContentId: 'beat-204',
                relatedContentType: 'beat',
            },
        ]
    },
];


// Dados mockados (MOCKED_CLOUD_FEED_DATA) - AJUSTADOS (Playlists, EPs, etc. removidos/corrigidos para ficarem apenas os tipos suportados no LibraryContentCard agora)
export const MOCKED_CLOUD_FEED_DATA: LibraryFeedItem[] = [
    {
        id: 'single-1',
        uri: '[https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3](https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3)',
        title: 'Vibe Urbana',
        artist: 'BeatMaster',
        cover: '',
        artistAvatar: '[https://i.pravatar.cc/150?img=6](https://i.pravatar.cc/150?img=6)',
        source: 'library-cloud-feeds',
        duration: 180000,
        category: 'single', // Alterado 'type' para 'category' para consistência
        genre: 'Hip Hop',
        releaseYear: '2024', // Alterado 'viewsNumber' para 'releaseYear' ou similar
        viewsCount: 271, // Adicionada viewsCount se for relevante para Single
        comments: [
            {
                id: 'c1',
                user: { name: 'Saag Weelli Boy', avatar: 'https://i.pravatar.cc/150?img=20' },
                text: '🔥🔥 esse beat tá incrível!',
                timestamp: 24092002,
            },
            {
                id: 'c2',
                user: { name: 'Producer X', avatar: 'https://i.pravatar.cc/150?img=21' },
                text: 'Boom bap raiz, do jeito que gosto!',
                timestamp: 24092002,
            },
            {
                id: 'c3',
                user: { name: 'Saag Weelli Boy', avatar: 'https://i.pravatar.cc/150?img=20' },
                text: '🔥🔥 esse beat tá incrível!',
                timestamp: 24092002,
            },
            {
                id: 'c4',
                user: { name: 'Producer X', avatar: 'https://i.pravatar.cc/150?img=21' },
                text: 'Boom bap raiz, do jeito que gosto!',
                timestamp: 24092002,
            },
        ],
    } as Single,
    {
        id: 'album-1',
        title: 'Retrospectiva Jazz',
        artist: 'Jazz Collective',
        cover: '[https://placehold.co/300x300/4682B4/FFFFFF?text=Album+Jazz](https://placehold.co/300x300/4682B4/FFFFFF?text=Album+Jazz)',
        category: 'album', // Alterado 'type' para 'category'
        releaseYear: '2023', // Alterado 'releaseDate' para 'releaseYear'
        mainGenre: 'Jazz', // Alterado 'genre' para 'mainGenre'
    } as Album,
    //-----------------------------------------------------------------------------------------------
    {
        id: 'artist-1',
        name: 'Mestre da Batida',
        username: '@mestre_batida_ofc', // Adicionado username para consistência
        avatar: '[https://i.pravatar.cc/150?img=7](https://i.pravatar.cc/150?img=7)',
        category: 'artist', // Alterado 'type' para 'category'
        genres: ['Hip Hop', 'Trap'],
        releaseYear: '2010', // Adicionado releaseYear
        singlesCount: 10,
        albumsCount: 4,
        epsCount: 7,
        freeBeatsCount: 20,
        exclusiveBeatsCount: 40,
        followersCount: 450906,
        followingCount: 13,

        singles: [
            {
                id: 'single-1',
                uri: '[https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3](https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3)',
                title: 'Vibe Urbana',
                artist: 'BeatMaster',
                cover: '[https://placehold.co/300x300/8A2BE2/FFFFFF?text=Single+Soul](https://placehold.co/300x300/8A2BE2/FFFFFF?text=Single+Soul)',
                artistAvatar: '[https://i.pravatar.cc/150?img=6](https://i.pravatar.cc/150?img=6)',
                source: 'library-cloud-feeds',
                duration: 180000,
                category: 'single', // Alterado 'type' para 'category' para consistência
                genre: 'Hip Hop',
                releaseYear: '2024', // Alterado 'viewsNumber' para 'releaseYear' ou similar
                viewsCount: 271, // Adicionada viewsCount se for relevante para Single
            },
            {
                id: 'single-3',
                uri: '[https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3](https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3)',
                title: 'Cara ou Coroa',
                artist: 'Saag Weelli Boy',
                cover: '[https://placehold.co/300x300/8A2BE2/FFFFFF?text=Single+Soul](https://placehold.co/300x300/8A2BE2/FFFFFF?text=Single+Soul)',
                artistAvatar: '[https://i.pravatar.cc/150?img=8](https://i.pravatar.cc/150?img=8)',
                source: 'library-cloud-feeds',
                duration: 210000,
                category: 'single', // Alterado 'type' para 'category'
                genre: 'Trap',
                releaseYear: '2026',
                viewsCount: 1000,
                feat: ['Dji Tafinha', 'Xuxu Bower'],
                producer: 'DJ Dada',
                commentCount: 120,
                favoritesCount: 348,
                shareCount: 150,
            }
        ],
        albums: [
            {
                id: 'album-2',
                title: 'O Despertar',
                artist: 'Aura Sonora',
                cover: '[https://placehold.co/300x300/CD5C5C/FFFFFF?text=Album+Aura](https://placehold.co/300x300/CD5C5C/FFFFFF?text=Album+Aura)',
                category: 'album',
                releaseYear: '2024',
                mainGenre: 'Ambient',
                source: 'library-artistProfile',
                tracks: [
                    {
                        id: 'album-track-a',
                        uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
                        title: 'Amanhecer Urbano',
                        artist: 'Novo Talento',
                        artistAvatar: 'https://i.pravatar.cc/150?img=15',
                        cover: 'https://placehold.co/300x300/FF5733/FFFFFF?text=EP+Vozes',
                        duration: 200000,
                        viewsCount: 1500,
                        favoritesCount: 50,
                        commentCount: 10,
                        shareCount: 5,
                        genre: 'Hip Hop',
                        releaseYear: '2025',
                        category: 'single',
                        source: 'library-cloud-feeds',
                    },
                    {
                        id: 'album-track-b',
                        uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
                        title: 'Noite de Ritmos',
                        artist: 'Novo Talento',
                        artistAvatar: 'https://i.pravatar.cc/150?img=15',
                        cover: 'https://placehold.co/300x300/FF5733/FFFFFF?text=EP+Vozes',
                        duration: 220000,
                        viewsCount: 1800,
                        favoritesCount: 60,
                        commentCount: 12,
                        shareCount: 7,
                        genre: 'Hip Hop',
                        releaseYear: '2025',
                        category: 'single',
                        source: 'library-cloud-feeds',
                    }, // Adicionado trackIds para EP 

                ]
            },
        ],
        eps: [
            {
                id: 'ep-1',
                title: 'Sons do Verão',
                artist: 'Tropical Vibes',
                cover: '[https://placehold.co/300x300/32CD32/FFFFFF?text=EP+Ver%C3%A3o](https://placehold.co/300x300/32CD32/FFFFFF?text=EP+Ver%C3%A3o)',
                category: 'ep', // Alterado 'type' para 'category'
                releaseYear: '2024', // Alterado 'releaseDate' para 'releaseYear'
                mainGenre: 'Reggaeton', // Alterado 'genre' para 'mainGenre'
                source: 'library-artistProfile',
                tracks: [
                    {
                        id: 'ep-track-a',
                        uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
                        title: 'Amanhecer Urbano',
                        artist: 'Novo Talento',
                        artistAvatar: 'https://i.pravatar.cc/150?img=15',
                        cover: 'https://placehold.co/300x300/FF5733/FFFFFF?text=EP+Vozes',
                        duration: 200000,
                        viewsCount: 1500,
                        favoritesCount: 50,
                        commentCount: 10,
                        shareCount: 5,
                        genre: 'Hip Hop',
                        releaseYear: '2025',
                        category: 'single',
                        source: 'library-cloud-feeds',
                    },
                    {
                        id: 'ep-track-b',
                        uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
                        title: 'Noite de Ritmos',
                        artist: 'Novo Talento',
                        artistAvatar: 'https://i.pravatar.cc/150?img=15',
                        cover: 'https://placehold.co/300x300/FF5733/FFFFFF?text=EP+Vozes',
                        duration: 220000,
                        viewsCount: 1800,
                        favoritesCount: 60,
                        commentCount: 12,
                        shareCount: 7,
                        genre: 'Hip Hop',
                        releaseYear: '2025',
                        category: 'single',
                        source: 'library-cloud-feeds',
                    }, // Adicionado trackIds para EP 
                ]
            },
        ],
        freeBeats: [
            {
                id: 'beat-store-2',
                uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
                title: 'Boom Bap - "Golden Era"',
                artist: 'HipHop Pro',
                producer: 'HipHop Pro', // Adicionado produtor
                cover: 'https://placehold.co/150x150/DAA520/000000?text=BeatY',
                // artistAvatar: 'https://i.pravatar.cc/150?img=11', // Removido
                source: 'beatstore-feeds',
                duration: 210000,
                genre: 'Boom Bap',
                isFree: true, // Para FreeBeat
                typeUse: 'free', // Usar typeUse
                category: 'beat', // Categoria é 'beat'
                bpm: 87,
                releaseYear: '2022', // Adicionado releaseYear
            },
            {
                id: 'beat-store-4',
                uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
                title: 'Drill Type Beat - "Dark Alley"',
                artist: 'Urban Soundz',
                producer: 'Urban Soundz', // Adicionado produtor
                cover: 'https://placehold.co/150x150/4B0082/FFFFFF?text=DrillA',
                // artistAvatar: 'https://i.pravatar.cc/150?img=13', // Removido
                source: 'beatstore-feeds',
                duration: 150000,
                genre: 'Drill',
                isFree: true, // Para FreeBeat
                typeUse: 'free', // Usar typeUse
                category: 'beat', // Categoria é 'beat'
                bpm: 90,
                releaseYear: '2023', // Adicionado releaseYear
            },
        ],
        exclusiveBeats: [
            {
                id: 'beat-store-5',
                uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
                title: 'Trap Soul - "Smooth Operator"',
                artist: 'Groovy Beats',
                producer: 'Groovy Beats', // Adicionado produtor
                cover: 'https://placehold.co/150x150/9370DB/FFFFFF?text=TrapSoul',
                // artistAvatar: 'https://i.pravatar.cc/150?img=14', // Removido
                source: 'beatstore-feeds',
                duration: 190000,
                genre: 'Trap Soul',
                price: 65.50,
                typeUse: 'exclusive', // Usar typeUse
                category: 'beat', // Categoria é 'beat'
                bpm: 85,
                releaseYear: '2024', // Adicionado releaseYear
            },
            {
                id: 'beat-store-3',
                uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
                title: 'Afrobeat - "Vibes Tropicais"',
                artist: 'Afro Maestro',
                producer: 'Afro Maestro', // Adicionado produtor
                cover: 'https://placehold.co/150x150/3CB371/FFFFFF?text=AfroZ',
                source: 'beatstore-feeds',
                duration: 240000,
                genre: 'Afrobeat',
                price: 79.00,
                typeUse: 'exclusive', // Usar typeUse
                category: 'beat', // Categoria é 'beat'
                bpm: 102,
                releaseYear: '2024', // Adicionado releaseYear
            },
            {
                id: 'beat-store-1',
                uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
                title: 'Trap Beat - "Midnight Groove"',
                artist: 'Producer X',
                producer: 'Producer X', // Adicionado produtor
                cover: 'https://placehold.co/150x150/8A2BE2/FFFFFF?text=BeatX',
                // artistAvatar: 'https://i.pravatar.cc/150?img=10', // Removido, não faz parte de ExclusiveBeat/FreeBeat
                source: 'beatstore-feeds',
                duration: 180000,
                genre: 'Trap',
                price: 49.99,
                typeUse: 'exclusive', // Usar typeUse para indicar se é exclusivo/gratuito
                category: 'beat', // Categoria é 'beat'
                bpm: 120,
                releaseYear: '2023', // Adicionado releaseYear
            },
        ],
    } as ArtistProfile,
    //--------------------------------------------------------------------------------------
    {
        id: 'ep-1',
        title: 'Sons do Verão',
        artist: 'Tropical Vibes',
        cover: '[https://placehold.co/300x300/32CD32/FFFFFF?text=EP+Ver%C3%A3o](https://placehold.co/300x300/32CD32/FFFFFF?text=EP+Ver%C3%A3o)',
        category: 'ep', // Alterado 'type' para 'category'
        releaseYear: '2024', // Alterado 'releaseDate' para 'releaseYear'
        mainGenre: 'Reggaeton', // Alterado 'genre' para 'mainGenre'
        tracks: [
            {
                id: 'ep-track-a',
                uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
                title: 'Amanhecer Urbano',
                artist: 'Novo Talento',
                artistAvatar: 'https://i.pravatar.cc/150?img=15',
                cover: 'https://placehold.co/300x300/FF5733/FFFFFF?text=EP+Vozes',
                duration: 200000,
                viewsCount: 1500,
                favoritesCount: 50,
                commentCount: 10,
                shareCount: 5,
                genre: 'Hip Hop',
                releaseYear: '2025',
                category: 'single',
                source: 'library-cloud-feeds',
            },
            {
                id: 'b5track-b',
                uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
                title: 'Noite de Ritmos',
                artist: 'Novo Talento',
                artistAvatar: 'https://i.pravatar.cc/150?img=15',
                cover: 'https://placehold.co/300x300/FF5733/FFFFFF?text=EP+Vozes',
                duration: 220000,
                viewsCount: 1800,
                favoritesCount: 60,
                commentCount: 12,
                shareCount: 7,
                genre: 'Hip Hop',
                releaseYear: '2025',
                category: 'single',
                source: 'library-cloud-feeds',
            }, // Adicionado trackIds para EP 
        ]
    } as ExtendedPlayEP,
    // REMOVIDO: { id: 'playlist-1', ... }
    {
        id: 'single-2',
        uri: '[https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3](https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3)',
        title: 'Caminhos do Soul',
        artist: 'Soulful Echoes',
        cover: '[https://placehold.co/300x300/8A2BE2/FFFFFF?text=Single+Soul](https://placehold.co/300x300/8A2BE2/FFFFFF?text=Single+Soul)',
        artistAvatar: '[https://i.pravatar.cc/150?img=8](https://i.pravatar.cc/150?img=8)',
        source: 'library-cloud-feeds',
        duration: 210000,
        category: 'single', // Alterado 'type' para 'category'
        genre: 'Soul',
        releaseYear: '2024',
        viewsCount: 1000,
        comments: [
            {
                id: 'c1',
                user: { name: 'Saag Weelli Boy', avatar: 'https://i.pravatar.cc/150?img=20' },
                text: '🔥🔥 esse beat tá incrível!',
                timestamp: 24092002,
            },
            {
                id: 'c2',
                user: { name: 'Producer X', avatar: 'https://i.pravatar.cc/150?img=21' },
                text: 'Boom bap raiz, do jeito que gosto!',
                timestamp: 24092002,
            },
            {
                id: 'c3',
                user: { name: 'Saag Weelli Boy', avatar: 'https://i.pravatar.cc/150?img=20' },
                text: '🔥🔥 esse beat tá incrível!',
                timestamp: 24092002,
            },
            {
                id: 'c4',
                user: { name: 'Producer X', avatar: 'https://i.pravatar.cc/150?img=21' },
                text: 'Boom bap raiz, do jeito que gosto!',
                timestamp: 24092002,
            },
        ],
    } as Single,
    {
        id: 'artist-2',
        name: 'EveryDay',
        username: '@everyday_ofc',
        avatar: '[https://i.pravatar.cc/150?img=7](https://i.pravatar.cc/150?img=7)',
        category: 'artist',
        genres: ['Hip Hop', 'Trap'],
        releaseYear: '2018',
        singlesCount: 10,
        albumsCount: 4,
        epsCount: 7,
        freeBeatsCount: 20,
        exclusiveBeatsCount: 40,
        singles: [],
        albums: [],
        eps: [],
        freeBeats: [],
        exclusiveBeats: [],
        videos: [],
    } as ArtistProfile,
    {
        id: 'album-2',
        title: 'O Despertar',
        artist: 'Aura Sonora',
        cover: '[https://placehold.co/300x300/CD5C5C/FFFFFF?text=Album+Aura](https://placehold.co/300x300/CD5C5C/FFFFFF?text=Album+Aura)',
        category: 'album',
        releaseYear: '2024',
        mainGenre: 'Ambient',
        tracks: [ // <--- DEVE SER UM ARRAY DE OBJETOS SINGLE COMPLETOS
            {
                id: 'album-track-a',
                uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
                title: 'Amanhecer Urbano',
                artist: 'Novo Talento',
                artistAvatar: 'https://i.pravatar.cc/150?img=15',
                cover: 'https://placehold.co/300x300/FF5733/FFFFFF?text=EP+Vozes',
                duration: 200000,
                viewsCount: 1500,
                favoritesCount: 50,
                commentCount: 10,
                shareCount: 5,
                genre: 'Hip Hop',
                releaseYear: '2025',
                category: 'single',
                source: 'library-cloud-feeds',
            },
            {
                id: 'album-track-b',
                uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
                title: 'Noite de Ritmos',
                artist: 'Novo Talento',
                artistAvatar: 'https://i.pravatar.cc/150?img=15',
                cover: 'https://placehold.co/300x300/FF5733/FFFFFF?text=EP+Vozes',
                duration: 220000,
                viewsCount: 1800,
                favoritesCount: 60,
                commentCount: 12,
                shareCount: 7,
                genre: 'Hip Hop',
                releaseYear: '2025',
                category: 'single',
                source: 'library-cloud-feeds',
            }, // Adicionado trackIds para EP 
        ]
    } as Album,
    {
        id: 'artist-3',
        name: 'Helloby',
        username: '@helloby_music',
        avatar: '[https://i.pravatar.cc/150?img=7](https://i.pravatar.cc/150?img=7)',
        category: 'artist',
        genres: ['Zouck', 'Trap'],
        releaseYear: '2015',
        singlesCount: 10,
        albumsCount: 4,
        epsCount: 7,
        freeBeatsCount: 20,
        exclusiveBeatsCount: 40,
    } as ArtistProfile,
    {
        id: 'artist-4',
        name: 'Rainha do R&B',
        username: '@rainha_rnb_ofc',
        avatar: '[https://i.pravatar.cc/150?img=9](https://i.pravatar.cc/150?img=9)',
        category: 'artist',
        genres: ['R&B', 'Pop'],
        releaseYear: '2020',
        singles: [],
        albums: [],
        eps: [],
        freeBeats: [],
        exclusiveBeats: [],
    } as ArtistProfile,
    {
        id: 'ep-2',
        title: 'Reflexões Noturnas',
        artist: 'Dreamweaver',
        cover: '[https://placehold.co/300x300/6A5ACD/FFFFFF?text=EP+Night](https://placehold.co/300x300/6A5ACD/FFFFFF?text=EP+Night)',
        category: 'ep',
        releaseYear: '2023',
        mainGenre: 'Eletrônica',
        tracks: [],
        source: 'library-cloud-feeds',
    } as ExtendedPlayEP,
    {
        id: 'single-3',
        uri: '[https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3](https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3)',
        title: 'Cara ou Coroa',
        artist: 'Saag Weelli Boy',
        cover: '[https://placehold.co/300x300/8A2BE2/FFFFFF?text=Single+Soul](https://placehold.co/300x300/8A2BE2/FFFFFF?text=Single+Soul)',
        artistAvatar: '[https://i.pravatar.cc/150?img=8](https://i.pravatar.cc/150?img=8)',
        source: 'library-cloud-feeds',
        duration: 210000,
        category: 'single', // Alterado 'type' para 'category'
        genre: 'Trap',
        releaseYear: '2026',
        viewsCount: 1000,
        feat: ['Dji Tafinha', 'Xuxu Bower'],
        producer: 'DJ Dada',
        commentCount: 120,
        favoritesCount: 348,
        shareCount: 150,
    } as Single,
];

export const MOCKED_BEATSTORE_FEED_DATA: BeatStoreFeedItem[] = [
    {
        id: 'beat-store-',
        uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        title: 'Trap Beat - "Midnight Groove"',
        artist: 'Producer X',
        producer: 'Producer X', // Adicionado produtor
        cover: 'https://placehold.co/150x150/8A2BE2/FFFFFF?text=BeatX',
        source: 'beatstore-feeds',
        duration: 180000,
        genre: 'Trap',
        price: 4999,
        typeUse: 'exclusive', // Usar typeUse para indicar se é exclusivo/gratuito
        category: 'beat', // Categoria é 'beat'
        bpm: 120,
        releaseYear: '2023', // Adicionado releaseYear
        artistId: 'artist-1',
        currentOwnerId: 'artist-2',
        isAvailableForSale: true,
        isExclusiveSale: true,
        region: 'pt-AO',       // Locale do produtor/vendedor (ex: Angola)
        currency: 'AOA',
    } as ExclusiveBeat,
    {
        id: 'beat-store-2',
        uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
        title: 'Boom Bap - "Golden Era"',
        artist: 'HipHop Pro',
        producer: 'HipHop Pro', // Adicionado produtor
        cover: 'https://placehold.co/150x150/DAA520/000000?text=BeatY',
        source: 'beatstore-feeds',
        duration: 210000,
        genre: 'Boom Bap',
        isFree: true, // Para FreeBeat
        typeUse: 'free', // Usar typeUse
        category: 'beat', // Categoria é 'beat'
        bpm: 120,
        releaseYear: '2022', // Adicionado releaseYear

        comments: [
            {
                id: 'c1',
                user: { name: 'Saag Weelli Boy', avatar: 'https://i.pravatar.cc/150?img=20' },
                text: '🔥🔥 esse beat tá incrível!',
                timestamp: 24092002,
            },
            {
                id: 'c2',
                user: { name: 'Producer X', avatar: 'https://i.pravatar.cc/150?img=21' },
                text: 'Boom bap raiz, do jeito que gosto!',
                timestamp: 24092002,
            },
            {
                id: 'c3',
                user: { name: 'Saag Weelli Boy', avatar: 'https://i.pravatar.cc/150?img=20' },
                text: '🔥🔥 esse beat tá incrível!',
                timestamp: 24092002,
            },
            {
                id: 'c4',
                user: { name: 'Producer X', avatar: 'https://i.pravatar.cc/150?img=21' },
                text: 'Boom bap raiz, do jeito que gosto!',
                timestamp: 24092002,
            },
        ],
    } as FreeBeat,
    {
        id: 'beat-store-3',
        uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
        title: 'Afrobeat - "Vibes Tropicais"',
        artist: 'Afro Maestro',
        producer: 'Afro Maestro', // Adicionado produtor
        cover: 'https://placehold.co/150x150/3CB371/FFFFFF?text=AfroZ',
        source: 'beatstore-feeds',
        duration: 240000,
        genre: 'Afrobeat',
        price: 7900,
        typeUse: 'exclusive', // Usar typeUse
        category: 'beat', // Categoria é 'beat'
        bpm: 102,
        releaseYear: '2024', // Adicionado releaseYear
        artistId: 'artist-1',
        currentOwnerId: 'artist-2',
        isAvailableForSale: true,
        isExclusiveSale: true,
        region: 'pt-BR',       // Locale do produtor/vendedor (ex: Angola)
        currency: 'BRL',
    } as ExclusiveBeat,
    {
        id: 'beat-store-4',
        uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
        title: 'Drill Type Beat - "Dark Alley"',
        artist: 'Urban Soundz',
        producer: 'Urban Soundz', // Adicionado produtor
        cover: 'https://placehold.co/150x150/4B0082/FFFFFF?text=DrillA',
        // artistAvatar: 'https://i.pravatar.cc/150?img=13', // Removido
        source: 'beatstore-feeds',
        duration: 150000,
        genre: 'Drill',
        isFree: true, // Para FreeBeat
        typeUse: 'free', // Usar typeUse
        category: 'beat', // Categoria é 'beat'
        bpm: 90,
        releaseYear: '2023', // Adicionado releaseYear
        comments: [
            {
                id: 'c1',
                user: { name: 'Saag Weelli Boy', avatar: 'https://i.pravatar.cc/150?img=20' },
                text: '🔥🔥 esse beat tá incrível!',
                timestamp: 24092002,
            },
            {
                id: 'c2',
                user: { name: 'Producer X', avatar: 'https://i.pravatar.cc/150?img=21' },
                text: 'Boom bap raiz, do jeito que gosto!',
                timestamp: 24092002,
            },
            {
                id: 'c3',
                user: { name: 'Saag Weelli Boy', avatar: 'https://i.pravatar.cc/150?img=20' },
                text: '🔥🔥 esse beat tá incrível!',
                timestamp: 24092002,
            },
            {
                id: 'c4',
                user: { name: 'Producer X', avatar: 'https://i.pravatar.cc/150?img=21' },
                text: 'Boom bap raiz, do jeito que gosto!',
                timestamp: 24092002,
            },
        ],
    } as FreeBeat,
    {
        id: 'beat-store-5',
        uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
        title: 'Trap Soul - "Smooth Operator"',
        artist: 'Groovy Beats',
        producer: 'Groovy Beats', // Adicionado produtor
        cover: 'https://placehold.co/150x150/9370DB/FFFFFF?text=TrapSoul',
        // artistAvatar: 'https://i.pravatar.cc/150?img=14', // Removido
        source: 'beatstore-feeds',
        duration: 190000,
        genre: 'Trap Soul',
        price: 6550,
        typeUse: 'exclusive', // Usar typeUse
        category: 'beat', // Categoria é 'beat'
        bpm: 85,
        releaseYear: '2024', // Adicionado releaseYear
        artistId: "artist-saag-001",
        currentOwnerId: 'artist-2',
        isAvailableForSale: true,
        isExclusiveSale: true,
        region: 'pt-PT',       // Locale do produtor/vendedor (ex: Angola)
        currency: 'EUR',
    } as ExclusiveBeat,
    {
        id: 'beat-store-5RT45',
        uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
        title: 'Trap Soul - "Smooth Operator"',
        artist: 'Groovy Beats',
        producer: 'Groovy Beats', // Adicionado produtor
        cover: 'https://placehold.co/150x150/9370DB/FFFFFF?text=TrapSoul',
        // artistAvatar: 'https://i.pravatar.cc/150?img=14', // Removido
        source: 'beatstore-feeds',
        duration: 190000,
        genre: 'Trap Soul',
        price: 2850,
        typeUse: 'exclusive', // Usar typeUse
        category: 'beat', // Categoria é 'beat'
        bpm: 85,
        releaseYear: '2024', // Adicionado releaseYear
        artistId: "artist-saag-001",
        currentOwnerId: 'artist-2',
        isAvailableForSale: true,
        isExclusiveSale: true,
        region: 'pt-PT',       // Locale do produtor/vendedor (ex: Angola)
        currency: 'EUR',
    } as ExclusiveBeat,
];

export const MOCKED_NOTIFICATIONS: Notification[] = [
    {
        id: "notif-1",
        type: "like",
        title: "Nova curtida!",
        message: "DJ G curtiu sua faixa 'Vibe Urbana'.",
        timestamp: new Date().toISOString(),
        isRead: false,
        userId: "user-1",
        contentId: "single-1",
        contentType: "single",
        avatarUrl: "https://i.pravatar.cc/150?img=12",
        category: "notification",
    },
    {
        id: "notif-2",
        type: "comment",
        title: "Novo comentário!",
        message: "Saag Weelli Boy comentou na sua faixa 'Cara ou Coroa'.",
        timestamp: new Date().toISOString(),
        isRead: true,
        userId: "user-2",
        contentId: "single-3",
        contentType: "single",
        avatarUrl: "https://i.pravatar.cc/150?img=13",
        category: "notification",
    },
    {
        id: "notif-3",
        type: "promotion",
        title: "Promoção ativa!",
        message: "EveryDay lançou uma promoção exclusiva do beat 'Trap Soul - Smooth Operator'.",
        timestamp: new Date().toISOString(),
        isRead: false,
        userId: "artist-5", // usuário que fez a promoção
        contentId: "beat-store-5",
        contentType: "exclusive_beat",
        avatarUrl: "https://placehold.co/150x150/9370DB/FFFFFF?text=TrapSoul",
        category: "notification",
    },
    {
        id: "notif-4",
        type: "follow",
        title: "Novo seguidor!",
        message: "EveryDay começou a seguir você.",
        timestamp: new Date().toISOString(),
        isRead: true,
        userId: "artist-2",
        contentType: "artist",
        avatarUrl: "https://i.pravatar.cc/150?img=7",
        category: "notification",
    },
    {
        id: "notif-5",
        type: "purchase",
        title: "Venda concluída!",
        message: "Seu beat 'Night Drive' foi comprado por DJ Flow.",
        timestamp: new Date().toISOString(),
        isRead: false,
        userId: "buyer-1",
        contentId: "beat-2",
        contentType: "exclusive_beat",
        avatarUrl: "https://placehold.co/150x150/000000/FFFFFF?text=NightDrive",
        category: "notification",
    },
    {
        id: "notif-6",
        type: "purchase",
        title: "Compra concluída!",
        message: "Você comprou o instrumental exclusivo 'Golden Hour'.",
        timestamp: new Date().toISOString(),
        isRead: false,
        userId: "artist-7",
        contentId: "beat-4",
        contentType: "exclusive_beat",
        avatarUrl: "https://placehold.co/150x150/FFD700/000000?text=GoldenHour",
        category: "notification",
    },
    {
        id: "notif-7",
        type: "share",
        title: "Partilha recebida!",
        message: "MC Lito partilhou um novo vídeo com você.",
        timestamp: new Date().toISOString(),
        isRead: true,
        userId: "artist-3",
        contentId: "casting-9",
        contentType: "album",
        avatarUrl: "https://i.pravatar.cc/150?img=20",
        category: "notification",
    },
    {
        id: "notif-8",
        type: "upload",
        title: "Nova publicação!",
        message: "Saag Weelli Boy publicou o single 'No Stress'.",
        timestamp: new Date().toISOString(),
        isRead: false,
        userId: "artist-1",
        contentId: "single-12",
        contentType: "single",
        avatarUrl: "https://placehold.co/150x150/FF6347/FFFFFF?text=NoStress",
        category: "notification",
    },
];

export const MOCKED_PROFILE: ArtistProfile[] = [
    {
        id: mockUserProfile.id, // 🧩 Usa o mesmo ID do UserProfile para ligação direta
        name: mockUserProfile.name,
        username: mockUserProfile.username,
        avatar: mockUserProfile.avatar,
        category: 'artist',
        bio: mockUserProfile.bio,
        genres: mockUserProfile.genres,
        followersCount: mockUserProfile.followersCount,
        followingCount: mockUserProfile.followingCount,
        singlesCount: mockUserProfile.singlesCount,
        epsCount: mockUserProfile.epsCount,
        albumsCount: mockUserProfile.albumsCount,
        freeBeatsCount: mockUserProfile.freeBeatsCount,
        exclusiveBeatsCount: mockUserProfile.exclusiveBeatsCount,
        hasMonetizationEnabled: mockUserProfile.hasMonetizationEnabled,
        releaseYear: mockUserProfile.releaseYear,
        location: mockUserProfile.location,
        // 🔥 Singles
        singles: [
            {
                id: "single-1",
                uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                title: "Cara ou Coroa",
                artist: "Saag Weelli Boy",
                artistId: "artist-saag-001",
                artistAvatar: "https://i.pravatar.cc/150?img=12",
                cover: "https://placehold.co/300x300/8A2BE2/FFFFFF?text=Cara+ou+Coroa",
                source: "library-cloud-feeds",
                duration: 210000,
                category: "single",
                genre: "Trap",
                releaseYear: "2024",
                viewsCount: 1050,
                comments: [
                    {
                        id: 'c1',
                        user: { name: 'Saag Weelli Boy', avatar: 'https://i.pravatar.cc/150?img=20' },
                        text: '🔥🔥 esse beat tá incrível!',
                        timestamp: 24092002,
                    },
                    {
                        id: 'c2',
                        user: { name: 'Producer X', avatar: 'https://i.pravatar.cc/150?img=21' },
                        text: 'Boom bap raiz, do jeito que gosto!',
                        timestamp: 24092002,
                    },
                    {
                        id: 'c3',
                        user: { name: 'Saag Weelli Boy', avatar: 'https://i.pravatar.cc/150?img=20' },
                        text: '🔥🔥 esse beat tá incrível!',
                        timestamp: 24092002,
                    },
                    {
                        id: 'c4',
                        user: { name: 'Producer X', avatar: 'https://i.pravatar.cc/150?img=21' },
                        text: 'Boom bap raiz, do jeito que gosto!',
                        timestamp: 24092002,
                    },
                ],
            },
            {
                id: 'single-2',
                uri: '[https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3](https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3)',
                title: 'Vibe Urbana',
                artist: 'BeatMaster',
                cover: '',
                artistAvatar: '[https://i.pravatar.cc/150?img=6](https://i.pravatar.cc/150?img=6)',
                source: 'library-cloud-feeds',
                duration: 180000,
                category: 'single', // Alterado 'type' para 'category' para consistência
                genre: 'Hip Hop',
                releaseYear: '2024', // Alterado 'viewsNumber' para 'releaseYear' ou similar
                viewsCount: 271, // Adicionada viewsCount se for relevante para Single
                comments: [
                    {
                        id: 'c1',
                        user: { name: 'Saag Weelli Boy', avatar: 'https://i.pravatar.cc/150?img=20' },
                        text: '🔥🔥 esse beat tá incrível!',
                        timestamp: 24092002,
                    },
                    {
                        id: 'c2',
                        user: { name: 'Producer X', avatar: 'https://i.pravatar.cc/150?img=21' },
                        text: 'Boom bap raiz, do jeito que gosto!',
                        timestamp: 24092002,
                    },
                    {
                        id: 'c3',
                        user: { name: 'Saag Weelli Boy', avatar: 'https://i.pravatar.cc/150?img=20' },
                        text: '🔥🔥 esse beat tá incrível!',
                        timestamp: 24092002,
                    },
                    {
                        id: 'c4',
                        user: { name: 'Producer X', avatar: 'https://i.pravatar.cc/150?img=21' },
                        text: 'Boom bap raiz, do jeito que gosto!',
                        timestamp: 24092002,
                    },
                ],
            },
        ],

        // 🔥 Álbuns
        albums: [
            {
                id: "album-1",
                title: "Retrospectiva Urbana",
                artist: "Saag Weelli Boy",
                artistId: "artist-saag-001",
                artistAvatar: "https://i.pravatar.cc/150?img=12",
                cover: "https://placehold.co/300x300/4682B4/FFFFFF?text=Album+Urbano",
                category: "album",
                releaseYear: "2023",
                mainGenre: "Trap",
                source: "library-cloud-feeds",
                tracks: [

                ], // pode linkar os singles mockados aqui
            },
        ],
        // 🔥 EPs
        eps: [
            {
                id: "ep-2",
                title: "Sons da Rua",
                artist: "Saag Weelli Boy",
                artistId: "artist-saag-001",
                artistAvatar: "https://i.pravatar.cc/150?img=12",
                cover: "https://placehold.co/300x300/DAA520/000000?text=EP+Rua",
                category: "ep",
                releaseYear: "2022",
                mainGenre: "Hip Hop",
                source: "library-cloud-feeds",
                tracks: [

                ],
            },
            {
                id: "ep-1",
                title: "Depressao",
                artist: "Saag Weelli Boy",
                artistId: "artist-saag-001",
                artistAvatar: "https://i.pravatar.cc/150?img=12",
                cover: "https://placehold.co/300x300/DAA520/000000?text=EP+Rua",
                category: "ep",
                releaseYear: "2022",
                mainGenre: "Hip Hop",
                source: "library-cloud-feeds",
                tracks: [

                ],
            },
        ],

        // 🔥 Free Beats
        freeBeats: [
            {
                id: "free-beat-1",
                uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                title: "Boom Bap Golden",
                artist: "Saag Weelli Boy",
                artistId: "artist-saag-001",
                artistAvatar: "https://i.pravatar.cc/150?img=12",
                producer: "Saag Weelli Boy",
                cover: "https://placehold.co/150x150/DAA520/000000?text=FreeBeat",
                source: "beatstore-feeds",
                duration: 200000,
                genre: "Boom Bap",
                isFree: true,
                typeUse: "free",
                category: "beat",
                bpm: 90,
                releaseYear: "2021",
                comments: [
                    {
                        id: 'c1',
                        user: { name: 'Saag Weelli Boy', avatar: 'https://i.pravatar.cc/150?img=20' },
                        text: '🔥🔥 esse beat tá incrível!',
                        timestamp: 24092002,
                    },
                    {
                        id: 'c2',
                        user: { name: 'Producer X', avatar: 'https://i.pravatar.cc/150?img=21' },
                        text: 'Boom bap raiz, do jeito que gosto!',
                        timestamp: 24092002,
                    },
                    {
                        id: 'c3',
                        user: { name: 'Saag Weelli Boy', avatar: 'https://i.pravatar.cc/150?img=20' },
                        text: '🔥🔥 esse beat tá incrível!',
                        timestamp: 24092002,
                    },
                    {
                        id: 'c4',
                        user: { name: 'Producer X', avatar: 'https://i.pravatar.cc/150?img=21' },
                        text: 'Boom bap raiz, do jeito que gosto!',
                        timestamp: 24092002,
                    },
                ],
            },
        ],

        // 🔥 Exclusive Beats
        exclusiveBeats: [
            {
                id: 'beat-store-1789',
                uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
                title: 'Trap Beat - "Midnight Groove"',
                artist: 'Producer X',
                producer: 'Producer X', // Adicionado produtor
                cover: 'https://placehold.co/150x150/8A2BE2/FFFFFF?text=BeatX',
                source: 'beatstore-feeds',
                duration: 180000,
                genre: 'Trap',
                price: 4999,
                typeUse: 'exclusive', // Usar typeUse para indicar se é exclusivo/gratuito
                category: 'beat', // Categoria é 'beat'
                bpm: 120,
                releaseYear: '2023', // Adicionado releaseYear
                artistId: mockUserProfile.id,
                isAvailableForSale: true,
                isExclusiveSale: true,
                // NOVOS CAMPOS DE LOCALIZAÇÃO E MOEDA
                region: 'pt-AO',       // Locale do produtor/vendedor (ex: Angola)
                currency: 'AOA',       // Código da moeda (Kwanza angolano)
            }
        ],

        // ✅ DADOS DE EXEMPLO PARA FOLLOWERS
        followers: [
            {
                id: "user-alice",
                name: "Alice Faria",
                username: "@faria_alice",
                avatar: "https://i.pravatar.cc/150?img=2",
            },
            {
                id: "user-bob",
                name: "Bob Manuel",
                username: "@bob_m_beats",
                avatar: "https://i.pravatar.cc/150?img=5",
            },
            {
                id: "user-carol",
                name: "Carla Diniz",
                username: "@carla_oficial",
                avatar: "https://i.pravatar.cc/150?img=3",
            },
            {
                id: "artist-x",
                name: "BeatMaster Pro",
                username: "@master_pro_beats",
                avatar: "https://i.pravatar.cc/150?img=10",
            },
            {
                id: "artist-y",
                name: "Zara Vibes",
                username: "@zara_vibes",
                avatar: "https://i.pravatar.cc/150?img=15",
            },
            {
                id: "artist-z",
                name: "Daniel Dennis",
                username: "@zara_vibes",
                avatar: "https://i.pravatar.cc/150?img=15",
            },
            {
                id: "artist-h",
                name: "Kalahari Dié",
                username: "@zara_vibes",
                avatar: "https://i.pravatar.cc/150?img=15",
            },
            {
                id: "artist-o",
                name: "TrappStar Go edition",
                username: "@zara_vibes",
                avatar: "https://i.pravatar.cc/150?img=15",
            },
        ],

        // ✅ DADOS DE EXEMPLO PARA FOLLOWING
        following: [
            {
                id: "artist-x",
                name: "BeatMaster Pro",
                username: "@master_pro_beats",
                avatar: "https://i.pravatar.cc/150?img=10",
            },
            {
                id: "artist-y",
                name: "Zara Vibes",
                username: "@zara_vibes",
                avatar: "https://i.pravatar.cc/150?img=15",
            },
            {
                id: "artist-z",
                name: "Daniel Dennis",
                username: "@zara_vibes",
                avatar: "https://i.pravatar.cc/150?img=15",
            },
            {
                id: "artist-h",
                name: "Kalahari Dié",
                username: "@zara_vibes",
                avatar: "https://i.pravatar.cc/150?img=15",
            },
            {
                id: "artist-o",
                name: "TrappStar Go edition",
                username: "@zara_vibes",
                avatar: "https://i.pravatar.cc/150?img=15",
            },
        ],

    },
];