import { StyleSheet, } from 'react-native';

export const headerLibraryBeatStoreStyles = StyleSheet.create({
    containerTopBar: {
        backgroundColor: '#191919',
        paddingVertical: 20,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderColor: '#252525', // Uma cor levemente diferente para separar sutilmente
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    titleTopBar: {
        color: '#fff',
        fontSize: 22, // Aumentado levemente para destaque
        fontWeight: 'bold',
        flex: 1,
    },
    buttonTopBar: {
        padding: 6,
    },
});
