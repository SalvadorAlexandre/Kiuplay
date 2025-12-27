import { StyleSheet } from 'react-native';

export const feedStyles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#191919',
    },
    flatlistColumn: {
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    centerLoader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        marginTop: 100,
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyText: {
        color: '#bbb',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 15,
        marginBottom: 20,
        lineHeight: 22,
    },
    retryButton: {
        flexDirection: 'row',
        backgroundColor: '#333',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 25,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#444',
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    // Estilo extra para o botão flutuante da BeatStore (pode ficar aqui ou na tela)
    floatingButton: {
        position: 'absolute',
        bottom: 110,
        right: 25,
        width: 60,
        height: 60,
        backgroundColor: '#1565C0',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
});