import { StyleSheet } from "react-native";



export const profileStyles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#191919',
  },
  container: {
    flexGrow: 1,
  },
  content: {
    flexDirection: 'row',
  },
  box: {
    width: 200,
    height: 200,
    marginRight: 20,
    backgroundColor: '#1e1e1e',
    color: '#fff',
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 200,
    borderRadius: 10
  },
  profileText: {
    color: '#fff',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  imageContainer: {
    flex: 1
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 75,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#1E90FF',
    resizeMode: 'stretch'
  },
  statsTable: {
    marginTop: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    //marginBottom: 1,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    borderColor: '#0083D0',
    paddingVertical: 10,
    marginHorizontal: 5,
    padding: 10,
    margin: 10,
  },
  statValue: {
    color: '#fff',
    fontSize: 16,
  },
  statLabel: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 2,
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flexShrink: 1,
    flexWrap: 'wrap',
    marginLeft: 15,
    textAlign: 'center',
  },
  userHandle: {
    color: '#aaa',
    fontSize: 13,
    marginTop: 2,
    marginLeft: 15,
    textAlign: 'center',
  },
  profileContainer: {
    paddingHorizontal: 15,
    width: '100%',
    alignSelf: 'center',
  },
  workButton: {
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#222',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: {
    color: '#fff',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  buttonContainer: {
    //marginBottom: 5,
    //width: '100%',
    //backgroundColor: '#fff',
    overflow: 'hidden',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  iconLeft: {
    width: 26,
    height: 26,
    marginRight: 10,
  },
  buttonText: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },

  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    //backgroundColor: '#fff',
    padding: 10
    //height: 20,        // 🔹 altura fixa suficiente para os botões
  },

  tabButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#222',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 34,   // altura fixa dos botões
    flexShrink: 0,
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

  containerTopBar: {
    paddingVertical: 20,             // Espaçamento vertical (topo e baixo)
    paddingHorizontal: 16,           // Espaçamento lateral (esquerda e direita)
    flexDirection: 'row',            // Organiza os itens em linha (horizontal)
    alignItems: 'center',            // Alinha verticalmente ao centro
    justifyContent: 'space-between',
  },
  buttonTopBar: {
    padding: 6,  // Espaçamento interno do botão
  },
  titleTopBar: {
    color: '#fff',
    fontSize: 20,
    //flex: 1,
    //textAlign: 'center',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});