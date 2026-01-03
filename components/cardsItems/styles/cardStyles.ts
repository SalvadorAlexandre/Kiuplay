import { StyleSheet, Platform } from 'react-native';

export const cardStyles = StyleSheet.create({
  cardContainer: {
    width: '49%',
    height: 260,
    marginBottom: 8,
    backgroundColor: '#282828',
    borderRadius: 8,
    overflow: 'hidden',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  blurLayer: {
    flex: 1,
    padding: 7,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 1,
  },
  mainContentWrapper: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    flex: 1,
    borderRadius: 8,
    padding: 5,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardCoverImage: {
    width: 110,
    height: 110,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#333',
  },
  musicDetails: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 4,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
  },
  cardSubtitle: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 6,
    textAlign: 'center',
  },
  infoRow: {
    //flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardDetailText: {
    color: '#bbb',
    fontSize: 11,
  },
  dotSeparator: {
    color: '#666',
    fontSize: 11,
  },
  cardTypeLabelText: {
    color: '#1E90FF', // Destaque para o tipo de conteúdo
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
    letterSpacing: 1,
  },
});