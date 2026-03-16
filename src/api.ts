const API_KEY = import.meta.env.VITE_API_KEY;

export async function getPrice(symbol: string): Promise<number> {
  const res = await fetch(
    `https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=USD&api_key=${API_KEY}`
  );

  const data = await res.json();

  if (!data.USD) throw new Error("Not found");

  return data.USD;
}
