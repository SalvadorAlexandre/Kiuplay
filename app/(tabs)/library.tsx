import React from 'react';
import TopTabBarLibrary from '@/components/topTabBarLibraryScreen';
import { useSelectedMusic, TypeMusic } from '@/hooks/useSelectedMusic';
import useSubTabSelectorLibrary, { TypeSubTab } from '@/hooks/useSubTabSelectorLibrary';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

const SubTabBar = ({
  tabs,
  group,
  isSelectedSubTab,
  selectSubTab,
}: {
  tabs: TypeSubTab[];
  group: 'local' | 'cloud';
  isSelectedSubTab: (group: 'local' | 'cloud', tab: TypeSubTab) => boolean;
  selectSubTab: (group: 'local' | 'cloud', tab: TypeSubTab) => void;
}) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={{ marginHorizontal: 20 }}
          onPress={() => selectSubTab(group, tab)}
        >
          <Text
            style={[
              { color: '#fff', fontSize: 18 },
              isSelectedSubTab(group, tab) && {
                borderBottomWidth: 2,
                borderBottomColor: '#1565C0',
                color: '#1565C0',
              },
            ]}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default function LibraryScreen() {
  const { selectedLibraryContent, setSelectedLibraryContent } = useSelectedMusic();

  const {
    isSelectedSubTab,
    selectSubTab,
    getSelectedSubTab,
  } = useSubTabSelectorLibrary();

  const isSelected = (current: TypeMusic, type: TypeMusic): boolean => {
    return current === type;
  };

  const localTabs: TypeSubTab[] = ['tudo', 'pastas', 'downloads'];
  const cloudTabs: TypeSubTab[] = ['feeds', 'curtidas', 'seguindo'];

  return (
    <View style={{ flex: 1, backgroundColor: '#191919' }}>
      <TopTabBarLibrary />

      <View style={{ marginTop: 10 }}>
        {selectedLibraryContent === 'local' && (
          <View>
            <Text style={styles.title}>Curtir músicas em offline!</Text>
            <SubTabBar
              tabs={localTabs}
              group="local"
              isSelectedSubTab={isSelectedSubTab}
              selectSubTab={selectSubTab}
            />
          </View>
        )}

        {selectedLibraryContent === 'cloud' && (
          <View>
            <Text style={styles.title}>Ouvir músicas na cloud!</Text>
            <SubTabBar
              tabs={cloudTabs}
              group="cloud"
              isSelectedSubTab={isSelectedSubTab}
              selectSubTab={selectSubTab}
            />
          </View>
        )}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ color: '#fff', margin: 20 }}>Conteúdo aqui...</Text>

        {selectedLibraryContent === 'local' && (
          <>
            {getSelectedSubTab('local') === 'tudo' && <Text style={styles.text}>Mostrando tudo</Text>}
            {getSelectedSubTab('local') === 'pastas' && <Text style={styles.text}>Mostrando pastas</Text>}
            {getSelectedSubTab('local') === 'downloads' && <Text style={styles.text}>Mostrando downloads</Text>}
          </>
        )}

        {selectedLibraryContent === 'cloud' && (
          <>
            {getSelectedSubTab('cloud') === 'feeds' && <Text style={styles.text}>Mostrando feeds</Text>}
            {getSelectedSubTab('cloud') === 'curtidas' && <Text style={styles.text}>Mostrando curtidas</Text>}
            {getSelectedSubTab('cloud') === 'seguindo' && <Text style={styles.text}>Mostrando seguindo</Text>}
          </>
        )}
      </ScrollView>

      <View style={styles.floatingBox}>
        <TouchableOpacity
          style={[
            styles.buttonPlayCloud,
            isSelected(selectedLibraryContent, 'cloud') && styles.workButtonSelected,
          ]}
          onPress={() => setSelectedLibraryContent('cloud')}
        >
          <Image
            source={require('@/assets/images/4/icons8_sound_cloud_120px_1.png')}
            style={{ width: 40, height: 40, marginBottom: -10 }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.buttonPlayLocal,
            isSelected(selectedLibraryContent, 'local') && styles.workButtonSelected,
          ]}
          onPress={() => setSelectedLibraryContent('local')}
        >
          <Image
            source={require('@/assets/images/4/icons8_music_folder_120px.png')}
            style={{ width: 40, height: 40, marginTop: -10 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#191919',
  },
  container: {
    flexGrow: 1,
  },
  title: {
    color: '#fff',
    marginTop: -20,
    marginLeft: 15,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  floatingBox: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    paddingVertical: 10,
    height: 100,
    width: 70,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  buttonPlayLocal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: -20,
  },
  buttonPlayCloud: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: -20,
  },
  workButtonSelected: {
    backgroundColor: '#7F7F7F',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    margin: 20,
  },
});