// components/commentScreens/BottomHalfModal.tsx
import React, { useRef, useEffect, useCallback } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Animated,
    PanResponder,
    TouchableOpacity,
    Text,
    Easing
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BottomHalfModalProps {
    isVisible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    heightPercentage?: number; // Nova prop para controlar a altura
}

const { height: screenHeight } = Dimensions.get('window');

const BottomHalfModal: React.FC<BottomHalfModalProps> = ({
    isVisible,
    onClose,
    children,
    heightPercentage = 0.6, // Padrão: ocupa 60% da altura da tela
}) => {
    const slideAnim = useRef(new Animated.Value(screenHeight)).current; // Inicia fora da tela
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (evt, gestureState) => {
                // Permite arrastar para baixo, mas não para cima acima do limite
                if (gestureState.dy > 0) {
                    slideAnim.setValue(gestureState.dy + screenHeight * (1 - heightPercentage));
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                // Se arrastou para baixo o suficiente, fechar o modal
                if (gestureState.dy > screenHeight * 0.15 || gestureState.vy > 0.5) { // Arrastou 15% da tela ou velocidade alta
                    Animated.timing(slideAnim, {
                        toValue: screenHeight,
                        duration: 250,
                        useNativeDriver: true,
                    }).start(() => onClose());
                } else {
                    // Volta para a posição original se não arrastou o suficiente
                    Animated.spring(slideAnim, {
                        toValue: screenHeight * (1 - heightPercentage),
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    // Calcula a altura real do modal
    const modalHeight = screenHeight * heightPercentage;
    // Posição final para o modal (o topo do modal)
    const finalPosition = screenHeight - modalHeight;

    useEffect(() => {
        if (isVisible) {
            Animated.timing(slideAnim, {
                toValue: finalPosition, // Desliza até a posição calculada
                duration: 300,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: screenHeight, // Desliza para fora da tela (para baixo)
                duration: 250,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
            }).start();
        }
    }, [isVisible, slideAnim, finalPosition]);

    const handleClose = useCallback(() => {
        Animated.timing(slideAnim, {
            toValue: screenHeight,
            duration: 250,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
        }).start(() => onClose());
    }, [slideAnim, onClose]);

    if (!isVisible) {
        return null; // Não renderiza nada se não estiver visível
    }

    return (
        <View style={styles.overlay}>
            <TouchableOpacity
                style={styles.backdrop}
                activeOpacity={1}
                onPress={handleClose} // Clicar fora fecha o modal
            />
            <Animated.View
                style={[
                    styles.modalContainer,
                    {
                        height: modalHeight,
                        transform: [{ translateY: slideAnim }],
                    },
                ]}
                {...panResponder.panHandlers}
            >
                <View style={styles.handleBar} />
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#555" />
                </TouchableOpacity>
                <View style={styles.content}>
                    {children}
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo escuro semi-transparente
        justifyContent: 'flex-end', // Alinha o modal na parte inferior
        zIndex: 1000,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject, // Preenche toda a tela para detectar cliques fora do modal
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingTop: 10,
        width: '100%',
        position: 'absolute', // Permite que a animação `translateY` funcione corretamente
        bottom: 0, // Inicia na parte inferior (a animação move para cima)
        alignItems: 'center', // Para centralizar a barra de "handle"
    },
    handleBar: {
        width: 40,
        height: 5,
        backgroundColor: '#ccc',
        borderRadius: 2.5,
        marginBottom: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 15,
        padding: 5,
        zIndex: 1, // Garante que o botão esteja acima do conteúdo
    },
    content: {
        flex: 1, // Permite que o conteúdo do modal se expanda
        width: '100%',
        paddingBottom: 20, // Espaçamento inferior para o conteúdo
    },
});

export default BottomHalfModal;