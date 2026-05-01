export const SP_ATTACK_EXCEPTION_SHIPS = [
  '大鯨',
  '龍鳳',
  '響',
  'Верный',
];

// Variants of an exception ship are disabled unless their name contains the row ship's name,
// because the SP attack multiplier differs across the variant lineage.
export const isVariantDisabled = (rowShipName: string, variantName: string): boolean => {
  if (SP_ATTACK_EXCEPTION_SHIPS.some((ex) => rowShipName.includes(ex))) {
    return !variantName.includes(rowShipName)
  }
  return false
}
