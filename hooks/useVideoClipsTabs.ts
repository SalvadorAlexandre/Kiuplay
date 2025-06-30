// hooks/useVideoClipsTabs.ts
import { useState } from 'react';

export default function useVideoClipsTabs() {
  const [activeTab, setActiveTab] = useState<'feeds' | 'curtidas' | 'seguindo'>('feeds');

  function handleTabChange(tab: 'feeds' | 'curtidas' | 'seguindo') {
    setActiveTab(tab);
  }

  return {
    activeTab,
    handleTabChange,
  };
}