import { StyleSheet } from "react-native";


export const ArtistStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#191919',
    },
    scrollContent: {
        paddingVertical: 20,
        paddingHorizontal: 15,
    },
    artistAvatar: {
        width: 120,
        height: 120,
        borderRadius: 75,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: '#1E90FF',
    },
    artistNameProfile: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    artistUserName: {
        fontSize: 15,
        color: '#bbb',
        marginBottom: 5,
    },
    artistFollowers: {
        fontSize: 16,
        color: '#aaa',
        marginBottom: 5,
    },
    artistGenres: {
        fontSize: 14,
        color: '#bbb',
        marginBottom: 5,
    },
    artistBio: {
        fontSize: 16,
        color: '#ccc',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 24,
    },
    headerBar: {
        marginTop: 39,
        width: '100%',
        marginBottom: 10,
        paddingHorizontal: 25,
        flexDirection: 'row',
    },
    buttonFollowers: {
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 25,
        marginTop: 10,
        marginBottom: 30,
        minWidth: 150, // Garante que o botão tenha um tamanho mínimo
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonVideo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    // NOVO: Estilo para quando o botão está no estado "Seguir"
    buttonFollow: {
        backgroundColor: '#1E90FF',
    },
    // NOVO: Estilo para quando o botão está no estado "Seguindo"
    buttonFollowing: {
        backgroundColor: '#333', // Uma cor mais neutra para indicar que já está seguindo
        borderWidth: 1,
        borderColor: '#555',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 16,
        color: '#fff',
        marginTop: 10,
        marginBottom: 15,
    },
    contentList: {
        paddingHorizontal: 5,
        marginBottom: 20,
    },
    contentItem: {
        alignItems: 'center',
        marginRight: 15,
        width: 120,
    },
    contentCover: {
        width: 100,
        height: 100,
        borderRadius: 4,
        marginBottom: 8,
    },
    contentTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 4,
    },
    contentType: {
        color: '#aaa',
        fontSize: 12,
        textAlign: 'center',
    },
    backButton: {
        marginTop: 20,
        padding: 10,
    },
    backButtonText: {
        color: '#1E90FF',
        fontSize: 16,
    },
    errorContainer: {
        flex: 1,
        backgroundColor: '#191919',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
    trackListContent: {
        paddingBottom: 100,
    },
    emptyListText: {
        color: '#bbb',
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
    },
    texto: {
        color: '#fff',
        fontSize: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },


    tabsContainer: {
        flexDirection: 'row',
        marginVertical: 10,
    },
    tabButton: {
        paddingHorizontal: 12,
        borderRadius: 20,
        paddingVertical: 8,
        backgroundColor: '#222',
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeTabButton: {
        backgroundColor: '#1e90ff',
    },
    tabText: {
        color: '#aaa',
        fontSize: 14,
    },
    activeTabText: {
        color: '#fff',
    },
    columnWrapper: {
        justifyContent: "space-between"
    }

});