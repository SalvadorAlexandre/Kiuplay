import React, { useState } from 'react'
import { useSelectedMyContent, MyPostsType } from '@/hooks/useSelectedMyContent';
import { Ionicons } from '@expo/vector-icons';
import { router, } from 'expo-router';
import TopTabBarProfile from '@/components/topTabBarProfileScreen';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  // KeyboardAvoidingView,
} from 'react-native';


export default function ProfileScreen() {

  /**
   * Função auxiliar que verifica se um tipo de conteúdo está atualmente selecionado.
   * @param current - Conteúdo atualmente selecionado.
   * @param type - Tipo a ser verificado.
   * @returns true se for o mesmo tipo, false caso contrário.
   */
  const isSelected = (current: MyPostsType, type: MyPostsType): boolean => {
    return current === type;
  };

  //Hook que verifica se um btn dos meus conteudos está checked
  const { selectedProfileMyContent, setSelectedProfileMyContent } = useSelectedMyContent()

  //hooks para o btn configuraçoes do perfil----------------------------------------------
  const [scaleValueConfig] = useState(new Animated.Value(1))
  const handlePressInConfig = () => {
    Animated.spring(scaleValueConfig, { toValue: 0.96, useNativeDriver: true, }).start()
  }
  const handlePressOutConfig = () => {
    Animated.spring(scaleValueConfig, { toValue: 1, useNativeDriver: true, }).start()
  }
  //---------------------------------------------------------------------------------------

  //hooks para o btn configuraçoes do uploads----------------------------------------------
  const [scaleValueUploads] = useState(new Animated.Value(1))
  const handlePressInUploads = () => {
    Animated.spring(scaleValueUploads, { toValue: 0.96, useNativeDriver: true, }).start()
  }
  const handlePressOutUploads = () => {
    Animated.spring(scaleValueUploads, { toValue: 1, useNativeDriver: true, }).start()
  }
  //---------------------------------------------------------------------------------------

  //hooks para o btn configuraçoes dos Insight----------------------------------------------
  const [scaleValueInsight] = useState(new Animated.Value(1))
  const handlePressInInsight = () => {
    Animated.spring(scaleValueInsight, { toValue: 0.96, useNativeDriver: true, }).start()
  }
  const handlePressOutInsight = () => {
    Animated.spring(scaleValueInsight, { toValue: 1, useNativeDriver: true, }).start()
  }
  //---------------------------------------------------------------------------------------

  //hooks para o btn Monetization----------------------------------------------
  const [scaleValueMonetization] = useState(new Animated.Value(1))
  const handlePressInMonetization = () => {
    Animated.spring(scaleValueMonetization, { toValue: 0.96, useNativeDriver: true, }).start()
  }
  const handlePressOutMonetization = () => {
    Animated.spring(scaleValueMonetization, { toValue: 1, useNativeDriver: true, }).start()
  }
  //---------------------------------------------------------------------------------------

  return (

    <View style={{ flex: 1, backgroundColor: '#191919' }}>

      <TopTabBarProfile />

      <ScrollView
        horizontal={false} // Garante que esta rolagem seja vertical
        style={styles.scroll} // Aplica o estilo de fundo escuro
        contentContainerStyle={styles.container} // Define padding e crescimento do conteúdo
        showsHorizontalScrollIndicator={false} //Oculta a barra de rolagem
      >

        {/*View da visão Geral do perfil--------------------------------------------------*/}
        <View style={styles.profileContainer}>
          {/*Outros elementos estarao aqui dentro (elementos do perfil)*/}

          <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

            <View style={styles.imageContainer}>
              <Image // Imagem do perfil
                source={require('@/assets/images/Default_Profile_Icon/icon_profile_white_120px.png')} // imagem padrão
                style={styles.profileImage}
                resizeMode="contain"
              />
            </View>

            {/*Mostrar o nome e o arroba do utilizador*/}
            <View>
              <Text style={styles.userName}>Saag Weelli Boy</Text>
              <Text style={styles.userHandle}>@saag_swb_oficial</Text>
            </View>

          </View>


          {/* Estatísticas: seguindo, seguidores, singles, EPs, álbuns */}
          <View style={styles.statsRow}>

            {/*Mostrar o numero de pessoas que segue*/}
            <View style={styles.statBox}>
              <Text style={styles.statValue}>120</Text>
              <Text style={styles.statLabel}>Seguindo</Text>
            </View>

            {/*Mostrar o numero de seguidores*/}
            <View style={styles.statBox}>
              <Text style={styles.statValue}>450</Text>
              <Text style={styles.statLabel}>Seguidores</Text>
            </View>

            {/*Mostrar o numero de singles publicados*/}
            <View style={styles.statBox}>
              <Text style={styles.statValue}>8</Text>
              <Text style={styles.statLabel}>Singles</Text>
            </View>

            {/*Mostrar o numero de EP`s publicadas*/}
            <View style={styles.statBox}>
              <Text style={styles.statValue}>2</Text>
              <Text style={styles.statLabel}>EPs</Text>
            </View>

            {/*Mostrar o numero de Albuns publicados-----*/}
            <View style={styles.statBox}>
              <Text style={styles.statValue}>1</Text>
              <Text style={styles.statLabel}>Álbuns</Text>
            </View>
          </View>

        </View>


        {/*View das configuracao do perfil-----------------------------------------------------------------*/}
        <Animated.View style={[
          styles.buttonContainer,
          { transform: [{ scale: scaleValueConfig }] } // Aplica a animação
        ]}>
          <TouchableOpacity
            onPressIn={handlePressInConfig}    // Aciona ao pressionar
            onPressOut={handlePressOutConfig}  // Aciona ao soltar
            onPress={() => router.push('/profileScreens/useProfileSettingsScreen')} // Exemplo de ação
            style={styles.buttonContent} // Estilo interno
          >
            {/* Ícone esquerdo */}
            <Image
              source={require('@/assets/images/2/icons8_user_settings_120px.png')}
              style={styles.iconLeft}
            />

            {/* Texto do botão */}
            <Text style={styles.buttonText}>Configurações do perfil</Text>

            {/* Ícone seta para direita */}
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
        {/*View das configuracao do perfil-----------------------------------------------------------------*/}

        {/*View do botão para entrar na tela de monetização-----------------------------------------------------------------*/}
        <Animated.View style={[
          styles.buttonContainer,
          { transform: [{ scale: scaleValueMonetization }] } // Animação de clique
        ]}>
          <TouchableOpacity
            onPressIn={handlePressInMonetization}    // Aciona ao pressionar
            onPressOut={handlePressOutMonetization} // Aciona ao soltar
            onPress={() => router.push('/profileScreens/useMonetizationScreen')} // Ação
            style={styles.buttonContent} // Estilo interno
          >
            {/* Ícone esquerdo (ícone de monetização*/}
            <Image
              source={require('@/assets/images/2/icons8_euro_money_120px.png')} // Troque pelo seu ícone
              style={styles.iconLeft}
            />

            {/* Texto do botão */}
            <Text style={styles.buttonText}>Kiuplay Monetization</Text>

            {/* Ícone seta para direita */}
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
        {/*View do botão para entrar na tela de monetização-----------------------------------------------------------------*/}

        {/*View do botão Fazer Uploads-----------------------------------------------------------------*/}
        <Animated.View style={[
          styles.buttonContainer,
          { transform: [{ scale: scaleValueUploads }] } // Animação de clique
        ]}>
          <TouchableOpacity
            onPressIn={handlePressInUploads}    // Aciona ao pressionar
            onPressOut={handlePressOutUploads} // Aciona ao soltar 
            onPress={() => router.push('/profileScreens/useOptionsPostsScreen')} // Ação
            style={styles.buttonContent} // Estilo interno
          >
            {/* Ícone esquerdo (ícone de upload) */}
            <Image
              source={require('@/assets/images/2/icons8_upload_to_cloud_120px.png')} // Troque pelo seu ícone
              style={styles.iconLeft}
            />

            {/* Texto do botão */}
            <Text style={styles.buttonText}>Fazer Uploads</Text>

            {/* Ícone seta para direita */}
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
        {/*View do botão Fazer Uploads-----------------------------------------------------------------*/}


        {/*View do botão Fazer Insight-----------------------------------------------------------------*/}
        <Animated.View style={[
          styles.buttonContainer,
          { transform: [{ scale: scaleValueInsight }] } // Animação de clique
        ]}>
          <TouchableOpacity
            onPressIn={handlePressInInsight}    // Aciona ao pressionar
            onPressOut={handlePressOutInsight} // Aciona ao soltar
            onPress={() => router.push('/profileScreens/useInsightsUserScreen')} // Ação
            style={styles.buttonContent} // Estilo interno
          >
            {/* Ícone esquerdo (ícone de Insight) */}
            <Image
              source={require('@/assets/images/2/icons8_funnel_120px_1.png')} // Troque pelo seu ícone
              style={styles.iconLeft}
            />

            {/* Texto do botão */}
            <Text style={styles.buttonText}>Seus Insights</Text>

            {/* Ícone seta para direita */}
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
        {/*View do botão Fazer Insight-----------------------------------------------------------------*/}

        {/*View dos conteudos do usuarios-----------*/}
        <View>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            //paddingHorizontal: 1,
            marginTop: 20,
            //marginBottom: 10,
            //marginLeft: 20,
          }}>
          </View>
          <Text style={{ color: '#fff', marginBottom: 5, fontSize: 17, marginLeft: 5 }}>Meus Posts</Text>
          <ScrollView horizontal
            showsHorizontalScrollIndicator={false} //Oculta a barra de rolagem
            style={{ marginBottom: 8, marginLeft: 1, }}
          >
            {/*Botao para os Singles----------------*/}
            <TouchableOpacity
              style={[
                styles.workButton,
                isSelected(selectedProfileMyContent, 'single') &&
                styles.workButtonSelected //Aplica o outro estilo quando estiver checked
              ]}
              onPress={() => setSelectedProfileMyContent('single')}>
              <Image
                source={require('@/assets/images/3/icons8_musical_120px.png')}
                style={{ width: 23, height: 20, marginRight: 8 }}
              />
              <Text style={styles.workButtonText}>Faixa single</Text>
            </TouchableOpacity>

            {/*Botao para as EPs*/}
            <TouchableOpacity
              style={[
                styles.workButton,
                isSelected(selectedProfileMyContent, 'eps') &&
                styles.workButtonSelected //Aplica o outro estilo quando estiver checked
              ]}
              onPress={() => setSelectedProfileMyContent('eps')}>
              <Image
                source={require('@/assets/images/3/icons8_music_record_120px.png')}
                style={{ width: 20, height: 20, marginRight: 8 }}
              />
              <Text style={styles.workButtonText}>Extended Play (EPs)</Text>
            </TouchableOpacity>

            {/*Botao para os Albuns*/}
            <TouchableOpacity
              style={[
                styles.workButton,
                isSelected(selectedProfileMyContent, 'albums') &&
                styles.workButtonSelected //Aplica o outro estilo quando estiver checked
              ]}
              onPress={() => setSelectedProfileMyContent('albums')}>
              <Image
                source={require('@/assets/images/3/icons8_music_album_120px.png')}
                style={{ width: 23, height: 20, marginRight: 8 }}
              />
              <Text style={styles.workButtonText}>Álbuns</Text>
            </TouchableOpacity>

            {/*Instrumentais comprados*/}
            <TouchableOpacity
              style={[
                styles.workButton,
                isSelected(selectedProfileMyContent, 'beats_bought') &&
                styles.workButtonSelected //Aplica o outro estilo quando estiver checked
              ]}
              onPress={() => setSelectedProfileMyContent('beats_bought')}>
              <Image
                source={require('@/assets/images/3/icons8_paycheque_120px.png')}
                style={{ width: 23, height: 20, marginRight: 8 }}
              />
              <Text style={styles.workButtonText}>Instrumentais comprados</Text>
            </TouchableOpacity>

            {/*Instrumentais Postados*/}
            <TouchableOpacity
              style={[
                styles.workButton,
                isSelected(selectedProfileMyContent, 'beats_posted') &&
                styles.workButtonSelected //Aplica o outro estilo quando estiver checked
              ]}
              onPress={() => setSelectedProfileMyContent('beats_posted')}>
              <Image
                source={require('@/assets/images/3/icons8_vox_player_120px.png')}
                style={{ width: 23, height: 20, marginRight: 8 }}
              />
              <Text style={styles.workButtonText}>Instrumentais postados</Text>
            </TouchableOpacity>

            {/*VideoClips*/}
            <TouchableOpacity
              style={[
                styles.workButton,
                isSelected(selectedProfileMyContent, 'videos') &&
                styles.workButtonSelected //Aplica o outro estilo quando estiver checked
              ]}
              onPress={() => setSelectedProfileMyContent('videos')}>
              <Image
                source={require('@/assets/images/3/icons8_video_camera_120px.png')}
                style={{ width: 20, height: 20, marginRight: 8 }}
              />
              <Text style={styles.workButtonText}>Video clipes</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={{ flex: 1, marginTop: 10 }}>
            {selectedProfileMyContent === 'single' && (
              <Text style={styles.texto}>🔊 Mostrando faixas single</Text> // Aqui você poderia mapear uma lista de faixas
            )}
            {selectedProfileMyContent === 'eps' && (
              <Text style={styles.texto}>🎧 Mostrando Extended Plays</Text> // Lista de EPs
            )}
            {selectedProfileMyContent === 'albums' && (
              <Text style={styles.texto}>💿 Mostrando Álbuns</Text> // Lista de álbuns
            )}
            {selectedProfileMyContent === 'beats_bought' && (
              <Text style={styles.texto}>🎶 Mostrando Instrumentais comprados </Text> // Lista de beats comprados
            )}
            {selectedProfileMyContent === 'beats_posted' && (
              <Text style={styles.texto}>🎹 Mostrando Instrumentais postados</Text> // Lista de beats postados
            )}
            {selectedProfileMyContent === 'videos' && (
              <Text style={styles.texto}>🎬 Mostrando VideoClips</Text> // Lista de vídeos
            )}
          </View>
        </View>
        <View style={{ height: 110, }}></View>
      </ScrollView >
    </View>

  );
}


{/*Estilos dos componentes---------------------------------------------------------*/ }
const styles = StyleSheet.create({
  // Estilo do scroll vertical (pai)
  scroll: {
    flex: 1, // Faz com que o componente ocupe todo o espaço disponível dentro do contêiner flex
    backgroundColor: '#191919', // Fundo preto (modo dark)
  },
  // Estilo do container do conteúdo vertical
  container: {
    flexGrow: 1, // Permite expansão do conteúdo
    //paddingVertical: 40,   // Adiciona 40 de espaçamento interno (padding) nas partes superior e inferior do componente
    //paddingHorizontal: 20, // Adiciona 20 de espaçamento interno (padding) nas partes esquerda e direita do componente
  },
  // Estilo do conteúdo horizontal
  content: {
    flexDirection: 'row', // Os blocos ficam lado a lado
  },
  // Estilo dos blocos de texto
  box: {
    width: 200,                 // Define a largura fixa do componente como 200 unidades
    height: 200,                // Define a altura fixa do componente como 200 unidades
    marginRight: 20,            // Adiciona espaçamento à direita do componente
    backgroundColor: '#1e1e1e', // Define a cor de fundo do componente para um cinza escuro
    color: '#fff',              // Define a cor do texto como branco
    textAlign: 'center',        // Centraliza horizontalmente o texto dentro do componente
    textAlignVertical: 'center',// Centraliza verticalmente o texto (em componentes que suportam isso, como TextInput no Android)
    lineHeight: 200,            // Define o espaçamento entre linhas; aqui é usado para centralizar o texto verticalmente em conjunto com textAlign
    borderRadius: 10            // Deixa os cantos do componente arredondados com raio de 10 unidades
  },

  //Estilo do teXto
  profileText: {
    color: '#fff',               // Define a cor do texto como branco
    alignSelf: 'flex-start',     // Alinha o componente ao início (esquerda) do eixo principal da View pai
    marginBottom: 10,            // Adiciona espaçamento abaixo do componente
  },

  //Estilo da View da imagem do perfil
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: '#333', // fallback de fundo
    marginBottom: 20,
  },

  //Estilo da Imagem do perfil
  profileImage: {
    width: '100%',
    height: '100%',
  },

  //--------------------------------------------------------------------
  //Linha que agrupa os dados estatisticos do perfil
  // Estilo da tabela geral que agrupa as linhas de estatísticas
  statsTable: {
    marginTop: 10, // Espaçamento superior em relação ao elemento acima (ex: nome do usuário)
  },

  // Estilo de cada linha da tabela de estatísticas
  statsRow: {
    flexDirection: 'row',      // Alinha os elementos horizontalmente (em linha)
    justifyContent: 'space-between', // Distribui o espaço igualmente entre os elementos da linha
    marginBottom: 10,          // Espaçamento inferior entre uma linha e outra
  },

  // Estilo de cada “célula” da tabela (ex: um item com valor e rótulo)
  statBox: {
    flex: 1,
    alignItems: 'center',
    borderColor: '#0083D0',    // Cor azul para a borda
    paddingVertical: 10,    // Espaço interno para não colar no texto
    marginHorizontal: 5,    // Espaço entre as colunas
    //borderRadius: 6,        // Cantos arredondados
    padding: 10,                 // Adiciona espaçamento interno (por dentro da View) em todos os lados.
    margin: 10,                  // Adiciona espaçamento externo (por fora da View) em todos os lados.
  },

  // Estilo do valor principal (ex: número de seguidores)
  statValue: {
    color: '#fff',             // Cor branca para maior contraste com o fundo escuro
    fontSize: 16,              // Tamanho da fonte um pouco maior para destaque
    //fontWeight: 'bold',        // Negrito para reforçar a importância visual do valor
  },

  // Estilo do rótulo (ex: “Seguidores”, “EPs”)
  statLabel: {
    color: '#aaa',             // Cor cinza claro, secundária em relação ao valor
    fontSize: 12,              // Fonte menor para indicar papel complementar
    marginTop: 2,              // Pequeno espaço entre o valor e o rótulo
  },
  //--------------------------------------------------------------------
  //Estilo do nome do usuario
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flexShrink: 1,
    flexWrap: 'wrap',
    marginLeft: 15,
    textAlign: 'center',
  },

  //Estilo do arroba do usuario
  userHandle: {
    color: '#aaa',
    fontSize: 13,
    marginTop: 2,
    marginLeft: 15,
    textAlign: 'center',
  },

  //Estilo da view das obras do usuario
  profileContainer: {
    paddingHorizontal: 15,   // Adiciona espaçamento interno horizontal (left/right) dentro da View.
    backgroundColor: '#1e1e1e',   // Define a cor de fundo para um tom escuro (#1e1e1e).
    //borderRadius: 20,   // Arredonda os cantos da View com raio de 10.
    //borderTopLeftRadius: 20,
    //borderTopRightRadius: 20,
    padding: 30,   // Adiciona espaçamento interno (padding) uniforme em todos os lados.
    margin: 10,   // Adiciona espaçamento externo (margin) uniforme em todos os lados.
    //marginTop: 3,   // Adiciona um pequeno espaçamento extra no topo (3 unidades).
    width: '100%',   // Faz a largura da View ocupar 100% do contêiner pai.
    //height: '100%',   // Comentado: Se usado, define a altura da View como 40% do contêiner pai.
    alignSelf: 'center',   // Centraliza horizontalmente a View dentro do contêiner pai.
    marginTop: -20,
  },

  //Estilo dos botoes single, ep e album
  workButton: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 10,  // Espaço interno horizontal para dar folga ao conteúdo
    paddingLeft: 4,
    height: 30,
    borderRadius: 6,
    marginRight: 5,
    borderWidth: 1,
    borderColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    alignSelf: 'flex-start' // Faz com que o botão se ajuste ao conteúdo (não preencha toda a linha)
  },
  //Estilo que sera aplicado aos btn da seção meus conteudos quando forem checked
  workButtonSelected: {
    backgroundColor: '#1565C0',
    //borderColor: '#00ff99',
  },

  //Estilo dos textos dos botoes single, ep e album
  workButtonText: {
    color: '#fff',           // Cor do texto
    fontSize: 14,            // Tamanho da fonte
    fontWeight: '600',       // Peso da fonte
    textAlign: 'center',     // Alinha o texto horizontalmente dentro da área
    paddingLeft: 2,
  },
  // Estilo do texto "Carregar Capa"
  texto: {
    color: '#fff',     // texto branco
    fontSize: 16,      // tamanho da fonte
  },

  buttonContainer: {
    marginBottom: 5,
    width: '100%',
    // borderRadius: 10,
    backgroundColor: '#1e1e1e',
    overflow: 'hidden',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  iconLeft: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  buttonText: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    //fontWeight: 'bold',
  },

});