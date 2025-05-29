import { useState } from 'react';

export const useEPFields = () => {
  const [epTitle, setEPTitle] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [producer, setProducer] = useState('');

  return {
    epTitle, setEPTitle,
    year, setYear,
    producer, setProducer,
  };
};