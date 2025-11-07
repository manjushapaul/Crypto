"use client";

import { useState } from "react";
import { CryptoCurrency } from "@/types/crypto";
import CryptoCard from "./CryptoCard";
import PriceChart from "./PriceChart";
import { X } from "lucide-react";

interface CryptoListProps {
  cryptocurrencies: CryptoCurrency[];
}

export default function CryptoList({ cryptocurrencies }: CryptoListProps) {
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoCurrency | null>(null);

  const handleCryptoClick = (crypto: CryptoCurrency) => {
    setSelectedCrypto(crypto);
  };

  const handleCloseChart = () => {
    setSelectedCrypto(null);
  };

  return (
    <div className="space-y-6">
      {/* Selected Crypto Chart Modal */}
      {selectedCrypto && (
        <div className="rounded-card border border-gray-200 bg-white p-6 shadow-card dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold text-[#1E293B] dark:text-gray-100">
                {selectedCrypto.name} ({selectedCrypto.symbol.toUpperCase()})
              </h3>
            </div>
            <button
              onClick={handleCloseChart}
              className="rounded-lg p-2 text-[#64748B] transition-colors hover:bg-gray-100 hover:text-[#1E293B] dark:hover:bg-gray-800 dark:hover:text-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {selectedCrypto.sparkline_in_7d?.price ? (
            <PriceChart
              data={selectedCrypto.sparkline_in_7d.price}
              color={
                selectedCrypto.price_change_percentage_24h >= 0
                  ? "#10B981"
                  : "#EF4444"
              }
            />
          ) : (
            <div className="flex h-64 items-center justify-center text-[#64748B] dark:text-gray-400">
              Chart data not available
            </div>
          )}
        </div>
      )}

      {/* Crypto Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cryptocurrencies.map((crypto) => (
          <CryptoCard
            key={crypto.id}
            crypto={crypto}
            onClick={() => handleCryptoClick(crypto)}
          />
        ))}
      </div>
    </div>
  );
}

