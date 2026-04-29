/**
 * Parse and serialize the savings-section query params.
 *
 * Three mutually exclusive car modes are encoded via a single `car` param:
 *   car=new  (default, param omitted) — comparing vs buying a new car
 *   car=used                          — comparing vs buying a used car
 *   car=own                           — user already owns a car (replacement mode)
 *
 * A separate `replace` param (25–100) records the replacement % when car=own.
 * Legacy params are not supported.
 */

export enum CarMode {
  New = 'new',
  Used = 'used',
  Own = 'own',
}

export interface SavingsParams {
  carMode: CarMode;
  replacementPercent: number;
}

export const QueryParams = {
  Car: 'car',
  Replace: 'replace',
} as const;


export const ReplacementMin = 25;
export const ReplacementDefault = 50;
export const ReplacementMax = 100;

function clampReplace(n: number): number {
  return Number.isFinite(n) ? Math.min(ReplacementMax, Math.max(ReplacementMin, n)) : ReplacementDefault;
}

/** Parse query params into a SavingsParams, accepting both new and legacy formats. */
export function parseSavingsParams(query: Record<string, string | string[] | undefined>): SavingsParams {
  const get = (k: string) => (Array.isArray(query[k]) ? (query[k] as string[])[0] : query[k] as string | undefined);

  // New format: car=own|used|new
  if (QueryParams.Car in query) {
    const val = get(QueryParams.Car) ?? '';
    const carMode = val === CarMode.Used ? CarMode.Used : val === CarMode.Own ? CarMode.Own : CarMode.New;
    const replacementPercent = carMode === CarMode.Own
      ? clampReplace(parseInt(get(QueryParams.Replace) ?? '', 10))
      : ReplacementDefault;
    return { carMode, replacementPercent };
  }

  return { carMode: CarMode.New, replacementPercent: ReplacementDefault };
}

/**
 * Return a new URLSearchParams merging savings params into an existing search string.
 * Passes through unrelated params (e.g. `form`, `ideal`) unchanged.
 */
export function applySavingsParams(currentSearch: string, params: SavingsParams): URLSearchParams {
  const query = new URLSearchParams(currentSearch);

  if (params.carMode === CarMode.New) {
    query.delete(QueryParams.Car);
    query.delete(QueryParams.Replace);
  } else {
    query.set(QueryParams.Car, params.carMode);

    if (params.carMode === CarMode.Own) {
      query.set(QueryParams.Replace, String(params.replacementPercent));
    } else {
      query.delete(QueryParams.Replace);
    }
  }

  return query;
}
