import { useEffect, useRef, useState } from "react";
import { getPrice } from "./api";
import { useOnline } from "./useOnline";

type Coin = {
  name: string;
  price: number | null;
  change?: "up" | "down";
};

export default function App() {
  const [coins, setCoins] = useState<Coin[]>([
    { name: "DOGE", price: null },
  ]);

  const online = useOnline();
  const ref = useRef<any>();

  async function updateCoin(name: string) {
    const p = await getPrice(name);

    setCoins(prev =>
      prev.map(c => {
        if (c.name !== name) return c;

        let change: "up" | "down" | undefined;
        if (c.price !== null) {
          if (p > c.price) change = "up";
          if (p < c.price) change = "down";
        }

        return { ...c, price: p, change };
      })
    );
  }

  async function updateAll() {
    for (const c of coins) {
      await updateCoin(c.name);
    }
    start();
  }

  function start() {
    clearInterval(ref.current);

    ref.current = setInterval(() => {
      coins.forEach(c => updateCoin(c.name));
    }, 10000);
  }

  async function add(name: string) {
    if (coins.find(c => c.name === name)) return;

    const p = await getPrice(name);

    setCoins([...coins, { name, price: p }]);
  }

  function del(name: string) {
    setCoins(coins.filter(c => c.name !== name));
  }

  useEffect(() => {
    updateAll();
    start();
    return () => clearInterval(ref.current);
  }, []);

  const [input, setInput] = useState("");

  return (
    <div>
      <h1>Crypto tracker</h1>

      <div>{online ? "online" : "offline"}</div>

      <input
        value={input}
        onChange={e => setInput(e.target.value)}
      />

      <button onClick={() => add(input.toUpperCase())}>
        Search
      </button>

      <button onClick={updateAll}>Update all</button>

      {coins.map(c => (
        <div key={c.name}>
          {c.name} {c.price} {c.change === "up" ? "↑" : c.change === "down" ? "↓" : ""}

          <button onClick={() => updateCoin(c.name)}>
            Update
          </button>

          <button onClick={() => del(c.name)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
