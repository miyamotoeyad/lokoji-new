// lib/Data/serverData.ts
import { cache } from "react";
import { getExchangeRates } from "./exchangeData";
import { getCryptoData } from "./getCryptoData";
import { getCommodities } from "./commoditiesData";
import { getEgyptianMarketData } from "./egMarketData";
import { getWorldStocksData } from "./worldStocksData";
import { getETFs } from "./etfData";
import getArticles from "@/utils/Content/getArticles";
import { getWorldMarketData } from "./worldMarketData";

// One function, called everywhere — React.cache deduplicates it
export const getServerData = cache(async () => {
  const [
    article,
    exchange,
    crypto,
    commodities,
    etf,
    egMarket,
    worldMarket,
    worldStocks,
  ] = await Promise.all([
    getArticles(),
    getExchangeRates("USD"),
    getCryptoData(),
    getCommodities(),
    getETFs(),
    getEgyptianMarketData(),
    getWorldMarketData(),
    getWorldStocksData(),
  ]);

  return {
    article,
    exchange,
    crypto,
    commodities,
    etf,
    egMarket,
    worldMarket,
    worldStocks,
  };
});
