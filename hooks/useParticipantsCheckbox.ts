
import { useState } from 'react';

/**
 * Hook para gerenciar as opções de participação na faixa
 * - Controla checkboxes "Sim" e "Não"
 * - Gera dinamicamente os campos para nomes dos participantes
 * atraves do valor selecionado no dropdownPicker
 */
const useParticipantsCheckbox = () => {
  const [hasParticipants, setHasParticipants] = useState<boolean>(false);
  const [noParticipants, setNoParticipants] = useState<boolean>(true);

  const [numParticipants, setNumParticipants] = useState<number | null>(null); // Padrão 1 participante
  const [participantNames, setParticipantNames] = useState<string[]>(['']); // Inicializa com um campo vazio

  /**
   * Ativa a opção "Com Participantes" e desativa a outra.
   */
  const handleHasParticipants = () => {
    setHasParticipants(true);
    setNoParticipants(false);

    setNumParticipants(null)
    setParticipantNames([])
  };

  /**
   * Ativa a opção "Sem Participantes" e desativa a outra.
   * Também limpa os campos de participantes.
   */
  const handleNoParticipants = () : void => {
    setHasParticipants(false);
    setNoParticipants(true);
    setNumParticipants(1); // Reseta para 1 por padrão
    setParticipantNames(['']); // Limpa os nomes
  };

  /**
   * Atualiza o número de participantes e gera campos vazios correspondentes.
   * @param {number} value Número escolhido na combobox
   */
  const handleNumParticipantsChange = (value: number) : void => {
    setNumParticipants(value);
    const newNames = Array(value).fill(''); // Cria array vazio para cada participante
    setParticipantNames(newNames);
  };

  /**
   * Atualiza o nome de um participante específico.
   * @param {number} index Posição do participante no array
   * @param {string} name Nome digitado
   */
  const handleParticipantNameChange = (index: number, name: string) : void => {
    const updatedNames = [...participantNames];
    updatedNames[index] = name;  
    setParticipantNames(updatedNames);
  };

  return {
    hasParticipants,
    noParticipants,
    handleHasParticipants,
    handleNoParticipants,
    numParticipants,
    handleNumParticipantsChange,
    participantNames,
    handleParticipantNameChange,
  };
};

export default useParticipantsCheckbox 
