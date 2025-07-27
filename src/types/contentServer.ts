


import { LibraryFeedItem, BeatStoreFeedItem, VideoFeedItem, Album, ArtistProfile, Single, ExtendedPlayEP, ExclusiveBeat, FreeBeat, Video } from '@/src/types/contentType';

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
        videos: [
            {
                id: '7',
                title: 'Energia Vibrante',
                artist: 'DJ G',
                artistId: 'artist7',
                //artistProfileImageUrl: 'https://i.pravatar.cc/150?img=7',
                //thumbnail: 'https://i.ytimg.com/vi/xM6uD7n1BfQ/hqdefault.jpg',
                videoUrl: 'http://d23dyxekqfd0rc.cloudfront.net/c.mp4',
                category: 'video',
                releaseDate: '',
            },
            {
                id: '8',
                title: 'Reflexões Profundas',
                artist: 'Poeta H',
                artistId: 'artist8',
                //artistProfileImageUrl: 'https://i.pravatar.cc/150?img=8',
                //thumbnail: 'https://i.ytimg.com/vi/wA5wA5wA5wA/hqdefault.jpg',
                videoUrl: 'http://d23dyxekqfd0rc.cloudfront.net/d.mp4',
                category: 'video',
                releaseDate: '',
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
        videos: [],
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


export const MOCKED_VIDEO_FEED_DATA: VideoFeedItem[] = [
    {
        id: '1',
        title: 'Minha Música Perfeita',
        artist: 'Artista A',
        artistId: 'artist1',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnail: 'https://i.ytimg.com/vi/M7lc1UVf-VE/hqdefault.jpg',
        artistProfileImageUrl: 'https://i.pravatar.cc/150?img=1',
        category: 'video',
        releaseDate: '12/3/2025'
    } as Video,
    {
        id: '2',
        title: 'Ritmo da Cidade Noturna',
        artist: 'Banda B',
        artistId: 'artist2',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
        artistProfileImageUrl: 'https://i.pravatar.cc/150?img=2',
        category: 'video',
        releaseDate: '',


    } as Video,
    {
        id: '3',
        title: 'Noite Estrelada de Verão',
        artist: 'Cantor C',
        artistId: 'artist3',
        artistProfileImageUrl: 'https://i.pravatar.cc/150?img=3',
        thumbnail: 'https://i.ytimg.com/vi/3y7Kq2l_k6w/hqdefault.jpg',
        videoUrl: 'http://d23dyxekqfd0rc.cloudfront.net/c.mp4',
        category: 'video',
        releaseDate: '',
    } as Video,
    {
        id: '4',
        title: 'Sons da Natureza Selvagem',
        artist: 'Grupo D',
        artistId: 'artist4',
        artistProfileImageUrl: 'https://i.pravatar.cc/150?img=4',
        thumbnail: 'https://i.ytimg.com/vi/F-glUq_jWv0/hqdefault.jpg',
        videoUrl: 'http://d23dyxekqfd0rc.cloudfront.net/d.mp4',
        category: 'video',
        releaseDate: '',
    } as Video,
    {
        id: '5',
        title: 'Caminhos da Descoberta',
        artist: 'Artista E',
        artistId: 'artist5',
        artistProfileImageUrl: 'https://i.pravatar.cc/150?img=5',
        thumbnail: 'https://i.ytimg.com/vi/2N7TfX6f4oM/hqdefault.jpg',
        videoUrl: 'http://d23dyxekqfd0rc.cloudfront.net/a.mp4',
        category: 'video',
        releaseDate: '',
    } as Video,
    {
        id: '6',
        title: 'Amanhecer Dourado',
        artist: 'Solista F',
        artistId: 'artist6',
        artistProfileImageUrl: 'https://i.pravatar.cc/150?img=6',
        thumbnail: 'https://i.ytimg.com/vi/eJk8e8e8e8e/hqdefault.jpg',
        videoUrl: 'http://d23dyxekqfd0rc.cloudfront.net/b.mp4',
        category: 'video',
        releaseDate: '',
    } as Video,
    {
        id: '7',
        title: 'Energia Vibrante',
        artist: 'DJ G',
        artistId: 'artist7',
        artistProfileImageUrl: 'https://i.pravatar.cc/150?img=7',
        thumbnail: 'https://i.ytimg.com/vi/xM6uD7n1BfQ/hqdefault.jpg',
        videoUrl: 'http://d23dyxekqfd0rc.cloudfront.net/c.mp4',
        category: 'video',
        releaseDate: '',
    } as Video,
    {
        id: '8',
        title: 'Reflexões Profundas',
        artist: 'Poeta H',
        artistId: 'artist8',
        artistProfileImageUrl: 'https://i.pravatar.cc/150?img=8',
        thumbnail: 'https://i.ytimg.com/vi/wA5wA5wA5wA/hqdefault.jpg',
        videoUrl: 'http://d23dyxekqfd0rc.cloudfront.net/d.mp4',
        category: 'video',
        releaseDate: '',
    } as Video,
]


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
    } as ExclusiveBeat,
];