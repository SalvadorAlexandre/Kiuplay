import React from "react";
import { Stack, useRouter } from "expo-router";
import {
    View,
    ScrollView,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "@/src/translations/useTranslation";
import { useAppSelector } from "@/src/redux/hooks";

export default function ProfileSettingsScreen() {
    const router = useRouter();
    const { t, setLanguage, language } = useTranslation();
    const appLanguage = useAppSelector((state) => state.users.appLanguage);

    // 🔄 Troca o idioma de forma centralizada
    const handleChangeLanguage = async (lang: string) => {
        await setLanguage(lang);
    };

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />

            <View style={{ flex: 1, backgroundColor: "#191919" }}>
                {/* Cabeçalho */}
                <View style={styles.containerBack}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.buttonBack}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>

                    <Text style={styles.titleBack}>{t("settings.title")}</Text>
                </View>

                {/* Conteúdo principal */}
                <ScrollView
                    horizontal={false}
                    style={styles.scroll}
                    contentContainerStyle={styles.container}
                    showsHorizontalScrollIndicator={false}
                >
                    {/* Seção: Troca de idioma */}
                    <View style={styles.profileContainer}>
                        <Text style={styles.sectionTitle}>{t("settings.languageTitle")}</Text>

                        <View style={styles.langButtons}>
                            <TouchableOpacity
                                style={[
                                    styles.langButton,
                                    (appLanguage || language)?.startsWith("pt") && styles.langButtonActive,
                                ]}
                                onPress={() => handleChangeLanguage("pt-BR")}
                            >
                                <Text style={styles.langText}>🇧🇷 Português</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.langButton,
                                    (appLanguage || language)?.startsWith("en") && styles.langButtonActive,
                                ]}
                                onPress={() => handleChangeLanguage("en")}
                            >
                                <Text style={styles.langText}>🇺🇸 English</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.langButton,
                                    (appLanguage || language)?.startsWith("es") && styles.langButtonActive,
                                ]}
                                onPress={() => handleChangeLanguage("es")}
                            >
                                <Text style={styles.langText}>🇪🇸 Español</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Seção: Informação bancária */}
                    <View style={{ flexDirection: "row", marginTop: 20 }}>
                        <Image
                            source={require("@/assets/images/4/icons8_info_120px.png")}
                            style={styles.iconLeft}
                        />
                        <Text style={styles.userHandle}>{t("settings.bankInfo")}</Text>
                    </View>
                </ScrollView>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
        backgroundColor: "#191919",
        paddingHorizontal: 20,
    },
    container: {
        flexGrow: 1,
        paddingVertical: 40,
    },
    profileContainer: {
        paddingHorizontal: 15,
        backgroundColor: "#1e1e1e",
        borderRadius: 20,
        padding: 20,
        margin: 10,
        width: "100%",
        alignSelf: "center",
        marginTop: -20,
    },
    sectionTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
    },
    langButtons: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    langButton: {
        backgroundColor: "#333",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
    },
    langButtonActive: {
        backgroundColor: "#555",
        borderWidth: 1,
        borderColor: "#fff",
    },
    langText: {
        color: "#fff",
        fontSize: 14,
    },
    iconLeft: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    userHandle: {
        color: "#aaa",
        fontSize: 16,
        marginTop: 2,
        flex: 1,
    },
    containerBack: {
        backgroundColor: "#191919",
        paddingVertical: 20,
        flexDirection: "row",
        marginBottom: 20,
    },
    buttonBack: {
        marginLeft: 15,
    },
    titleBack: {
        color: "#fff",
        fontSize: 18,
        marginLeft: 14,
        flex: 1,
    },
});