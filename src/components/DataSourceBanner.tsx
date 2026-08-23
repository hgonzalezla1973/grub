import { colors, fonts } from '../theme/tokens';
import type { RestaurantsStatus } from '../state/AppState';

interface Props {
  status: RestaurantsStatus;
  usingSampleData: boolean;
}

export function DataSourceBanner({ status, usingSampleData }: Props) {
  if (!usingSampleData) return null;

  let message: string;
  if (status === 'no-api-key') {
    message = 'No Yelp or Google Places API key configured — showing fictional sample restaurants. See README-YELP-SETUP.md.';
  } else if (status === 'error') {
    message = "Couldn't reach Yelp or Google Places — showing fictional sample restaurants instead.";
  } else if (status === 'loading') {
    return null; // skeleton covers this case
  } else {
    message = 'Showing fictional sample restaurants (share your location to search real nearby spots).';
  }

  return (
    <div
      style={{
        background: colors.yellow,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: colors.black,
        borderRadius: 12,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 12,
        paddingRight: 12,
        marginBottom: 12,
        fontFamily: fonts.body,
        fontSize: 11.5,
        fontWeight: 600,
        lineHeight: 1.3,
      }}
    >
      {message}
    </div>
  );
}
