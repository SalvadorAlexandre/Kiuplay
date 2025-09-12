//components/promoteContentScreen/selectContentScreen
import React, { useState } from 'react';
import { router, Stack } from 'expo-router';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';


export default function SelectContentScreen() {
  const tabs = ['Single', 'Extended Play', 'Album', 'Exclusive Beats', 'Free Beats',];
  const [activeTab, setActiveTab] = useState('Single');


  return (
    <>
      <Stack.Screen
        options={{
          title: 'Selecionar conteúdo',
          headerStyle: { backgroundColor: '#191919' },
          headerTintColor: '#fff',
          headerShown: true,
        }}
      />
      <View style={{ flex: 1, backgroundColor: '#191919' }}>

        <View style={{}}>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabsContainer}
          >
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabButton,
                  activeTab === tab && styles.activeTabButton,
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

        </View>

        <ScrollView
          style={{ flex: 1, paddingHorizontal: 10,}}
          horizontal={false}
          showsHorizontalScrollIndicator={false}
        >

        </ScrollView>

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 10, paddingHorizontal: 10 }}>
          <TouchableOpacity
            style={styles.buttonLoadContent}
            onPress={() => router.push('/promoteContentScreens/selectContentScreen')}
          >
            <Text style={{ color: '#fff', fontSize: 16, marginLeft: 10, }}>Comtinuar (Promoção Premium)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({



  buttonLoadContent: {
    //flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1565C0',
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#555',
    //alignSelf: 'flex-start',
    //marginRight: 15,
    //marginBottom: 12,
    //padding: 6,  // Espaçamento interno do botão
  },


  tabsContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  tabButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
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
});