//src/types/contentServer.ts

import { LibraryFeedItem, BeatStoreFeedItem, Album, ArtistProfile, Single, ExtendedPlayEP, ExclusiveBeat, FreeBeat, } from '@/src/types/contentType';

import { Notification } from '@/src/types/contentType';


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
        isBuyed: true,
    } as ExclusiveBeat,
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
        price: 79.00,
        typeUse: 'exclusive', // Usar typeUse
        category: 'beat', // Categoria é 'beat'
        bpm: 102,
        releaseYear: '2024', // Adicionado releaseYear
        isBuyed: true,
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
        price: 65.50,
        typeUse: 'exclusive', // Usar typeUse
        category: 'beat', // Categoria é 'beat'
        bpm: 85,
        releaseYear: '2024', // Adicionado releaseYear
        isBuyed: false,
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
        message: "Confira a promoção exclusiva do beat 'Trap Soul - Smooth Operator'.",
        timestamp: new Date().toISOString(),
        isRead: false,
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
];

export const MOCKED_PROFILE: ArtistProfile[] = [
    {
        id: "artist-saag-001",
        name: "Saag Weelli Boy",
        username: "@saag_swb_oficial",
        avatar: "https://i.pravatar.cc/150?img=12",
        category: "artist",
        bio: "Artista angolano explorando Trap, Hip Hop e Afrobeat.",
        genres: ["Trap", "Hip Hop", "Afrobeat"],

        followersCount: 12450,
        followingCount: 320,
        singlesCount: 1,
        epsCount: 1,
        albumsCount: 1,
        freeBeatsCount: 1,
        exclusiveBeatsCount: 1,
        hasMonetizationEnabled: true,
        releaseYear: "2018",

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
            },
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
            },
        ],

        // 🔥 Exclusive Beats
        exclusiveBeats: [
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
                isBuyed: false,
            },
        ],
    },
];