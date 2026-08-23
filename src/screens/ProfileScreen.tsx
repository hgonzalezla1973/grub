import { colors, fonts } from '../theme/tokens';
import { ProgressBar } from '../components/ProgressBar';
import { PROFILE, QUESTS, rewards, STICKERS } from '../data/rewards';
import { DIET_FILTERS, type DietCategory } from '../data/restaurants';
import { useApp } from '../state/AppState';

export function ProfileScreen() {
  const app = useApp();
  const pointsPct = rewards.points / rewards.nextTierPoints;
  const pointsToNext = rewards.nextTierPoints - rewards.points;

  const stats = [
    { value: String(PROFILE.reviews), label: 'Reviews', bg: colors.green },
    { value: String(PROFILE.photos), label: 'Photos', bg: colors.yellow },
    { value: String(app.favorites.length), label: 'Saved', bg: colors.coral },
  ];

  const activityRows = [
    { label: 'My reviews', detail: `${PROFILE.reviews} places reviewed` },
    { label: 'My photos', detail: `${PROFILE.photos} uploads` },
    { label: 'Saved places', detail: `${app.savedList.length} available offline` },
    { label: 'Suggest a spot', detail: "Add somewhere we're missing" },
  ];

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        background: colors.cream,
        padding: 20,
        paddingTop: 22,
        paddingBottom: 16,
      }}
    >
      <div
        style={{
          background: colors.purple,
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: colors.black,
          borderRadius: 22,
          padding: 18,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 14,
          boxShadow: `5px 5px 0 ${colors.black}`,
        }}
      >
        <div
          style={{
            width: 66,
            height: 66,
            borderRadius: 33,
            background: colors.white,
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: colors.black,
            marginBottom: 10,
          }}
        />
        <div style={{ fontFamily: fonts.display, fontSize: 34, fontWeight: 900, textTransform: 'uppercase' }}>{PROFILE.name}</div>
        <div style={{ fontFamily: fonts.body, fontSize: 13, fontWeight: 600, opacity: 0.8, marginTop: 2 }}>
          {PROFILE.location} · joined {PROFILE.joined}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              flex: 1,
              background: s.bg,
              borderWidth: 2,
              borderStyle: 'solid',
              borderColor: colors.black,
              borderRadius: 18,
              padding: 12,
              boxShadow: `4px 4px 0 ${colors.black}`,
            }}
          >
            <div style={{ fontFamily: fonts.display, fontSize: 30, fontWeight: 800 }}>{s.value}</div>
            <div style={{ fontFamily: fonts.body, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: colors.green,
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: colors.black,
          borderRadius: 20,
          padding: 16,
          marginBottom: 20,
          boxShadow: `5px 5px 0 ${colors.black}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontFamily: fonts.body, fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6 }}>
            Sprout points
          </span>
          <span style={{ fontFamily: fonts.body, fontSize: 12.5, fontWeight: 600 }}>🔥 {rewards.streak} week streak</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ fontFamily: fonts.display, fontSize: 42, fontWeight: 900 }}>{rewards.points.toLocaleString()}</span>
          <span
            style={{
              background: colors.white,
              borderWidth: 2,
              borderStyle: 'solid',
              borderColor: colors.black,
              borderRadius: 100,
              paddingTop: 5,
              paddingBottom: 5,
              paddingLeft: 12,
              paddingRight: 12,
              fontFamily: fonts.body,
              fontSize: 12,
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}
          >
            {rewards.tier}
          </span>
        </div>
        <ProgressBar progress={pointsPct} />
        <div style={{ fontFamily: fonts.body, fontSize: 12, fontWeight: 600, marginTop: 8, opacity: 0.85 }}>
          {pointsToNext} points to {rewards.nextTier} — unlocks {rewards.nextPerk}.
        </div>
      </div>

      <div style={{ fontFamily: fonts.display, fontSize: 26, fontWeight: 800, textTransform: 'uppercase', marginBottom: 2 }}>
        This month's quests
      </div>
      <div style={{ fontFamily: fonts.body, fontSize: 12.5, fontWeight: 600, opacity: 0.7, marginBottom: 10 }}>Resets in 9 days</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {QUESTS.map((q) => (
          <div
            key={q.title}
            style={{
              background: q.bg,
              borderWidth: 2,
              borderStyle: 'solid',
              borderColor: colors.black,
              borderRadius: 20,
              padding: 14,
              boxShadow: `4px 4px 0 ${colors.black}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, gap: 8 }}>
              <span
                style={{
                  fontFamily: fonts.display,
                  fontSize: 23,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {q.title}
              </span>
              <span
                style={{
                  background: colors.black,
                  borderRadius: 100,
                  paddingTop: 4,
                  paddingBottom: 4,
                  paddingLeft: 10,
                  paddingRight: 10,
                  color: colors.white,
                  fontFamily: fonts.body,
                  fontSize: 12,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}
              >
                +{q.reward}
              </span>
            </div>
            <div style={{ fontFamily: fonts.body, fontSize: 13.5, lineHeight: 1.35, marginBottom: 10 }}>{q.detail}</div>
            <ProgressBar progress={q.done / q.goal} height={12} />
            <div style={{ fontFamily: fonts.body, fontSize: 12, fontWeight: 600, marginTop: 6, opacity: 0.85 }}>
              {q.done} of {q.goal} done
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontFamily: fonts.display, fontSize: 26, fontWeight: 800, textTransform: 'uppercase', marginBottom: 2 }}>
        Sticker book
      </div>
      <div style={{ fontFamily: fonts.body, fontSize: 13, opacity: 0.7, marginBottom: 10, lineHeight: 1.35 }}>
        Earn one for every milestone. Trade nothing, brag freely.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
        {STICKERS.map((st) => (
          <div
            key={st.label}
            style={{
              aspectRatio: '1',
              borderWidth: 2,
              borderStyle: 'solid',
              borderColor: colors.black,
              borderRadius: 16,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 4,
              background: st.earned ? colors.white : 'rgba(0,0,0,0.06)',
              opacity: st.earned ? 1 : 0.45,
              boxShadow: st.earned ? `3px 3px 0 ${colors.black}` : 'none',
            }}
          >
            <span style={{ fontSize: 22, marginBottom: 4 }}>{st.icon}</span>
            <span
              style={{
                fontFamily: fonts.body,
                fontSize: 9.5,
                fontWeight: 700,
                textTransform: 'uppercase',
                textAlign: 'center',
                lineHeight: 1.15,
              }}
            >
              {st.label}
            </span>
          </div>
        ))}
      </div>

      <div style={{ fontFamily: fonts.display, fontSize: 26, fontWeight: 800, textTransform: 'uppercase', marginBottom: 10 }}>
        My diet
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
        {DIET_FILTERS.map(([key, label]) => {
          const active = app.diet.includes(key);
          return (
            <button
              type="button"
              key={key}
              onClick={() => app.toggleDiet(key as DietCategory)}
              style={{
                paddingTop: 9,
                paddingBottom: 9,
                paddingLeft: 15,
                paddingRight: 15,
                borderRadius: 100,
                borderWidth: 2,
                borderStyle: 'solid',
                borderColor: colors.black,
                background: active ? colors.black : colors.white,
                cursor: 'pointer',
                fontFamily: fonts.body,
                fontSize: 12.5,
                fontWeight: 700,
                color: active ? colors.white : colors.black,
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
      <div style={{ fontFamily: fonts.body, fontSize: 12.5, opacity: 0.65, marginBottom: 20 }}>
        Used as the default filter every time you search.
      </div>

      <div style={{ fontFamily: fonts.display, fontSize: 26, fontWeight: 800, textTransform: 'uppercase', marginBottom: 10 }}>
        Activity
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
        {activityRows.map((row) => (
          <div
            key={row.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: colors.white,
              borderWidth: 2,
              borderStyle: 'solid',
              borderColor: colors.black,
              borderRadius: 18,
              padding: 14,
            }}
          >
            <div>
              <div style={{ fontFamily: fonts.body, fontSize: 15, fontWeight: 700 }}>{row.label}</div>
              <div style={{ fontFamily: fonts.body, fontSize: 12.5, opacity: 0.7, marginTop: 2 }}>{row.detail}</div>
            </div>
            <span style={{ fontSize: 20 }}>›</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={app.goHome}
        style={{
          background: 'none',
          border: 'none',
          width: '100%',
          cursor: 'pointer',
          fontFamily: fonts.body,
          fontSize: 13,
          fontWeight: 700,
          textDecoration: 'underline',
          textAlign: 'center',
        }}
      >
        Back to home
      </button>
    </div>
  );
}
