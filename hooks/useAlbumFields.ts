import { useState } from 'react';

export const useAlbumFields = () => {
  const [albumTitle, setAlbumTitle] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [producer, setProducer] = useState('');

  return {
    albumTitle, setAlbumTitle,
    year, setYear,
    producer, setProducer,
  };
};