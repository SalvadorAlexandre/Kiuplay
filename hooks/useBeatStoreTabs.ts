// hooks/useBeatStoreTabs.ts
import { useState } from 'react';

export default function useBeatStoreTabs() {
  const [activeTab, setActiveTab] = useState<'feeds' | 'curtidas' | 'seguindo'>('feeds');

  function handleTabChange(tab: 'feeds' | 'curtidas' | 'seguindo') {
    setActiveTab(tab);
  }

  return {
    activeTab,
    handleTabChange,
  };
}