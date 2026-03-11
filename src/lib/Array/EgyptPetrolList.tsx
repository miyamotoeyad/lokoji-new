export const EGY_FUEL_PRICES_EGP = {
  petrol80: 20.75,
  petrol92: 22.25,
  petrol95: 24,
  kerosene: 20.50,
  solar: 20.5,
  gasStove: 275.00,
  diesel: 13.50,
} as const;

export const petrolUpdate = "10 مارس 2025";
 

export type FuelPriceKeys = keyof typeof EGY_FUEL_PRICES_EGP;
