import { BikeTypes } from '../constants/bikeTypes';
import type { BikeTypeId, StorageType } from '../types';

export default class StorageTip {
  /** Whether to show the "Plan Your Storage" buying tip (bulky bike, no garage). */
  static shouldShowBuyingTip(bikeType: BikeTypeId, storage: StorageType): boolean {
    const isBulky = BikeTypes[bikeType]?.bulky ?? false;

    return isBulky && storage !== 'garage';
  }

  /** Whether to show the alternate bike note (bulky bike, no easy storage). */
  static shouldShowAlternateNote(bikeType: BikeTypeId, storage: StorageType): boolean {
    const typeInfo = BikeTypes[bikeType];

    if (!typeInfo?.bulky || !typeInfo.storageDowngrade) return false;

    return storage !== 'garage' && storage !== 'outdoor';
  }
}
