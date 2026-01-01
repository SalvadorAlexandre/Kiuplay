import { StyleSheet } from "react-native";


export const playerStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    backgroundColor: '#111',
    borderTopWidth: 1,
    borderTopColor: '#222',
    zIndex: 99,
    elevation: 10,
  },
  minimizedBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    height: 68,
  },
  minimizedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  minimizedCover: {
    width: 48,
    height: 48,
    borderRadius: 4,
  },
  progressContainer: {
    height: 2,
    backgroundColor: '#333',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1E90FF',
  },
  expandedContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  expandedHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  expandedCover: {
    width: '94%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#222',
    resizeMode: 'stretch'
  },
  slider: {
    width: '100%',
    marginTop: 20,
  },
  timeContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timeText: {
    color: '#aaa',
    fontSize: 12,
  },
  trackTitle: {
    color: '#fff',
    fontSize: 14,
  },
  artistName: {
    color: '#ccc',
    fontSize: 12,
  },
  artistMainName: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 1,
  },
  errorContainer: {
    backgroundColor: 'rgba(255,0,0,0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    resizeMode: "cover"
  },
  expandedScrollView: {
    flex: 1,
  },
  expandedScrollContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 25,
    resizeMode: 'cover',
  },
  iconActions: {
    width: 25,
    height: 25,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
    padding: 30,
  },

  repeatBadge: {
    position: 'absolute',
    backgroundColor: '#1E90FF',
    borderRadius: 7,
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
    right: -4,
    top: -2,
    borderWidth: 1,
    borderColor: '#111'
  },
  repeatBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  minimizedContainer: {
    position: 'absolute',
    bottom: 60,
    height: 68,
  },

  expandedContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    height:
      '100%',
    width: '100%',
  },
});