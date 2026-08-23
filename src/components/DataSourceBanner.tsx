import React from 'react';
import { Text, View } from 'react-native';
import { colors, fonts } from '../theme/tokens';
import { RestaurantsStatus } from '../state/AppState';

interface Props {
  status: RestaurantsStatus;
  usingSampleData: boolean;
}

export function DataSourceBanner({ status, usingSampleData }: Props) {
  if (!usingSampleData) return null;

  let message: string;
  if (status === 'no-api-key') {
    message = 'No Google Places API key configured — showing fictional sample restaurants. See README-GOOGLE-PLACES-SETUP.md.';
  } else if (status === 'error') {
    message = "Couldn't reach Google Places — showing fictional sample restaurants instead.";
  } else if (status === 'loading') {
    return null; // skeleton covers this case
  } else {
    message = 'Showing fictional sample restaurants (share your location to search real nearby spots).';
  }

  return (
    <View
      style={{
        backgroundColor: colors.yellow,
        borderWidth: 2,
        borderColor: colors.black,
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginBottom: 12,
      }}
    >
      <Text style={{ fontFamily: fonts.bodySemiBold, fontSize: 11.5, fontWeight: '600', lineHeight: 15 }}>{message}</Text>
    </View>
  );
}
