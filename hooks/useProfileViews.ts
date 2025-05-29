import { useState } from 'react';

/**
 * Hook personalizado para gerenciar as views do perfil do usuário.
 * Cada estado controla a visibilidade de uma seção específica da tela de perfil.
 */
export const useProfileViews = () => {
  // Estado que controla se a view de configurações do perfil está expandida
  const [expandedProfileSettings, setExpandedProfileSettings] = useState(false);

  // Estado que controla se a view de postagem de faixa single está expandida
  const [expandedProfilePostFaixa, setExpandedProfilePostFaixa] = useState(false);

  // Estado que controla se a view de postagem de EP está expandida
  const [expandedProfilePostEP, setExpandedProfilePostEP] = useState(false);

  // Estado que controla se a view de postagem de álbum está expandida
  const [expandedProfilePostAlbum, setExpandedProfilePostAlbum] = useState(false);

  // Estado que controla se a view de postagem de beat está expandida
  const [expandedProfilePostBeat, setExpandedProfilePostBeat] = useState(false);

  // Estado que controla se a view de postagem de casting está expandida
  const [expandedProfilePostCastings, setExpandedProfilePostCastings] = useState(false);

  // Retorna todos os estados e seus respectivos métodos de atualização
  return {
    expandedProfileSettings,
    setExpandedProfileSettings,

    expandedProfilePostFaixa,
    setExpandedProfilePostFaixa,

    expandedProfilePostEP,
    setExpandedProfilePostEP,

    expandedProfilePostAlbum,
    setExpandedProfilePostAlbum,

    expandedProfilePostBeat,
    setExpandedProfilePostBeat,

    expandedProfilePostCastings,
    setExpandedProfilePostCastings,
  };
};