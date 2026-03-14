export const EGY_FUEL_PRICES_EGP = {
  petrol80: 20.75,
  petrol92: 22.25,
  petrol95: 24.0,
  kerosene: 20.5,
  solar: 20.5,
  gasStove: 275.0,
} as const;

// Previous government prices — update old → current whenever prices change
export const EGY_FUEL_OLD_PRICES_EGP = {
  petrol80: 17.75,
  petrol92: 19.25,
  petrol95: 21.0,
  kerosene: 17.5,
  solar: 17.5,
  gasStove: 225.0,
} as const;

export const petrolUpdate = "10 مارس 2025";
export const petrolOldUpdate = "أكتوبر 2023"; // date of previous prices

export type FuelPriceKeys = keyof typeof EGY_FUEL_PRICES_EGP;
