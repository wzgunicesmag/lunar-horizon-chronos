import { create } from 'zustand';

type Section = 'calendario' | 'analisis' | 'eventos' | 'perfil';

interface AppNavigationState {
  currentSection: Section;
  setSection: (section: Section) => void;
}

export const useAppNavigation = create<AppNavigationState>((set) => ({
  currentSection: 'calendario',
  setSection: (section) => set({ currentSection: section }),
}));