import {create} from 'zustand';
interface ThemeStore {
  theme: string;
  setTheme: (theme: string) => void;
}

export const useThemeStore = create<ThemeStore>(() => ({
  theme: "light",
  setTheme: (theme: string) => {},
}));