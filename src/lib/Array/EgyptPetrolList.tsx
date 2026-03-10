export const EGY_FUEL_PRICES_EGP = {
  petrol80: 15.75,
  petrol92: 19.75,
  petrol95: 21.75,
  kerosene: 17.5,
  solar: 15.75,
  gasStove: 100.0,
  diesel: 13.50,
} as const;

export const petrolUpdate = "10 مارس 2025";
 

export type FuelPriceKeys = keyof typeof EGY_FUEL_PRICES_EGP;
