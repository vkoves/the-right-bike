const EarthRadiusMi = 3958.8;

/** Calculates the great-circle distance in miles between two lat/lng points. */
export function haversineDistanceMi(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  return EarthRadiusMi * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
