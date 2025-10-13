// components/uiGradientButton/GradientButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientButtonProps {
    title: string;
    onPress: () => void;
    style?: ViewStyle;
    disabled?: boolean;
}

export const GradientButton: React.FC<GradientButtonProps> = ({ title, onPress, style, disabled = false }) => {
    return (
        <TouchableOpacity 
            onPress={onPress} 
            disabled={disabled}
            style={[styles.container, style, disabled && styles.disabled]}
        >
            <LinearGradient
                // Cores do gradiente (referência da imagem: ciano para rosa/magenta)
                colors={['#00ffff', '#ff00ff']} 
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.gradient}
            >
                <Text style={styles.text}>{title}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 20,
    },
    gradient: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    disabled: {
        opacity: 0.6,
    }
});