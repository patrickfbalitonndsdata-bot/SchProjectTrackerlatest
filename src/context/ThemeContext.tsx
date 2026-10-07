import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';
export type HolidaySeason = 'none' | 'halloween' | 'christmas_eve' | 'christmas' | 'new_year';
export type SeasonMode = 'auto' | HolidaySeason;

export const detectSeasonByDate = (date: Date = new Date()): HolidaySeason => {
  const month = date.getMonth() + 1; // 1-indexed: 1 = Jan, 10 = Oct, 11 = Nov, 12 = Dec
  const day = date.getDate();

  // 1. Halloween: Starting October 20 - November 30
  if ((month === 10 && day >= 20) || (month === 11 && day <= 30)) {
    return 'halloween';
  }

  // 2. Christmas Eve: December 22-24
  if (month === 12 && day >= 22 && day <= 24) {
    return 'christmas_eve';
  }

  // 3. Christmas: For the Whole December excluding 22-24
  if (month === 12 && (day < 22 || day > 24)) {
    return 'christmas';
  }

  // 4. New Year: January 1 - 15
  if (month === 1 && day >= 1 && day <= 15) {
    return 'new_year';
  }

  return 'none';
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  season: HolidaySeason;
  seasonMode: SeasonMode;
  setSeasonMode: (mode: SeasonMode) => void;
  currentYear: number;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'psu_app_theme';
const SEASON_STORAGE_KEY = 'psu_app_season_mode_v2';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
      return 'dark';
    } catch {
      return 'dark';
    }
  });

  const [seasonMode, setSeasonModeState] = useState<SeasonMode>(() => {
    try {
      const saved = localStorage.getItem(SEASON_STORAGE_KEY) as SeasonMode | null;
      if (
        saved === 'auto' ||
        saved === 'halloween' ||
        saved === 'christmas' ||
        saved === 'christmas_eve' ||
        saved === 'new_year' ||
        saved === 'none'
      ) {
        return saved;
      }
      return 'auto';
    } catch {
      return 'auto';
    }
  });

  // Calculate resolved season
  const resolvedSeason: HolidaySeason =
    seasonMode === 'auto' ? detectSeasonByDate(new Date()) : seasonMode;

  const currentYear = new Date().getFullYear();

  // Apply dark mode class and season classes to <html> root
  useEffect(() => {
    const root = document.documentElement;

    // Theme (Dark / Light)
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {}

    // Clean prior season classes
    root.classList.remove(
      'season-halloween',
      'season-christmas',
      'season-christmas-eve',
      'season-new-year',
      'season-none'
    );

    if (resolvedSeason !== 'none') {
      const cls =
        resolvedSeason === 'christmas_eve'
          ? 'season-christmas-eve'
          : `season-${resolvedSeason}`;
      root.classList.add(cls);
    }
  }, [theme, resolvedSeason]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
  };

  const setSeasonMode = (mode: SeasonMode) => {
    setSeasonModeState(mode);
    try {
      localStorage.setItem(SEASON_STORAGE_KEY, mode);
    } catch {}
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        isDark: theme === 'dark',
        season: resolvedSeason,
        seasonMode,
        setSeasonMode,
        currentYear,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
