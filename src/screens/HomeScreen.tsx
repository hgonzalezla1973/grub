import { colors, fonts } from '../theme/tokens';
import { Pill } from '../components/Pill';
import { SegmentedControl } from '../components/Chip';
import { useApp } from '../state/AppState';

export function HomeScreen() {
  const app = useApp();
  const locationLabel = app.mode === 'trip' ? app.destination || 'Planning a trip' : 'Current location';

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        background: colors.cream,
        padding: 20,
        paddingTop: 22,
        paddingBottom: 28,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <span
          style={{
            fontFamily: fonts.body,
            fontSize: 12,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 0.6,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          📍 {locationLabel}
        </span>
        <button
          type="button"
          onClick={app.goProfile}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            background: colors.purple,
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: colors.black,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: `3px 3px 0 ${colors.black}`,
            flexShrink: 0,
          }}
        >
          <span style={{ fontFamily: fonts.display, fontSize: 14, fontWeight: 800 }}>MR</span>
        </button>
      </div>

      <div
        style={{
          fontFamily: fonts.display,
          fontSize: 52,
          fontWeight: 900,
          lineHeight: 1,
          textTransform: 'uppercase',
          marginBottom: 18,
        }}
      >
        What are
        <br />
        you craving?
      </div>

      <SegmentedControl
        options={[
          { label: 'Near me', value: 'near' },
          { label: 'Plan a trip', value: 'trip' },
        ]}
        value={app.mode}
        onChange={app.setMode}
        style={{ marginBottom: 16, alignSelf: 'flex-start' }}
      />

      {app.mode === 'trip' && (
        <input
          value={app.destination}
          onChange={(e) => app.setDestination(e.target.value)}
          placeholder="Where are you headed?"
          style={{
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: colors.black,
            borderRadius: 16,
            paddingTop: 13,
            paddingBottom: 13,
            paddingLeft: 16,
            paddingRight: 16,
            fontSize: 15,
            background: colors.white,
            marginBottom: 16,
            outline: 'none',
          }}
        />
      )}

      <div
        style={{
          background: colors.coral,
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: colors.black,
          borderRadius: 22,
          padding: 20,
          marginBottom: 14,
          boxShadow: `5px 5px 0 ${colors.black}`,
        }}
      >
        <div
          style={{
            fontFamily: fonts.display,
            fontSize: 34,
            fontWeight: 900,
            lineHeight: 1,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          Browse
          <br />
          every spot
        </div>
        <div style={{ fontFamily: fonts.body, fontSize: 15, lineHeight: 1.4, opacity: 0.85, marginBottom: 16 }}>
          Filter by 100% vegan, vegan options or vegetarian options.
        </div>
        <Pill label="Find food" onClick={app.goResults} fontSize={20} style={{ width: undefined, paddingTop: 15, paddingBottom: 15 }} />
      </div>

      <button
        type="button"
        onClick={app.goSaved}
        style={{
          textAlign: 'left',
          background: colors.blue,
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: colors.black,
          borderRadius: 22,
          padding: 18,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: `4px 4px 0 ${colors.black}`,
          cursor: 'pointer',
        }}
      >
        <div>
          <div style={{ fontFamily: fonts.display, fontSize: 23, fontWeight: 800, textTransform: 'uppercase' }}>
            Saved · {app.favorites.length}
          </div>
          <div style={{ fontFamily: fonts.body, fontSize: 13, fontWeight: 600, opacity: 0.78, marginTop: 2 }}>Works offline</div>
        </div>
        <span style={{ fontSize: 26 }}>♥</span>
      </button>
    </div>
  );
}
