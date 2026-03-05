export const truncateWallet = (address: string) =>
  `${address.slice(0, 6)}…${address.slice(-4)}`;

export const formatPrice = (price: number, currency: "ETH" | "USD") =>
  currency === "ETH" ? `${price} ETH` : `$${price.toLocaleString()}`;
