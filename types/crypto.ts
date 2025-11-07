export interface CryptoCurrency {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  image: string;
  sparkline_in_7d?: {
    price: number[];
  };
}

export interface MarketStats {
  total_market_cap: number;
  total_volume: number;
  btc_dominance: number;
  active_cryptocurrencies: number;
}




