import { useState } from 'react';

export type TypeSubTab = 'tudo' | 'pastas' | 'downloads' | 'feeds' | 'curtidas' | 'seguindo';
export type TypeGroup = 'local' | 'cloud';

const defaultTabs: Record<TypeGroup, TypeSubTab> = {
  local: 'tudo',
  cloud: 'feeds',
};

export default function useSubTabSelectorLibrary() {
  const [selectedTabs, setSelectedTabs] = useState<Record<TypeGroup, TypeSubTab>>(defaultTabs);

  const selectSubTab = (group: TypeGroup, tab: TypeSubTab) => {
    setSelectedTabs(prev => ({ ...prev, [group]: tab }));
  };

  const getSelectedSubTab = (group: TypeGroup): TypeSubTab => {
    return selectedTabs[group];
  };

  const isSelectedSubTab = (group: TypeGroup, tab: TypeSubTab): boolean => {
    return selectedTabs[group] === tab;
  };

  return {
    getSelectedSubTab,
    selectSubTab,
    isSelectedSubTab,
  };
}