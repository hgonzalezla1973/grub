import { AppProvider } from './state/AppState';
import { AppShell } from './AppShell';

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
