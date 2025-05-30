

import { useState } from 'react';

/*
Hook personalizado para gerenciar a lógica de participação em uma faixa musical.
Controla se há participantes, quantos são e os nomes fornecidos.
*/ 
export const useParticipantsLogic = () => { 
    
    
    const [hasParticipants, setHasParticipants] = useState(false); // Indica se há participantes (checkbox "Sim")
    const [noParticipants, setNoParticipants] = useState(true);  // Indica se não há participantes (checkbox "Não") - começa como true por padrão
    const [participantCount, setParticipantCount] = useState(1);  // Quantidade de participantes escolhida pelo usuário (1 a 20)   
    const [participantNames, setParticipantNames] = useState<string[]>([]);  // Lista de nomes dos participantes (atualizada dinamicamente)

  /*
  Quando o usuário marca "Sim" (houve participação), atualiza os estados
  */
  const handleHasParticipants = () => { 
    setHasParticipants(true); 
    setNoParticipants(false);
   };


  /**

  Quando o usuário marca "Não" (faixa solo), limpa e redefine os estados */ const handleNoParticipants = () => { setHasParticipants(false); setNoParticipants(true); setParticipantCount(1); setParticipantNames([]); };


  /*
  Atualiza o número de participantes e ajusta a lista de nomes dinamicamente
  */ 
  const updateParticipantCount = (count: number) => { setParticipantCount(count); const newNames = [...participantNames];


   // Ajusta o tamanho do array conforme o novo número escolhido
   if (count > newNames.length) {
    for (let i = newNames.length; i < count; i++) {
        newNames.push('');
    }
   } else {
    newNames.length = count;
 }

 setParticipantNames(newNames);

 };

 /**
 Atualiza o nome de um participante específico na lista */ 
 const updateParticipantName = (index: number, name: string) => { const updatedNames = [...participantNames]; updatedNames[index] = name; setParticipantNames(updatedNames); };


  return { 
    hasParticipants,
    noParticipants,
    participantCount,
    participantNames,
    handleHasParticipants,
    handleNoParticipants,
    updateParticipantCount,
    updateParticipantName,
  };
};

