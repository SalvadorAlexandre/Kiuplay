// contexts/AudioPlayerContext.tsx
import React, { createContext, useContext, useState } from 'react';

export type Music = {
  uri: string;
  name: string;
  size?: number;
  mimeType?: string;
};

interface AudioPlayerContextProps {
  playlist: Music[];
  setPlaylist: (musics: Music[]) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  currentTrack: Music | null;
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
  playNext: () => void;
  playPrevious: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextProps>({} as any);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playlist, setPlaylist] = useState<Music[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const currentTrack = playlist[currentIndex] || null;

  const playNext = () => {
    if (currentIndex < playlist.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const playPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        playlist,
        setPlaylist,
        currentIndex,
        setCurrentIndex,
        currentTrack,
        isExpanded,
        setIsExpanded,
        playNext,
        playPrevious,
      }}
    >
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