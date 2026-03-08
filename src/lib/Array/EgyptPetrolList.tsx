export const EGY_FUEL_PRICES_EGP = {
  petrol80: 17.75,
  petrol92: 19.25,
  petrol95: 21.0,
  kerosene: 17.5,
  solar: 17.5,
  gasStove: 100.0,
  diesel: 13.50,
} as const;

export const petrolUpdate = "17 أكتوبر 2025";
 

export type FuelPriceKeys = keyof typeof EGY_FUEL_PRICES_EGP;