import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { selectUserCurrencyCode, selectUserAccountRegion } from "@/src/redux/userSessionAndCurrencySlice";
import { useSelector } from "react-redux";
import { useTranslation } from "@/src/translations/useTranslation";
import { router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function LinkWalletAO() {

  const userRegion = useSelector(selectUserAccountRegion);
  const userCurrency = useSelector(selectUserCurrencyCode);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Vincular conta',
          headerStyle: { backgroundColor: "#0e0e0e" },
          headerTintColor: '#fff',
          //headerTitleStyle: { fontWeight: 'bold' },
          headerShown: true,
        }}
      />
      <ScrollView
        contentContainerStyle={styles.container}
        horizontal={false}
        showsHorizontalScrollIndicator={false} //Oculta a barra de rolagem
      >
        <Text style={styles.title}>Link Wallet — Global (USD)</Text>
        <Text style={styles.text}>
          In countries not covered by local currencies, transactions on Kiuplay use {'USD'}.
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Informações locais</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', }}>
            <Image source={require('@/assets/images/countries/icons8_globe_with_meridians_120px.png')} style={styles.Flaglogo} />
            <Text style={styles.countryText}>Região: Global ({userRegion})</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', }}>
            <Image source={require('@/assets/images/countries/icons8_currency_exchange_120px_1.png')} style={styles.Flaglogo} />
            <Text style={styles.countryText}>Moeda padrão: Dollar ({userCurrency})</Text>
          </View>
        </View>

        <View style={styles.termsBox}>
          <Text style={styles.infoText}>Provedores para esta região</Text>
          <View>
            <Image source={require('@/assets/images/payments/icons8_paypal_120px_3.png')} style={styles.Provedorlogo} />
          </View>
          <Text style={styles.countryText}>
            Algumas regiões foram selecionadas para poderem efectuar transações em duas moedas diferentes aqui no kiuplay,
            as vendas, compras e saques são processados com base na moeda selecionada.
          </Text>
          <Text style={styles.countryText}>
            Detectamos que esta região não está elegível para uso de duas moedas, utilizadores desta região utilizão apenas o Paypal (Moeda Global-USD)
            para as transações.
          </Text>
          <Text style={styles.countryText}>
            As conversões cambiais e taxas são aplicadas conforme a política da Kiuplay e do provedor de pagamento.
          </Text>

          <Text style={styles.countryText}>
            Se a região que detectamos automáticamente não estiver correta voçê pode muda clicando em 'Definir a região correta' para evitar erros.
            Caso contrário mantenha como está.
          </Text>
          <TouchableOpacity
            style={{
              flexDirection: "row", alignItems: "center", gap: 8, marginTop: 10
            }}
            onPress={() => router.push("/profileScreens/useProfileSettingsScreen")}
          >
            <Ionicons name='settings-outline' size={20} color="#1E90FF" />
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#1E90FF" }}>Definir a região correta</Text>
          </TouchableOpacity>

        </View>

        <TouchableOpacity
          style={styles.nextBtn}
          onPress={() => router.push("/profileScreens/monetization/linkWalletAccountScreen")}
        >
          <Ionicons name="link" size={25} color="#fff" />
          <Text style={styles.nextText}>Prosseguir para vinculação</Text>
        </TouchableOpacity>

      </ScrollView>

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    backgroundColor: "#0e0e0e",
    //alignItems: "center",
    padding: 17,
    flexGrow: 1,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15
  },
  text: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 10
  },
  Flaglogo: {
    width: 34,
    height: 34,
    resizeMode: 'contain',
    marginRight: 8,
  },
  Provedorlogo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginRight: 8,
  },
  infoBox: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 13,
    marginTop: 9,
    width: "100%",
  },
  infoText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 17,
    marginBottom: 15,
  },
  countryText: {
    color: "#ccc",
    fontSize: 15,
    marginVertical: 4,
  },
  termsBox: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 15,
    marginTop: 16,
    width: "100%",
  },
  termsTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  termsText: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 20,
  },
  nextBtn: {
    marginTop: 16,
    backgroundColor: "#1E90FF",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: '100%',
    justifyContent: 'center'
  },
  nextText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});