import matrixMap from "./matrix-map";

export enum Patterns {
  BISECTED = "BISECTED",
  HOURGLASS = "HOURGLASS",
  PRIMES = "PRIMES",
  FAIRCOIN = "FAIRCOIN",
}

interface State {
  matrix: Array<boolean[]>;
  pattern: Patterns;
  size: number;
  type?: string;
}

type Action =
  | { type: "update"; matrix: Array<boolean[]> }
  | { type: "resize"; size: number }
  | { type: "setPattern"; pattern: Patterns }
  | { type: "reset" };

class Matrix {
  size: number;
  pattern: Patterns;
  matrix: Array<boolean[]>;

  /**
   * Create and manage game state.
   * @param size The dimension of the square matrix.
   * @param pattern The default pattern, one of `enum Patterns`.
   */
  constructor(size: number, pattern: Patterns) {
    this.matrix = [];
    this.size = size;
    this.pattern = pattern;
    // initialize the matrix
    this.apply(this.pattern);
  }

  /**
   * A reducer compatible with `useReducer`.
   */
  reducer = (_state: State, action: Action): State => {
    switch (action.type) {
      case "update":
        this.matrix = action.matrix;
        return { matrix: this.matrix, pattern: this.pattern, size: this.size };

      case "resize":
        this.resize(action.size);
        return { matrix: this.matrix, pattern: this.pattern, size: this.size };

      case "setPattern":
        this.apply(action.pattern);
        return { matrix: this.matrix, pattern: this.pattern, size: this.size };

      case "reset":
        this.apply(this.pattern);
        return { matrix: this.matrix, pattern: this.pattern, size: this.size };

      default:
        throw new Error("uh-oh");
    }
  };

  /**
   * Resize the matrix while retaining the pattern.
   */
  resize = (newSize: number): void => {
    this.size = newSize;
    this.apply(this.pattern);
  };

  /**
   * Return a new array of `this.size` filled with `false` values.
   */
  newEmpty = () => {
    return Array(this.size)
      .fill([])
      .map(() => {
        return Array(this.size).fill(false);
      });
  };

  /**
   * Apply a pattern to the matrix.
   */
  apply = (pattern: Patterns): void => {
    this.pattern = pattern;

    switch (pattern) {
      case "BISECTED":
        this.bisected();
        break;
      case "HOURGLASS":
        this.hourglass();
        break;
      case "PRIMES":
        this.primes();
        break;
      case "FAIRCOIN":
        this.faircoin();
        break;
      default:
        throw new Error(`${pattern} does not exist`);
    }
  };

  bisected = (): void => {
    this.matrix = matrixMap(
      this.newEmpty(),
      (_value: number, rowIndex: number) => {
        if (rowIndex === Math.floor(this.size / 2)) {
          return true;
        }
        return false;
      }
    );
  };

  hourglass = () => {
    this.matrix = matrixMap(
      this.newEmpty(),
      (_value: number, rowIndex: number, colIndex: number) => {
        if (colIndex >= rowIndex && colIndex < this.size - rowIndex) {
          return false;
        }
        if (rowIndex * 2 > this.size) {
          const limit = Math.floor(this.size - rowIndex) - 1;
          if (colIndex >= limit && colIndex < this.size - limit) {
            return false;
          }
        }
        return true;
      }
    );
  };

  primes = () => {
    let primeCounter = 0;
    this.matrix = matrixMap(this.newEmpty(), () => {
      primeCounter += 1;
      if (isPrime(primeCounter)) {
        return true;
      }
      return false;
    });
  };

  faircoin = () => {
    this.matrix = matrixMap(this.newEmpty(), () => {
      return Math.random() > 0.5;
    });
  };
}

const isPrime = (num: number): boolean => {
  for (let i = 2, s = Math.sqrt(num); i <= s; i++)
    if (num % i === 0) return false;
  return num > 1;
};

export { Matrix };
