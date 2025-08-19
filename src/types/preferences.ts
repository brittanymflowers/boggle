// Define theme modes
export type ThemeMode = 'light' | 'dark';

// Define text sizes
export type TextSize = 'small' | 'medium' | 'large';

// User preferences interface
export interface UserPreferences {
  theme: ThemeMode;
  soundEffects: boolean;
  musicVolume: number;
  effectsVolume: number;
  colorBlindMode: boolean;
  textSize: TextSize;
  defaultTimerDuration: number;
  defaultBoardSize: number;
  defaultDifficulty: 'easy' | 'medium' | 'hard';
  defaultLanguage: string;
}

// Accessibility settings interface
export interface AccessibilitySettings {
  colorBlindMode: boolean;
  textSize: TextSize;
  highContrastMode: boolean;
  reduceMotion: boolean;
}