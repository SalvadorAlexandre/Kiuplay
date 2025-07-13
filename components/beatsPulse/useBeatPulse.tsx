import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native"; // Adicionado Easing para animações mais suaves

type Props = {
  bpm: number; // BPM (não usado diretamente para a animação de pulso individual, mas pode ser para efeitos futuros)
  active: boolean; // Indica se esta bolinha específica está ativa (batida atual)
  index: number; // Índice da bolinha (0-3), para defasagem visual se necessário, mas a ativação já lida com isso.
  size?: number; // Tamanho da bolinha
  color?: string; // Cor da bolinha
};

export default function BeatPulse({
  //bpm, // Mantido caso queira usar para algo como velocidade da animação no futuro
  active,
  //index, // Mantido caso queira usar para algo como atraso de animação individual
  size = 18,
  color = "#1E90FF",
}: Props) {
  // `opacity` será o valor animado para controlar a opacidade da bolinha.
  // Começa em 0.4 (estado inativo padrão).
  const animatedOpacity = useRef(new Animated.Value(0.4)).current;

  // `pulseAnimation` será a referência para a animação de pulso.
  // Usamos useRef para garantir que a animação não seja recriada desnecessariamente.
  const pulseAnimationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    // Lógica para quando a bolinha está ATIVA
    if (active) {
      // Para qualquer animação anterior que possa estar rodando
      if (pulseAnimationRef.current) {
        pulseAnimationRef.current.stop();
      }

      // Define a animação de pulso:
      // 1. Vai de 0.4 para 1 (brilha)
      // 2. Volta de 1 para 0.4 (desbrilha)
      // Esta sequência é executada uma única vez quando 'active' se torna true.
      pulseAnimationRef.current = Animated.sequence([
        Animated.timing(animatedOpacity, {
          toValue: 1, // Brilha
          duration: 100, // Duração do brilho (curto e rápido)
          easing: Easing.ease, // Suaviza a transição
          useNativeDriver: true,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 0.4, // Desbrilha de volta ao estado inativo
          duration: 200, // Duração do desbrilho (um pouco mais longo)
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]);

      // Inicia a animação
      pulseAnimationRef.current.start();
    } else {
      // Lógica para quando a bolinha está INATIVA
      // Para qualquer animação de pulso que possa estar rodando
      if (pulseAnimationRef.current) {
        pulseAnimationRef.current.stop();
      }
      // Garante que a opacidade volte ao estado inativo padrão (0.4) imediatamente
      animatedOpacity.setValue(0.4);
    }

    // Função de limpeza para parar a animação quando o componente é desmontado
    // ou quando 'active' muda (e o efeito é re-executado).
    return () => {
      if (pulseAnimationRef.current) {
        pulseAnimationRef.current.stop();
        pulseAnimationRef.current = null; // Limpa a referência
      }
    };
  }, [active, animatedOpacity]); // Dependências: 'active' para reagir à mudança, 'animatedOpacity' para o useRef

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        borderRadius: 10, // Transforma em círculo
        backgroundColor: color,
        marginHorizontal: 6, // Espaçamento entre as bolinhas
        opacity: animatedOpacity, // Aplica a opacidade animada
      }}
    />
  );
}
