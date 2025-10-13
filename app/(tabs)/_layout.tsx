//app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs, } from 'expo-router';
import { Image, } from 'react-native';
import Colors from '@/constants/Colors'; // Usaremos para definir cor do fundo
import AudioPlayerBar from '@/components/globalPlayer/audioPlayerBar';

export default function TabLayout() {
  // Tema fixo como 'dark'
  const scheme = 'dark';
  return (
    <>
      <AudioPlayerBar />

      <Tabs
        screenOptions={{
          headerTitleStyle: { color: '#fff' },
          tabBarShowLabel: true, // Remove texto das abas
          headerShown: false, // Mostra o cabeçalho superior
          tabBarLabelStyle: {
            fontSize: 12,
            color: '#fff'
          },

          //Estilo do cabeçalho inferior
          tabBarStyle: {
            backgroundColor: Colors[scheme].background, // Fundo escuro
            borderTopColor: Colors[scheme].background, // Linha de topo da tab bar
            height: 60,
            paddingBottom: 5,
          },
          tabBarLabelPosition: 'below-icon',
          //Estilo do cabeçalho superior
          headerStyle: {
            backgroundColor: Colors[scheme].background,
            borderBottomColor: Colors[scheme].background,
          }

        }}
      >

        <Tabs.Screen
          name="index" //Tela Perfil está em /app/(tabs)/index.tsx
          options={{
            title: 'Perfil',
            tabBarLabel: 'Perfil',
            tabBarIcon: ({ focused }) => (
              <Image
                source={
                  focused
                    ? require('@/assets/images/1/icon_profile_white_120px.png') // Ícone quando ativo
                    : require('@/assets/images/1/icon_profile_dark_120px.png')  // Ícone quando inativo
                }
                style={{
                  width: 30,
                  height: 30,
                  opacity: focused ? 1 : 0.5,
                }}

              />

            ),

          }}
        />
        <Tabs.Screen
          name="beatstore" //Tela loja de beats está em /app/(tabs)/beatstore.tsx
          options={{
            title: 'Loja de beats',
            tabBarLabel: 'Loja de beats',
            tabBarIcon: ({ focused }) => (
              <Image
                source={
                  focused
                    ? require('@/assets/images/1/icon_beatstore_white_120px.png')  // Ícone quando ativo
                    : require('@/assets/images/1/icon_beatstore_dark_120px.png')   // Ícone quando inativo
                }
                style={{
                  width: 30,
                  height: 30,
                  opacity: focused ? 1 : 0.5,
                }}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="library" // Tela Musicas está em /app/(tabs)/library.tsx
          options={{
            title: 'Músicas',
            tabBarLabel: 'Músicas',
            tabBarIcon: ({ focused }) => (
              <Image
                source={
                  focused
                    ? require('@/assets/images/1/icon_library_white_120px.png') // Ícone quando ativo
                    : require('@/assets/images/1/icon_library_dark_120px.png') // Ícone quando inativo
                }
                style={{
                  width: 30,
                  height: 30,
                  opacity: focused ? 1 : 0.5,
                }}
              />
            ),
          }}
        />

      </Tabs>
    </>
  );
}


/*
import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[scheme].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tab One',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[scheme].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Tab Two',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
    </Tabs>
  );
}
*/


