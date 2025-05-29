import { useState } from 'react';

/**
 * Hook personalizado para gerenciar o estado e lógica
 * da postagem de EP no Kiuplay.
 */
const usePostExtendedPlay = () => {
  // Estado para indicar se há participantes na faixa
  const [hasParticipants, setHasParticipants] = useState(false);

  // Estado para indicar se NÃO há participantes na faixa
  const [noParticipants, setNoParticipants] = useState(true);

  // Estado para controlar se o DropdownPicker está aberto
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Número de participantes selecionados
  const [numParticipants, setNumParticipants] = useState<number | null>(null);

  // Lista com os nomes dos participantes
  const [participantNames, setParticipantNames] = useState<string[]>([]);

  // Manipulador para marcar "Sim" (há participantes)
  const handleHasParticipants = () => {
    setHasParticipants(true);
    setNoParticipants(false);
  };

  // Manipulador para marcar "Não" (sem participantes)
  const handleNoParticipants = () => {
    setHasParticipants(false);
    setNoParticipants(true);
    setNumParticipants(null); // Reseta número
    setParticipantNames([]);  // Reseta nomes
  };

  // Manipulador ao escolher número de participantes
  const handleNumParticipantsChange = (value: number) => {
    setNumParticipants(value);
    setParticipantNames(Array.from({ length: value }, () => ''));
  };

  // Manipulador para atualizar nome de um participante específico
  const handleParticipantNameChange = (index: number, text: string) => {
    const updatedNames = [...participantNames];
    updatedNames[index] = text;
    setParticipantNames(updatedNames);
  };

  // Retorna os estados e manipuladores para uso no componente
  return {
    hasParticipants,
    noParticipants,
    dropdownOpen,
    numParticipants,
    participantNames,
    setDropdownOpen,
    handleHasParticipants,
    handleNoParticipants,
    handleNumParticipantsChange,
    handleParticipantNameChange,
  };
};

export default usePostExtendedPlay;