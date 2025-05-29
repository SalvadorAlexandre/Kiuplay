import React, {useState} from 'react'
import { useProfileViews } from '@/hooks/useProfileViews';
import { isSelected } from '@/utils/UtilisBtnMyContent';
import {useSelectedMyContent } from '@/hooks/useSelectedMyContent';
import useParticipantsCheckbox  from '@/hooks/useParticipantsCheckbox';
import PostFaixaScreen from '@/components/usePostFaixaScreen'
import PostEPScreen from '@/components/usePostEPScreen'
import PostAlbumScreen from '@/components/usePostAlbumScreen'
import { Ionicons } from '@expo/vector-icons';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
  TextInput,
} from 'react-native';


export default function ProfileScreen() {
  const {
    //Hook da View das configurações do perfil
    expandedProfileSettings,
    setExpandedProfileSettings,

    //Hook da view post faixa single
    expandedProfilePostFaixa,
    setExpandedProfilePostFaixa,

    //Hook da View post EP
    expandedProfilePostEP,
    setExpandedProfilePostEP,

    //Hook da View post Album
    expandedProfilePostAlbum,
    setExpandedProfilePostAlbum,

    //Hook da View post Beat
    expandedProfilePostBeat,
    setExpandedProfilePostBeat,

    //Hook da View post Castings
    expandedProfilePostCastings,
    setExpandedProfilePostCastings,
  } = useProfileViews()

  const { selectedProfileMyContent, setSelectedProfileMyContent } = useSelectedMyContent() //Hook que verifica se um btn dos meus conteudos está checked
  
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const {
    hasParticipants,
    noParticipants,
    handleHasParticipants,
    handleNoParticipants,
    numParticipants,
    handleNumParticipantsChange,
    participantNames,
    handleParticipantNameChange,
  } = useParticipantsCheckbox()

  return (

    // ScrollView pai com rolagem **vertical**
    <ScrollView
      horizontal={false} // Garante que esta rolagem seja vertical
      style={styles.scroll} // Aplica o estilo de fundo escuro
      contentContainerStyle={styles.container} // Define padding e crescimento do conteúdo
      showsHorizontalScrollIndicator={false} //Oculta a barra de rolagem
    >


      {/*View da visão Geral do perfil--------------------------------------------------*/}
      <View style={styles.profileCard}>


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


      {/*View das configuracao do perfil------------*/}
      <View style={styles.worksSection}>

        <View style={styles.header}>
          <Image
            source={require('@/assets/images/2/icons8_user_settings_120px.png')}
            style={{ width: 25, height: 25, marginRight: 8 }}
          />
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', flex: 1 }}>Configurações do perfil</Text>
          {/*Icone no canto superior directo*/}
          <Pressable onPress={() => setExpandedProfileSettings(prev => !prev)}>
            {/*Icone muda conforme o estado, seta para cima e para baixo*/}
            <Ionicons
              name={expandedProfileSettings ? 'chevron-up' : 'chevron-down'}
              size={20}
              color='#fff'
              style={{ transform: [{ rotate: expandedProfileSettings ? '180' : '0deg' }] }}
            />
          </Pressable>
        </View>
        {expandedProfileSettings && (
          <View>
            <Text style={styles.texto}>OLA MBAPPÉ</Text>
          </View>
        )}
      </View>


      {/*View criar postagem de faixa single*/}
      <View style={styles.worksSection}>
        {/*Cabeçalho que sempre aparece*/}
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/2/icons8_musical_120px.png')}
            style={{ width: 25, height: 25, marginRight: 8 }}
          />
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', flex: 1 }}>
            Criar um post de faixa single
          </Text>
          {/* Ícone no canto superior direito */}
         <Pressable onPress={() => setExpandedProfilePostFaixa(prev => !prev)}>
            {/*Icone muda conforme o estado, seta para cima e para baixo*/}
            <Ionicons
              name={expandedProfilePostFaixa ? 'chevron-up' : 'chevron-down'}
              size={20}
              color='#fff'
              style={{ transform: [{ rotate: expandedProfilePostFaixa ? '180' : '0deg' }] }}
            />
          </Pressable>
        </View>
        {expandedProfilePostFaixa && (
          <View>
            <PostFaixaScreen />
          </View>
          
        )}
      </View>

      {/* View criar postagem de EP */ }
  <View style={styles.worksSection}>
    <View style={styles.header}>
      <Image
        source={require('@/assets/images/2/icons8_music_record_120px.png')}
        style={{ width: 20, height: 20, marginRight: 8 }}
      />
      <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', flex: 1 }}>
        Criar um post de EP
      </Text>
      {/* Ícone no canto superior direito */}
      <Pressable onPress={() => setExpandedProfilePostEP(prev => !prev)}>
        {/* Ícone muda conforme o estado, seta para cima e para baixo */}
        <Ionicons
          name={expandedProfilePostEP ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#fff"
          style={{ transform: [{ rotate: expandedProfilePostEP ? '180' : '0deg' }] }}
        />
      </Pressable>
    </View>

    {/* Se a seção de postagem do EP estiver expandida */}
    {expandedProfilePostEP && (
      <View>
        <PostEPScreen/>
      </View>
    )}
  </View>

  {/*View criar postagem de Album*/ }
  {/* View criar postagem de Álbum */ }
  <View style={styles.worksSection}>
    <View style={styles.header}>
      <Image
        source={require('@/assets/images/2/icons8_music_album_120px.png')}
        style={{ width: 25, height: 25, marginRight: 8 }}
      />
      <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', flex: 1 }}>
        Criar um post de Álbum
      </Text>
      {/* Ícone no canto superior direito */}
      <Pressable onPress={() => setExpandedProfilePostAlbum(prev => !prev)}>
        {/* Ícone muda conforme o estado, seta para cima e para baixo */}
        <Ionicons
          name={expandedProfilePostAlbum ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#fff"
          style={{ transform: [{ rotate: expandedProfilePostAlbum ? '180' : '0deg' }] }}
        />
      </Pressable>
    </View>

    {/* Se a seção de postagem do álbum estiver expandida */}
    {expandedProfilePostAlbum && (
      <View>
        <PostAlbumScreen />
      </View>
    )}
  </View>

  {/*View criar postagem de Instrumentais*/ }
  <View style={styles.worksSection}>
    <View style={styles.header}>
      <Image
        source={require('@/assets/images/2/icons8_vox_player_120px.png')}
        style={{ width: 25, height: 20, marginRight: 8 }}
      />
      <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', flex: 1 }}>Criar um post de Beat</Text>
      {/*Icone no canto superior directo*/}
      <Pressable onPress={() => setExpandedProfilePostBeat(prev => !prev)}>
        {/*Icone muda conforme o estado, seta para cima e para baixo*/}
        <Ionicons
          name={expandedProfilePostBeat ? 'chevron-up' : 'chevron-down'}
          size={20}
          color='#fff'
          style={{ transform: [{ rotate: expandedProfilePostBeat ? '180' : '0deg' }] }}
        />
      </Pressable>
    </View>
    {expandedProfilePostBeat && (
      <View>
        <Text>post album</Text>
      </View>
    )}
  </View>

  {/*View criar postagem de Castings*/ }
  <View style={styles.worksSection}>
    <View style={styles.header}>
      <Image
        source={require('@/assets/images/2/icons8_video_camera_120px.png')}
        style={{ width: 23, height: 20, marginRight: 8 }}
      />
      <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', flex: 1 }}>Criar um post de video</Text>
      {/*Icone no canto superior directo*/}
      <Pressable onPress={() => setExpandedProfilePostCastings(prev => !prev)}>
        {/*Icone muda conforme o estado, seta para cima e para baixo*/}
        <Ionicons
          name={expandedProfilePostCastings ? 'chevron-up' : 'chevron-down'}
          size={20}
          color='#fff'
          style={{ transform: [{ rotate: expandedProfilePostCastings ? '180' : '0deg' }] }}
        />
      </Pressable>
    </View>
    {expandedProfilePostCastings && (
      <View>
        <Text style={styles.texto}>OLA MBAPPÉ</Text>
      </View>
    )}
  </View>


  {/*View dos conteudos do usuarios-----------*/ }
  <View style={styles.worksSection}>
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center', paddingHorizontal: 1,
        marginBottom: 8
      }}>
      <Image
        source={require('@/assets/images/2/icons8_internet_folder_120px.png')}
        style={{ width: 23, height: 20, marginRight: 8 }}
      />
      <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', flex: 1 }}>Meus comteúdos</Text>
    </View>
    <ScrollView horizontal
      showsHorizontalScrollIndicator={false} //Oculta a barra de rolagem
      style={{ marginBottom: 8 }}
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
    <Text style={styles.profileText}>O Conteudo sera apresentado dinamicamente</Text>
  </View>
    </ScrollView >

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
    paddingVertical: 40,   // Adiciona 40 de espaçamento interno (padding) nas partes superior e inferior do componente
    paddingHorizontal: 20, // Adiciona 20 de espaçamento interno (padding) nas partes esquerda e direita do componente
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

  // Estilo da View da visão geral do perfil 
  profileCard: {
    backgroundColor: '#1e1e1e',  // Define a cor de fundo da View (cinza escuro).
    borderRadius: 10,            // Arredonda os cantos da View com raio de 10 pixels.
    padding: 10,                 // Adiciona espaçamento interno (por dentro da View) em todos os lados.
    margin: 10,                  // Adiciona espaçamento externo (por fora da View) em todos os lados.
    marginTop: -30,              // Sobe a View 30 pixels em relação à posição original, criando uma sobreposição (útil em cards).
    width: '100%',               // Define que a View terá 100% da largura do elemento pai (geralmente da tela).
    //height: '40%',               // Define que a altura da View será 40% da altura da tela — **isso impede que ela cresça dinamicamente**.
    alignSelf: 'center',         // Centraliza a View horizontalmente dentro do elemento pai.
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
    fontWeight: 'bold',        // Negrito para reforçar a importância visual do valor
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
  worksSection: {
    paddingHorizontal: 15,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 10,       // Adiciona espaçamento interno (por dentro da View) em todos os lados.
    margin: 10,
    marginTop: 3,
    width: '100%',
    //height: '40%',
    alignSelf: 'center',
  },

  //Estilo dos botoes single, ep e album
  workButton: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 10,  // Espaço interno horizontal para dar folga ao conteúdo
    paddingLeft: 4,
    height: 30,
    borderRadius: 6,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    alignSelf: 'flex-start' // Faz com que o botão se ajuste ao conteúdo (não preencha toda a linha)
  },
  //Estilo que sera aplicado aos btn da seção meus conteudos quando forem checked
  workButtonSelected: {
    backgroundColor: '#444',
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

  //Estilo das caixas de texto (InputText)
  inputTextBox: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 11,            // largura fixa
    height: 35,            // altura fixa para forma retangular
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#555',
    color: '#fff',
    marginBottom: 10,
    width: '100%'
  },
  // Estilo da caixa que envolve o botão ou imagem
  frame: {
    width: 200,                 // largura fixa
    height: 200,                // altura fixa
    borderRadius: 10,           // bordas arredondadas
    backgroundColor: '#2a2a2a', // cor de fundo escura
    justifyContent: 'center',   // centraliza conteúdo verticalmente
    alignItems: 'center',       // centraliza conteúdo horizontalmente
  },
  // Estilo do texto "Carregar Capa"
  texto: {
    color: '#fff',     // texto branco
    fontSize: 16,      // tamanho da fonte
  },
  // Estilo da imagem carregada
  imagem: {
    width: '100%',         // ocupa toda a largura do frame
    height: '100%',        // ocupa toda a altura do frame
    borderRadius: 10,      // mesma borda da caixa
  },

  //Estilo da view onde fica o icone de expandir e recolher
  header: {
    flexDirection: 'row',      // Coloca o Text e o ícone na mesma linha
    justifyContent: 'space-between', // Um vai para esquerda e outro para a direita
    alignItems: 'center',      // Alinha verticalmente no centro
    paddingHorizontal: 1,
    marginBottom: 8,
    //flex: 1,
  },
  //Estilos do componente de UpLoading
  uploadArea: {
    flexDirection: 'row',           // texto e ícone lado a lado
    alignItems: 'center',           // centraliza verticalmente
    justifyContent: 'center',       // centraliza horizontalmente
    backgroundColor: '#333',        // cor de fundo
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#555',
    marginBottom: 12,
  },

  //Estilos do componente de UpLoading
  uploadText: {
    color: '#fff',
    fontSize: 16,
    //fontWeight: '500',
    marginRight: 10, // espaçamento entre texto e ícone
  },
});