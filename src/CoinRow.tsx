import {
  useEffect,
  useRef,
  useState,
  useCallback,
  memo,
} from "react";

import { Coin } from "./App";

type CoinRowProps = {
  coin: Coin;
  onUpdate: (name: string) => void;
  onDelete: (name: string) => void;
};

export const CoinRow = memo(function CoinRow({
    coin,
    onUpdate,
    onDelete,
  }: CoinRowProps) {
    // console.log("render", coin.name);

    return (
      <div>
        {coin.name} {coin.price ?? "-"}

        {coin.change === "up" && " ↑"}
        {coin.change === "down" && " ↓"}

        <button onClick={() => onUpdate(coin.name)}>
          Update
        </button>

        <button onClick={() => onDelete(coin.name)}>
          Delete
        </button>
      </div>
    );
});