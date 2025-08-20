import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  useEffect,
} from "react";

// Define theme modes
export type ThemeMode = "light" | "dark";

// Define text sizes
export type TextSize = "small" | "medium" | "large";

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
  defaultDifficulty: "easy" | "medium" | "hard";
  defaultLanguage: string;
}

// Define actions
type PreferencesAction =
  | { type: "SET_THEME"; payload: { theme: ThemeMode } }
  | { type: "TOGGLE_SOUND_EFFECTS"; payload: { enabled: boolean } }
  | { type: "SET_MUSIC_VOLUME"; payload: { volume: number } }
  | { type: "SET_EFFECTS_VOLUME"; payload: { volume: number } }
  | { type: "TOGGLE_COLOR_BLIND_MODE"; payload: { enabled: boolean } }
  | { type: "SET_TEXT_SIZE"; payload: { size: TextSize } }
  | { type: "SET_DEFAULT_TIMER"; payload: { duration: number } }
  | { type: "SET_DEFAULT_BOARD_SIZE"; payload: { size: number } }
  | {
      type: "SET_DEFAULT_DIFFICULTY";
      payload: { difficulty: "easy" | "medium" | "hard" };
    }
  | { type: "SET_DEFAULT_LANGUAGE"; payload: { language: string } };

// Initial preferences state
const initialPreferences: UserPreferences = {
  theme: "light",
  soundEffects: true,
  musicVolume: 50,
  effectsVolume: 70,
  colorBlindMode: false,
  textSize: "medium",
  defaultTimerDuration: 180, // 3 minutes
  defaultBoardSize: 4,
  defaultDifficulty: "medium",
  defaultLanguage: "english",
};

// Load preferences from localStorage if available
const loadSavedPreferences = (): UserPreferences => {
  try {
    const savedPreferences = localStorage.getItem("bogglePreferences");
    if (savedPreferences) {
      return JSON.parse(savedPreferences);
    }
  } catch (error) {
    console.error("Error loading preferences from localStorage", error);
  }
  return initialPreferences;
};

// Reducer for preferences
const preferencesReducer = (
  state: UserPreferences,
  action: PreferencesAction
): UserPreferences => {
  switch (action.type) {
    case "SET_THEME":
      return { ...state, theme: action.payload.theme };
    case "TOGGLE_SOUND_EFFECTS":
      return { ...state, soundEffects: action.payload.enabled };
    case "SET_MUSIC_VOLUME":
      return { ...state, musicVolume: action.payload.volume };
    case "SET_EFFECTS_VOLUME":
      return { ...state, effectsVolume: action.payload.volume };
    case "TOGGLE_COLOR_BLIND_MODE":
      return { ...state, colorBlindMode: action.payload.enabled };
    case "SET_TEXT_SIZE":
      return { ...state, textSize: action.payload.size };
    case "SET_DEFAULT_TIMER":
      return { ...state, defaultTimerDuration: action.payload.duration };
    case "SET_DEFAULT_BOARD_SIZE":
      return { ...state, defaultBoardSize: action.payload.size };
    case "SET_DEFAULT_DIFFICULTY":
      return { ...state, defaultDifficulty: action.payload.difficulty };
    case "SET_DEFAULT_LANGUAGE":
      return { ...state, defaultLanguage: action.payload.language };
    default:
      return state;
  }
};

// Create context
interface PreferencesContextType {
  preferences: UserPreferences;
  setTheme: (theme: ThemeMode) => void;
  toggleSoundEffects: (enabled: boolean) => void;
  setMusicVolume: (volume: number) => void;
  setEffectsVolume: (volume: number) => void;
  toggleColorBlindMode: (enabled: boolean) => void;
  setTextSize: (size: TextSize) => void;
  setDefaultTimer: (duration: number) => void;
  setDefaultBoardSize: (size: number) => void;
  setDefaultDifficulty: (difficulty: "easy" | "medium" | "hard") => void;
  setDefaultLanguage: (language: string) => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(
  undefined
);

interface PreferencesProviderProps {
  children: ReactNode;
}

export const PreferencesProvider = ({ children }: PreferencesProviderProps) => {
  const [preferences, dispatch] = useReducer(
    preferencesReducer,
    loadSavedPreferences()
  );

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("bogglePreferences", JSON.stringify(preferences));
    } catch (error) {
      console.error("Error saving preferences to localStorage", error);
    }
  }, [preferences]);

  // Apply theme to document body
  useEffect(() => {
    if (preferences.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [preferences.theme]);

  // Preferences setters
  const setTheme = (theme: ThemeMode) => {
    dispatch({ type: "SET_THEME", payload: { theme } });
  };

  const toggleSoundEffects = (enabled: boolean) => {
    dispatch({ type: "TOGGLE_SOUND_EFFECTS", payload: { enabled } });
  };

  const setMusicVolume = (volume: number) => {
    dispatch({ type: "SET_MUSIC_VOLUME", payload: { volume } });
  };

  const setEffectsVolume = (volume: number) => {
    dispatch({ type: "SET_EFFECTS_VOLUME", payload: { volume } });
  };

  const toggleColorBlindMode = (enabled: boolean) => {
    dispatch({ type: "TOGGLE_COLOR_BLIND_MODE", payload: { enabled } });
  };

  const setTextSize = (size: TextSize) => {
    dispatch({ type: "SET_TEXT_SIZE", payload: { size } });
  };

  const setDefaultTimer = (duration: number) => {
    dispatch({ type: "SET_DEFAULT_TIMER", payload: { duration } });
  };

  const setDefaultBoardSize = (size: number) => {
    dispatch({ type: "SET_DEFAULT_BOARD_SIZE", payload: { size } });
  };

  const setDefaultDifficulty = (difficulty: "easy" | "medium" | "hard") => {
    dispatch({ type: "SET_DEFAULT_DIFFICULTY", payload: { difficulty } });
  };

  const setDefaultLanguage = (language: string) => {
    dispatch({ type: "SET_DEFAULT_LANGUAGE", payload: { language } });
  };

  const value = {
    preferences,
    setTheme,
    toggleSoundEffects,
    setMusicVolume,
    setEffectsVolume,
    toggleColorBlindMode,
    setTextSize,
    setDefaultTimer,
    setDefaultBoardSize,
    setDefaultDifficulty,
    setDefaultLanguage,
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
};
