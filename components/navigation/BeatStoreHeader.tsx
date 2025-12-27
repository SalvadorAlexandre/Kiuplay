import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { headerLibraryBeatStoreStyles as styles } from './styles/headerLibraryBeatStoreStyles';



interface BeatStoreHeaderProps {
    t: (key: string) => string;
    router: any;
}

const BeatStoreHeader = ({ t, router }: BeatStoreHeaderProps) => {
    return (
        <View style={styles.containerTopBar}>
            <Text style={styles.titleTopBar} numberOfLines={1}>
                {t('screens.beatStoreTitle')}
            </Text>

            {/** BTN DE CURTIDOS */}
            <TouchableOpacity
                onPress={() => router.push('/favoriteScreens/beatStoreFavoritesScreen')}
                style={styles.buttonTopBar}
                activeOpacity={0.7}
            >
                <Ionicons name='heart-outline' size={26} color='#fff' />
            </TouchableOpacity>

            {/** BTN DE PESQUISA */}
            <TouchableOpacity
                onPress={() => router.push(`/searchScreens/searchBeatStore`)}
                style={styles.buttonTopBar}
                activeOpacity={0.7}
            >
                <Ionicons name='search-outline' size={26} color='#fff' />
            </TouchableOpacity>
        </View>
    );
};

export default BeatStoreHeader;