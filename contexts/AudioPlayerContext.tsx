//Componete AudioPlayerContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface AudioPlayerContextProps {
  uri?: string;
  setUri: (uri: string) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextProps>({
  uri: undefined,
  setUri: () => {},
});

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uri, setUri] = useState<string | undefined>(undefined);

  return (
    <AudioPlayerContext.Provider value={{ uri, setUri }}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayerContext = () => useContext(AudioPlayerContext);