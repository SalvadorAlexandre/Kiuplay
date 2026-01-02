//components/navigation/LibraryHeader
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { headerLibraryBeatStoreStyles as styles } from './styles/headerLibraryBeatStoreStyles';


interface LibraryHeaderProps {
    t: (key: string) => string;
    router: any;
}

const LibraryHeader = ({ t, router }: LibraryHeaderProps) => {
    return (
        <View style={styles.containerTopBar}>
            <Text style={styles.titleTopBar} numberOfLines={1}>
                {t('screens.libraryTitle')}
            </Text>

            <TouchableOpacity
                onPress={() => router.push('/audioLocalComponent/useMusicLocalList')}
                style={styles.buttonTopBar}
                activeOpacity={0.7}
            >
                <Ionicons name='menu-outline' size={26} color='#fff' />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.push('/favoriteScreens/libraryFavoritesScreens')}
                style={styles.buttonTopBar}
                activeOpacity={0.7}
            >
                <Ionicons name='heart-outline' size={26} color='#fff' />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.push('/searchScreens/searchLibrary')}
                style={styles.buttonTopBar}
                activeOpacity={0.7}
            >
                <Ionicons name='search-outline' size={26} color='#fff' />
            </TouchableOpacity>
        </View>
    );
};


export default LibraryHeader;