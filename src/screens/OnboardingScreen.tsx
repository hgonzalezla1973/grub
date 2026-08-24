import { useState, type ReactNode } from 'react';
import { colors, fonts } from '../theme/tokens';
import { Pill } from '../components/Pill';
import { DIET_LABEL, type DietCategory } from '../data/restaurants';
import { useApp, type DistanceKey } from '../state/AppState';

const STEP_BG: Record<1 | 2 | 3 | 4, string> = { 1: colors.green, 2: colors.purple, 3: colors.coral, 4: colors.blue };

const DIET_CARDS: { key: DietCategory; label: string; detail: string }[] = [
  { key: 'vegan', label: '100% Vegan', detail: 'Only kitchens with no animal products at all.' },
  { key: 'veganOptions', label: 'Vegan options', detail: 'Any restaurant with dishes marked vegan.' },
  { key: 'vegetarian', label: 'Vegetarian options', detail: 'Meat-free dishes, dairy and egg are fine.' },
];

const DISTANCE_CARDS: { key: DistanceKey; label: string; detail: string }[] = [
  { key: 'near', label: 'Less than 3 mi', detail: 'Walkable — right in the neighborhood.' },
  { key: 'mid', label: '3 to 10 mi', detail: 'A short drive across town.' },
  { key: 'far', label: 'More than 10 mi', detail: "Worth the trip if it's good." },
];

export function OnboardingScreen() {
  const app = useApp();
  const bg = STEP_BG[app.onboardStep];

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: bg,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 22,
        paddingBottom: 28,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              style={{
                width: n === app.onboardStep ? 26 : 9,
                height: 9,
                borderRadius: 100,
                borderWidth: 2,
                borderStyle: 'solid',
                borderColor: colors.black,
                background: n <= app.onboardStep ? colors.black : 'transparent',
              }}
            />
          ))}
        </div>
        {app.onboardStep < 4 && (
          <button
            type="button"
            onClick={app.goHome}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              fontFamily: fonts.body,
              fontSize: 12.5,
              fontWeight: 700,
              textDecoration: 'underline',
            }}
          >
            Skip
          </button>
        )}
      </div>

      {app.onboardStep === 1 && <StepOne />}
      {app.onboardStep === 2 && <StepDistance />}
      {app.onboardStep === 3 && <StepDiet />}
      {app.onboardStep === 4 && <StepTeaser />}
    </div>
  );
}

type LocationStatus = 'idle' | 'requesting' | 'denied' | 'blocked' | 'unavailable';

/** A hung permission/GPS call must never leave the button stuck on "Checking…" forever. */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`timed out after ${ms}ms`)), ms);
    promise.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      }
    );
  });
}

function getCurrentPosition(options: PositionOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

function StepOne() {
  const app = useApp();
  const [status, setStatus] = useState<LocationStatus>('idle');
  const [showCityInput, setShowCityInput] = useState(false);
  const [city, setCity] = useState('');

  const handleCitySubmit = () => {
    const trimmed = city.trim();
    if (!trimmed) return;
    app.setDestination(trimmed);
    app.setMode('trip');
    app.loadRestaurantsForCity(trimmed);
    app.onboardNext();
  };

  const handleUseLocation = async () => {
    setStatus('requesting');

    if (!('geolocation' in navigator)) {
      setStatus('unavailable');
      return;
    }

    try {
      // Check whether this was already permanently denied at the browser level — if so,
      // getCurrentPosition will fail instantly with no browser prompt at all, which needs
      // different guidance (go change it in the browser's site settings) than a fresh "no".
      if ('permissions' in navigator) {
        try {
          const status = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
          if (status.state === 'denied') {
            setStatus('blocked');
            return;
          }
        } catch {
          // Permissions API not fully supported (e.g. Safari) — fall through and just try.
        }
      }

      const position = await withTimeout(getCurrentPosition({ enableHighAccuracy: false, timeout: 15000 }), 15000);
      const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
      app.setUserLocation(coords);
      app.loadNearbyRestaurants(coords);
      app.onboardNext();
    } catch (e) {
      const code = (e as GeolocationPositionError)?.code;
      if (code === 1) {
        setStatus('denied');
      } else {
        console.warn('[location] failed to get current position', e);
        setStatus('unavailable');
      }
    }
  };

  return (
    <>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div
          style={{
            fontFamily: fonts.display,
            fontSize: 104,
            fontWeight: 900,
            lineHeight: 1,
            textTransform: 'uppercase',
            marginBottom: 14,
          }}
        >
          Grub
        </div>
        <div style={{ fontFamily: fonts.body, fontSize: 16, opacity: 0.78, lineHeight: 1.4, maxWidth: 290, marginBottom: 24 }}>
          Find the closest place you can actually order from, whether you're fully vegan or just skipping the meat.
        </div>
        <div
          style={{
            background: colors.white,
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: colors.black,
            borderRadius: 20,
            padding: 16,
            boxShadow: `5px 5px 0 ${colors.black}`,
          }}
        >
          <div style={{ fontFamily: fonts.display, fontSize: 26, fontWeight: 800, textTransform: 'uppercase', lineHeight: 1.1 }}>
            Where are you?
          </div>
          <div style={{ fontFamily: fonts.body, fontSize: 13.5, opacity: 0.75, marginTop: 5, lineHeight: 1.4 }}>
            We use your location to sort spots by how far you'd have to walk or drive. Nothing is shared.
          </div>
        </div>
      </div>

      {!showCityInput && status === 'denied' && (
        <MessageBox title="Location access is off">
          Turn it on any time via your browser's site settings, or just enter a city below to keep going.
        </MessageBox>
      )}

      {!showCityInput && status === 'blocked' && (
        <MessageBox title="Location was already turned off">
          Your browser already remembers a "no" for this site, so it won't prompt again here. Click the padlock/site-info
          icon next to the address bar to re-enable location, or just enter a city below.
        </MessageBox>
      )}

      {!showCityInput && status === 'unavailable' && (
        <MessageBox title="Couldn't get a location fix">
          Permission was granted, but we couldn't read a position (weak signal, or location services are off
          system-wide). Try again, or enter a city below.
        </MessageBox>
      )}

      {showCityInput ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            autoFocus
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCitySubmit();
            }}
            placeholder="City, e.g. Austin, TX"
            style={{
              borderWidth: 2,
              borderStyle: 'solid',
              borderColor: colors.black,
              borderRadius: 16,
              paddingTop: 13,
              paddingBottom: 13,
              paddingLeft: 16,
              paddingRight: 16,
              fontFamily: fonts.body,
              fontSize: 15,
              background: colors.white,
              outline: 'none',
              width: '100%',
            }}
          />
          <Pill label="Continue" onClick={handleCitySubmit} labelColor={colors.green} disabled={!city.trim()} />
          <button
            type="button"
            onClick={() => setShowCityInput(false)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              fontFamily: fonts.body,
              fontSize: 12.5,
              fontWeight: 700,
              textDecoration: 'underline',
            }}
          >
            Use my location instead
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Pill
            label={status === 'requesting' ? 'Checking…' : 'Use my location'}
            onClick={handleUseLocation}
            labelColor={colors.green}
            disabled={status === 'requesting'}
          />
          <Pill label="Enter a city instead" onClick={() => setShowCityInput(true)} variant="outline" fontSize={19} />
        </div>
      )}
    </>
  );
}

function MessageBox({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      style={{
        background: 'rgba(0,0,0,0.08)',
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: colors.black,
        borderRadius: 14,
        padding: 12,
        marginBottom: 10,
      }}
    >
      <div style={{ fontFamily: fonts.body, fontSize: 13, fontWeight: 700 }}>{title}</div>
      <div style={{ fontFamily: fonts.body, fontSize: 12.5, opacity: 0.8, marginTop: 2, lineHeight: 1.35 }}>{children}</div>
    </div>
  );
}

function StepDistance() {
  const app = useApp();

  return (
    <>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div
          style={{
            fontFamily: fonts.display,
            fontSize: 52,
            fontWeight: 900,
            lineHeight: 1,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          How far do
          <br />
          you want to go?
        </div>
        <div style={{ fontFamily: fonts.body, fontSize: 15, opacity: 0.78, lineHeight: 1.4, marginBottom: 20 }}>
          We'll only show spots within this range. Change it any time from the filters.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {DISTANCE_CARDS.map((d) => {
            const on = app.distance === d.key;
            return (
              <button
                type="button"
                key={d.key}
                onClick={() => app.setDistance(on ? 'any' : d.key)}
                style={{
                  textAlign: 'left',
                  background: on ? colors.black : colors.white,
                  borderWidth: 2,
                  borderStyle: 'solid',
                  borderColor: colors.black,
                  borderRadius: 20,
                  padding: 14,
                  paddingLeft: 16,
                  paddingRight: 16,
                  boxShadow: `4px 4px 0 ${colors.black}`,
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    fontFamily: fonts.display,
                    fontSize: 26,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    lineHeight: 1.1,
                    color: on ? colors.white : colors.black,
                  }}
                >
                  {d.label}
                </div>
                <div
                  style={{
                    fontFamily: fonts.body,
                    fontSize: 13,
                    opacity: 0.75,
                    marginTop: 4,
                    lineHeight: 1.35,
                    color: on ? colors.white : colors.black,
                  }}
                >
                  {d.detail}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <Pill
        label={app.distance === 'any' ? 'Any distance is fine' : 'Continue'}
        onClick={app.onboardNext}
        labelColor={colors.purple}
      />
    </>
  );
}

function StepDiet() {
  const app = useApp();
  const hasAny = app.diet.length > 0;
  return (
    <>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div
          style={{
            fontFamily: fonts.display,
            fontSize: 52,
            fontWeight: 900,
            lineHeight: 1,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          How do
          <br />
          you eat?
        </div>
        <div style={{ fontFamily: fonts.body, fontSize: 15, opacity: 0.78, lineHeight: 1.4, marginBottom: 20 }}>
          Pick anything that applies. This becomes your default filter — change it any time.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {DIET_CARDS.map((d) => {
            const on = app.diet.includes(d.key);
            return (
              <button
                type="button"
                key={d.key}
                onClick={() => app.toggleDiet(d.key)}
                style={{
                  textAlign: 'left',
                  background: on ? colors.black : colors.white,
                  borderWidth: 2,
                  borderStyle: 'solid',
                  borderColor: colors.black,
                  borderRadius: 20,
                  padding: 14,
                  paddingLeft: 16,
                  paddingRight: 16,
                  boxShadow: `4px 4px 0 ${colors.black}`,
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    fontFamily: fonts.display,
                    fontSize: 26,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    lineHeight: 1.1,
                    color: on ? colors.white : colors.black,
                  }}
                >
                  {d.label}
                </div>
                <div
                  style={{
                    fontFamily: fonts.body,
                    fontSize: 13,
                    opacity: 0.75,
                    marginTop: 4,
                    lineHeight: 1.35,
                    color: on ? colors.white : colors.black,
                  }}
                >
                  {d.detail}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <Pill label={hasAny ? 'Looks right' : 'Show me everything'} onClick={app.onboardNext} labelColor={colors.coral} />
    </>
  );
}

function StepTeaser() {
  const app = useApp();
  const teaser = app.filteredRestaurants.slice(0, 3);
  const line =
    (app.diet.length
      ? 'Matching your diet, closest first. Tap any spot for dish-level detail.'
      : 'Everything nearby with vegan or vegetarian options, closest first.') +
    (app.usingSampleData ? ' (Sample data — these are fictional demo listings, not real restaurants.)' : '');

  return (
    <>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 0 }}>
        <div
          style={{
            fontFamily: fonts.display,
            fontSize: 52,
            fontWeight: 900,
            lineHeight: 1,
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          {app.filteredRestaurants.length} spots
          <br />
          are ready
        </div>
        <div style={{ fontFamily: fonts.body, fontSize: 15, opacity: 0.78, lineHeight: 1.4, marginBottom: 18 }}>{line}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {teaser.map((r) => (
            <div
              key={r.id}
              style={{
                background: colors.white,
                borderWidth: 2,
                borderStyle: 'solid',
                borderColor: colors.black,
                borderRadius: 18,
                padding: 11,
                display: 'flex',
                gap: 11,
                alignItems: 'center',
                boxShadow: `4px 4px 0 ${colors.black}`,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  flexShrink: 0,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderStyle: 'solid',
                  borderColor: colors.black,
                  background: '#eee',
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: fonts.display,
                    fontSize: 23,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    lineHeight: 1.08,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {r.name}
                </div>
                <div style={{ fontFamily: fonts.body, fontSize: 12, fontWeight: 600, opacity: 0.75, marginTop: 2 }}>
                  ★ {r.rating} · {r.distance} mi · {DIET_LABEL[r.dietCategory]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Pill label="Start exploring" onClick={app.startQuiz} labelColor={colors.blue} />
    </>
  );
}
