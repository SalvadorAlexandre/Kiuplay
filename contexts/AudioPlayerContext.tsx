// contexts/AudioPlayerContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface AudioPlayerContextProps {
  uri?: string;
  setUri: (uri: string) => void;
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextProps>({} as any);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uri, setUri] = useState<string | undefined>();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <AudioPlayerContext.Provider value={{ uri, setUri, isExpanded, setIsExpanded }}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayerContext = () => useContext(AudioPlayerContext);



{/* import React, { createContext, useContext, useState } from 'react';

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

export const useAudioPlayerContext = () => useContext(AudioPlayerContext);*/}