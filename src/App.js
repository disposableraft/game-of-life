import React, { useState, useEffect, useReducer } from "react";
import matrixMap from "./matrix-map";
import { Matrix } from "./matrix";
import { worker, WebWorker } from "./worker";
import style from "./App.module.css";

const defaultSize = 23;
const defaultSpeed = 350;
const m = new Matrix(defaultSize, "bisected");

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
        // Calculate matrix transformations on another thread.
        const thread = new WebWorker(worker);
        thread.addEventListener("message", (e) => {
          const updatedMatrix = e.data.matrix;
          if (updatedMatrix) {
            dispatch({
              type: "update",
              matrix: updatedMatrix,
            });
          } else {
            setIterating(false);
          }
        });

        thread.postMessage({ matrix: state.matrix });
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

  const toggleItem = (y, x) => {
    state.matrix[y][x] = !state.matrix[y][x];
    dispatch({ type: "update", matrix: state.matrix });
  };

  const selectPattern = (name) => {
    dispatch({ type: "setPattern", pattern: name });
  };

  const selectSize = (s) => {
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
        <select
          value={state.pattern}
          onChange={(e) => {
            selectPattern(e.target.value);
          }}
        >
          <option value="bisected">Bisected</option>
          <option value="hourglass">Hourglass</option>
          <option value="primes">Primes</option>
          <option value="faircoin">Fair Coin</option>
        </select>
        <input
          type="range"
          name="matrix_size"
          min="3"
          max="75"
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
        {matrixMap(state.matrix, (value, rowIndex, colIndex) => {
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
        })}
      </div>
    </div>
  );
};

export default App;
