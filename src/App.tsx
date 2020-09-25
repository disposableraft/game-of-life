import React, { useState, useEffect, useReducer } from "react";
import matrixMap from "./matrix-map";
import { Matrix, Patterns } from "./matrix";
import style from "./App.module.css";

const defaultSize = 23;
const defaultSpeed = 350;

const m = new Matrix(defaultSize, Patterns.BISECTED);

const worker: Worker = new Worker(
  `${process.env.PUBLIC_URL}/workers/update-matrix.js`
);

const App = () => {
  const [state, dispatch] = useReducer(m.reducer, {
    matrix: m.matrix,
    pattern: m.pattern,
    size: m.size,
  });
  const [iterating, setIterating] = useState(false);

  useEffect(() => {
    if (iterating) {
      const timer = setInterval(() => {
        worker.onmessage = (event: MessageEvent) => {
          const updatedMatrix = event.data.matrix;
          if (updatedMatrix) {
            dispatch({
              type: "update",
              matrix: updatedMatrix,
            });
          } else {
            setIterating(false);
          }
        };

        worker.postMessage({ message: "update", matrix: state.matrix });
      }, defaultSpeed);

      return () => {
        clearInterval(timer);
      };
    }
  });

  const toggleIterate = () => {
    setIterating(!iterating);
  };

  const reset = () => {
    dispatch({ type: "reset" });
    setIterating(false);
  };

  const toggleItem = (y: number, x: number) => {
    state.matrix[y][x] = !state.matrix[y][x];
    dispatch({ type: "update", matrix: state.matrix });
  };

  const selectPattern = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const pattern = event.target.value as Patterns;
    dispatch({ type: "setPattern", pattern: pattern });
  };

  const selectSize = (s: string) => {
    dispatch({ type: "resize", size: Number(s) });
  };

  return (
    <div className={style.container}>
      <div className={style.controls}>
        <button
          onClick={() => {
            toggleIterate();
          }}
        >
          {iterating ? "Stop" : "Start"}
        </button>
        <button onClick={() => reset()}>Reset</button>
        <select value={state.pattern} onChange={selectPattern}>
          <option value="BISECTED">Bisected</option>
          <option value="HOURGLASS">Hourglass</option>
          <option value="PRIMES">Primes</option>
          <option value="FAIRCOIN">Fair Coin</option>
        </select>
        <input
          type="range"
          name="matrix_size"
          min="3"
          max="200"
          step="1"
          value={state.size}
          onChange={(e) => {
            selectSize(e.target.value);
          }}
        />
      </div>
      <div
        className={style.grid}
        style={{
          gridTemplateColumns: `repeat(${state.size}, 1fr)`,
        }}
      >
        {matrixMap(
          state.matrix,
          (value: boolean, rowIndex: number, colIndex: number) => {
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={value ? style.activeItem : style.inactiveItem}
                style={{
                  height: `${75 / state.size}vh`,
                }}
                onClick={() => {
                  toggleItem(rowIndex, colIndex);
                }}
              ></div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default App;
