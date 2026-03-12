const API_KEY = "5f3753088863b96d728c949825ba51b3950815653472f06255e6ac1a15c1579d";

export async function getPrice(symbol: string): Promise<number> {
  const res = await fetch(
    `https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=USD&api_key=${API_KEY}`
  );

  const data = await res.json();

  if (!data.USD) throw new Error("Not found");

  return data.USD;
}
