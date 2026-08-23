import { colors, fonts } from '../theme/tokens';
import { useApp } from '../state/AppState';

export function BottomNav() {
  const app = useApp();

  const items = [
    {
      label: 'Explore',
      active: app.screen === 'results' && app.resultsView === 'list',
      onClick: () => app.goResults(),
    },
    {
      label: 'Map',
      active: app.screen === 'results' && app.resultsView === 'map',
      onClick: () => {
        app.setResultsView('map');
        app.goResults();
      },
    },
    { label: 'Saved', active: app.screen === 'saved', onClick: app.goSaved },
    { label: 'You', active: app.screen === 'profile', onClick: app.goProfile },
  ];

  return (
    <div
      style={{
        display: 'flex',
        gap: 4,
        background: colors.black,
        padding: 5,
        borderRadius: 100,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: colors.black,
        marginLeft: 18,
        marginRight: 18,
        marginBottom: 14,
        flexShrink: 0,
      }}
    >
      {items.map((it) => (
        <button
          type="button"
          key={it.label}
          onClick={it.onClick}
          style={{
            flex: 1,
            paddingTop: 11,
            paddingBottom: 11,
            border: 'none',
            borderRadius: 100,
            cursor: 'pointer',
            background: it.active ? colors.green : 'transparent',
            fontFamily: fonts.display,
            fontSize: 16,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: 0.3,
            color: it.active ? colors.black : colors.white,
            whiteSpace: 'nowrap',
          }}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}
