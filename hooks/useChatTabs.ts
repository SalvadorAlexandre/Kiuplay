// hooks/useBeatStoreTabs.ts
import { useState } from 'react';

export default function useChatTabs() {
  const [activeTab, setActiveTab] = useState<'todas' | 'naolidas' | 'usuarios' | 'pedidos' | 'grupos'>('todas');

  function handleTabChange(tab: 'todas' | 'naolidas' | 'usuarios' | 'pedidos' | 'grupos') {
    setActiveTab(tab);
  }

  return {
    activeTab,
    handleTabChange,
  };
}