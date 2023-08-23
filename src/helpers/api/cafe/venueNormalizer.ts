import { CafeVenue } from 'src/models/CafeModel/VenueModel'

export const venueNormalizer = (venue): CafeVenue => ({
  id: venue.id,
  name: venue.location_nickname || venue.name || '(no name)',
  description: venue.description,
  latitude: parseFloat(venue.latitude),
  longitude: parseFloat(venue.longitude),
  ...(venue.distance && { distance: venue.distance }),
  address: venue.address_line1,
  city: venue.address_city,
  state: venue.address_state,
  zip: venue.address_zip,
  country: venue.address_country,
  coverPhoto: venue.cover_photo.original_url,
  menuId: venue.urls.menu.replace('/users/v1/menus/', ''),
  phone: venue.phone,
  storeId: venue.external_venue_id,
  isOpen: venue.is_open,
})
