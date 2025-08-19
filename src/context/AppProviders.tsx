import { ReactNode } from 'react';
import { GameProvider } from './GameContext';
import { PreferencesProvider } from './PreferencesContext';
import { StatisticsProvider } from './StatisticsContext';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <PreferencesProvider>
      <StatisticsProvider>
        <GameProvider>
          {children}
        </GameProvider>
      </StatisticsProvider>
    </PreferencesProvider>
  );
};