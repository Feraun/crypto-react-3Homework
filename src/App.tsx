import {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { CoinRow } from "./CoinRow";
import { getPrice } from "./api";
import { useOnline } from "./useOnline";
import "./index.css";

//монета
export type Coin = {
  name: string;
  price: number | null;
  change?: "up" | "down";
};

//объект, хранящий в себе {DOGE : {name: "DOGE", price: null, change: ЕГО МОЖЕТ НЕ БЫТЬ }}
type CoinsState = Record<string, Coin>;

export default function App() {
  const [coins, setCoins] = useState<CoinsState>({
    DOGE: { name: "DOGE", price: null },
  });

  //ввод названия
  const [input, setInput] = useState("");

  const [error, setError] = useState<string | null>(null);

  //мой кастомный
  const online = useOnline();

  //для таймера
  const intervalRef = useRef<number | null>(null);

  //
  const updateCoin = useCallback(
    async (name: string) => {
      try {
        const p = await getPrice(name);
        
       
        setCoins(prev => {
          const coin = prev[name];

          //если монета не нашлась возвращаем предыдущий массив, 
          if (!coin){ 
            return prev;
          }

          let change: Coin["change"];

          if (coin.price !== null) {
            if (p > coin.price) change = "up";
            if (p < coin.price) change = "down";
          }

          return {
            ...prev,
            //если нашлась, то добавляем ее
            [name]: {
              ...coin,
              price: p,
              change,
            },
          };
        });

        setError(null);
      } catch {
        setError("Currency not found");
      }
    },
    []
  );

  const updateAll = useCallback(async () => {
    const names = Object.keys(coins);

    for (const name of names) {
      await updateCoin(name);
    }

    startInterval();
  }, [coins, updateCoin]);

  
  const startInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
      Object.keys(coins).forEach(name => {
        updateCoin(name);
      });
    }, 10000);
  }, [coins, updateCoin]);


  const add = useCallback(
    async (name: string) => {
      if (!name) return;

      if (coins[name]) {
        setError("Already added");
        return;
      }

      try {
        const price = await getPrice(name);

        setCoins(prev => ({
          ...prev,
          [name]: {
            name,
            price,
          },
        }));

        setError(null);
      } catch {
        setError("Currency not found");
      }
    },
    [coins]
  );

  const del = useCallback((name: string) => {
    setCoins(prev => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  }, []);

  useEffect(() => {
    updateAll();
    startInterval();

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="app">
      <h1>Crypto tracker</h1>

      <div>
        Status: {online ? "online" : "offline"}
      </div>

      {error && (
        <div style={{ color: "red" }}>
          {error}
        </div>
      )}

      <input
        value={input}
        onChange={e => setInput(e.target.value)}
      />

      <button
        onClick={() => {
          add(input.toUpperCase());
          setInput("");
        }}
      >
        Search
      </button>

      <button onClick={updateAll}>
        Update all
      </button>

      {Object.values(coins).map(c => (
        <CoinRow
          key={c.name}
          coin={c}
          onUpdate={updateCoin}
          onDelete={del}
        />
      ))}
    </div>
  );
}