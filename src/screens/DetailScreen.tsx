import { useEffect, useState } from 'react';
import { colors, fonts } from '../theme/tokens';
import { PhotoPlaceholder } from '../components/PhotoPlaceholder';
import { RestaurantPhoto } from '../components/RestaurantPhoto';
import { FavoriteButton } from '../components/FavoriteButton';
import { Badge } from '../components/Badge';
import { colorForRestaurant } from '../components/RestaurantCard';
import { SkeletonDetail } from '../components/Skeleton';
import { DIET_LABEL, isGem, placeKind, priceLabel } from '../data/restaurants';
import { useApp } from '../state/AppState';

export function DetailScreen() {
  const app = useApp();
  const r = app.selectedRestaurant;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, [r?.id]);

  if (!r) return null;

  if (loading) {
    return (
      <div style={{ flex: 1, overflowY: 'auto', background: colors.cream }}>
        <SkeletonDetail />
      </div>
    );
  }

  const favorite = app.favorites.includes(r.id);
  const gem = isGem(r);
  const isStore = placeKind(r) === 'store';
  const query = encodeURIComponent(`${r.name} ${r.address}`);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
  const wazeUrl = `https://waze.com/ul?q=${query}&navigate=yes`;
  const telUrl = `tel:${r.phone}`;

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: colors.cream }}>
      <div style={{ height: 200, position: 'relative' }}>
        <RestaurantPhoto restaurant={r} width="100%" height="100%" radius={0} bordered={false} baseColor={colorForRestaurant(r)} onColor />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: colors.black }} />
        <button
          type="button"
          onClick={app.backToResults}
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            background: colors.white,
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: colors.black,
            borderRadius: 100,
            paddingTop: 8,
            paddingBottom: 8,
            paddingLeft: 14,
            paddingRight: 14,
            cursor: 'pointer',
            fontFamily: fonts.body,
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          ← Back
        </button>
        <FavoriteButton
          active={favorite}
          onClick={() => app.toggleFavorite(r.id)}
          size={36}
          style={{ position: 'absolute', top: 16, right: 16 }}
        />
      </div>

      <div style={{ padding: 20 }}>
        <div style={{ fontFamily: fonts.display, fontSize: 44, fontWeight: 900, lineHeight: 1, textTransform: 'uppercase', marginBottom: 10 }}>
          {r.name}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
          <Badge label={`★ ${r.rating} (${r.reviewCount})`} />
          <Badge label={priceLabel(r.price)} />
          <Badge label={DIET_LABEL[r.dietCategory]} filled />
          {r.isFastFood && <Badge label="Fast food" bg={colors.yellow} />}
          {gem && <Badge label="Hidden gem" bg={colors.purple} />}
        </div>

        <div style={{ fontFamily: fonts.body, fontSize: 14, opacity: 0.75, lineHeight: 1.4 }}>
          {r.distance} mi away · {r.address}
        </div>
        <div style={{ fontFamily: fonts.body, fontSize: 14, fontWeight: 700, marginTop: 2, marginBottom: 16 }}>{r.hours}</div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <ActionLink label="Maps" bg={colors.green} href={googleMapsUrl} />
          <ActionLink label="Waze" bg={colors.blue} href={wazeUrl} />
          <ActionLink label="Call" bg={colors.white} href={telUrl} />
        </div>

        <div
          style={{
            background: colors.yellow,
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: colors.black,
            borderRadius: 20,
            padding: 16,
            marginBottom: 22,
            boxShadow: `5px 5px 0 ${colors.black}`,
          }}
        >
          <div style={{ fontFamily: fonts.display, fontSize: 22, fontWeight: 800, textTransform: 'uppercase', marginBottom: 6 }}>
            {isStore ? 'Shopped here?' : 'Eaten here?'}
          </div>
          <div style={{ fontFamily: fonts.body, fontSize: 14, lineHeight: 1.4, marginBottom: 12 }}>
            {isStore
              ? "You're the 3rd person to open this page today. Be the one who says what's actually worth grabbing here."
              : "You're the 3rd person to open this page today. Be the one who says what's actually vegan."}
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <button
              type="button"
              style={{
                flex: 1,
                background: colors.black,
                border: 'none',
                borderRadius: 100,
                paddingTop: 12,
                paddingBottom: 12,
                cursor: 'pointer',
                fontFamily: fonts.display,
                fontSize: 14,
                fontWeight: 800,
                color: colors.white,
                textTransform: 'uppercase',
              }}
            >
              Review +100
            </button>
            <button
              type="button"
              style={{
                flex: 1,
                background: colors.white,
                borderWidth: 2,
                borderStyle: 'solid',
                borderColor: colors.black,
                borderRadius: 100,
                paddingTop: 10,
                paddingBottom: 10,
                cursor: 'pointer',
                fontFamily: fonts.display,
                fontSize: 14,
                fontWeight: 800,
                textTransform: 'uppercase',
              }}
            >
              Photo +50
            </button>
          </div>
          <div style={{ fontFamily: fonts.body, fontSize: 12, fontWeight: 600, opacity: 0.8 }}>
            First review here earns the ⭐ Trailblazer sticker.
          </div>
        </div>

        <SectionHeading title={isStore ? 'What they carry' : 'Vegan & veg options'} />
        {r.menu.length === 0 ? (
          <div
            style={{
              background: colors.white,
              borderWidth: 2,
              borderStyle: 'solid',
              borderColor: colors.black,
              borderRadius: 16,
              padding: 14,
              marginBottom: 22,
            }}
          >
            <div style={{ fontFamily: fonts.body, fontSize: 13.5, opacity: 0.75, lineHeight: 1.4 }}>
              {isStore
                ? "We don't have details on their vegan/vegetarian selection yet — be the first to add a review naming what's worth picking up here."
                : "Dish-level vegan/vegetarian details aren't available for this listing yet — be the first to add a review naming what's actually plant-based here."}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
            {r.menu.map((m) => (
              <div
                key={m.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: colors.white,
                  borderWidth: 2,
                  borderStyle: 'solid',
                  borderColor: colors.black,
                  borderRadius: 16,
                  paddingTop: 11,
                  paddingBottom: 11,
                  paddingLeft: 14,
                  paddingRight: 14,
                }}
              >
                <span style={{ fontFamily: fonts.body, fontSize: 15, fontWeight: 600, flex: 1, marginRight: 8 }}>{m.name}</span>
                <Badge label={m.tag === 'vegan' ? 'Vegan' : 'Vegetarian'} bg={m.tag === 'vegan' ? colors.green : colors.yellow} />
              </div>
            ))}
          </div>
        )}

        <div style={{ fontFamily: fonts.body, fontSize: 14, opacity: 0.75, lineHeight: 1.4, marginBottom: 22 }}>{r.note}</div>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
          <SectionHeading title="Photos" noMargin />
          <span style={{ fontFamily: fonts.body, fontSize: 13, fontWeight: 600, opacity: 0.7 }}>{r.photoCount} photos</span>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
          {[0, 1, 2].map((i) =>
            r.photoName ? (
              <RestaurantPhoto key={i} restaurant={r} width="31%" height={90} radius={14} />
            ) : (
              <PhotoPlaceholder key={i} width="31%" height={90} radius={14} />
            )
          )}
        </div>

        <SectionHeading title={`Reviews · ${r.reviewCount}`} />
        {r.reviews.length === 0 ? (
          <div
            style={{
              background: colors.white,
              borderWidth: 2,
              borderStyle: 'solid',
              borderColor: colors.black,
              borderRadius: 18,
              padding: 14,
            }}
          >
            <div style={{ fontFamily: fonts.body, fontSize: 14, lineHeight: 1.4, opacity: 0.75 }}>
              {isStore
                ? "No reviews yet on Grub for this spot — be the first to say what's worth shopping for here."
                : "No reviews yet on Grub for this spot — be the first to say what's actually vegan here."}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {r.reviews.map((rev, i) => (
              <div
                key={i}
                style={{
                  background: colors.white,
                  borderWidth: 2,
                  borderStyle: 'solid',
                  borderColor: colors.black,
                  borderRadius: 18,
                  padding: 14,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontFamily: fonts.body, fontSize: 14, fontWeight: 700 }}>{rev.author}</span>
                  <Badge label={`★ ${rev.rating}`} bg={colors.yellow} />
                </div>
                <div style={{ fontFamily: fonts.body, fontSize: 14, lineHeight: 1.4, opacity: 0.85 }}>{rev.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SectionHeading({ title, noMargin }: { title: string; noMargin?: boolean }) {
  return (
    <div
      style={{
        fontFamily: fonts.display,
        fontSize: 26,
        fontWeight: 800,
        textTransform: 'uppercase',
        lineHeight: 1.1,
        marginBottom: noMargin ? 0 : 10,
      }}
    >
      {title}
    </div>
  );
}

function ActionLink({ label, bg, href }: { label: string; bg: string; href: string }) {
  return (
    <a
      href={href}
      target={href.startsWith('tel:') ? undefined : '_blank'}
      rel="noopener noreferrer"
      style={{
        flex: 1,
        background: bg,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: colors.black,
        borderRadius: 100,
        paddingTop: 13,
        paddingBottom: 13,
        textAlign: 'center',
        cursor: 'pointer',
        fontFamily: fonts.display,
        fontSize: 15,
        fontWeight: 800,
        textTransform: 'uppercase',
        color: colors.black,
        display: 'block',
      }}
    >
      {label}
    </a>
  );
}
