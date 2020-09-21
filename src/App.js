import React, { useState, useEffect } from "react";
import {
  matrixMap,
  bisectedMatrix,
  hourglassMatrix,
  primeMatrix,
  fairCoinMatrix,
} from "./game-of-life";
import worker from "./worker";
import WebWorker from "./workerSetup";
import style from "./App.module.css";

const defaultSize = 23;
const defaultSpeed = 300;

const App = () => {
  const [size, setSize] = useState(defaultSize);
  const [matrixName, setMatrixname] = useState("bisected");
  const [matrix, setMatrix] = useState(bisectedMatrix(defaultSize));
  const [iterating, setIterating] = useState(false);

  useEffect(() => {
    if (iterating) {
      const timer = setInterval(() => {
        // Calculate matrix transformations on another thread.
        const thread = new WebWorker(worker);
        thread.addEventListener("message", (e) => {
          const updatedMatrix = e.data.matrix;
          if (updatedMatrix) {
            setMatrix(updatedMatrix);
          } else {
            setIterating(false);
          }
        });

        thread.postMessage({ matrix: matrix });
      }, defaultSpeed);

      return () => {
        clearInterval(timer);
      };
    }
  }, [iterating, matrix]);

  const toggleIterate = () => {
    setIterating(!iterating);
  };

  const reset = () => {
    setMatrix(bisectedMatrix(size));
    setIterating(false);
  };

  const toggleItem = (y, x) => {
    setMatrix((matrix) => {
      return matrixMap(matrix, (value, rowIndex, colIndex) => {
        if (rowIndex === y && colIndex === x) {
          return !value;
        }
        return value;
      });
    });
  };

  const selectMatrix = (name) => {
    const matrixStyles = {
      bisected: bisectedMatrix(size),
      hourglass: hourglassMatrix(size),
      primes: primeMatrix(size),
      faircoin: fairCoinMatrix(size),
    };
    setMatrixname(name);
    setMatrix(matrixStyles[name]);
  };

  const selectSize = (s) => {
    const newSize = Number(s);
    setMatrix(bisectedMatrix(newSize));
    setSize(newSize);
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
          value={matrixName}
          onChange={(e) => {
            selectMatrix(e.target.value);
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
          min="12"
          max="75"
          step="1"
          value={size}
          onChange={(e) => {
            selectSize(e.target.value);
          }}
        />
      </div>
      <div
        className={style.grid}
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
        }}
      >
        {matrixMap(matrix, (value, rowIndex, colIndex) => {
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={value ? style.activeItem : style.inactiveItem}
              style={{
                height: `${75 / size}vh`,
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
