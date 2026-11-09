export const truncateWallet = (address: string) =>
  `${address.slice(0, 6)}…${address.slice(-4)}`;

// The API returns decimals as strings like "300.000000"; normalise before display
export const formatPrice = (price: number | string, currency: "ETH" | "USD") => {
  const value = Number(price) || 0;
  return currency === "ETH"
    ? `${value.toLocaleString(undefined, { maximumFractionDigits: 6 })} ETH`
    : `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
};
