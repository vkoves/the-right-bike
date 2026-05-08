/**
 * Chicago ZIP code centroids derived from polygon boundaries in:
 * lseemann/Chicago_ZIP_Codes — https://github.com/lseemann/Chicago_ZIP_Codes
 *
 * The original GeoJSON (with full polygon geometry) is stored at:
 * public/data/chicago-zip-polygons.geojson
 *
 * Centroids were computed by averaging all polygon coordinate points.
 * Downtown ZIPs absent from the source (60601–60607, 60611, 60633, 60642,
 * 60654, 60661) use manually estimated centroids.
 */
import zipData from './chicago-zip-codes.json';

export const ChicagoZipCodes: Record<string, { lat: number; lng: number }> = zipData;
