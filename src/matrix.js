import matrixMap from "./matrix-map";

class Matrix {
  constructor(size, pattern) {
    this.size = size;
    this.pattern = pattern;
    // initialize the matrix
    this[this.pattern]();
  }

  reducer = (state, action) => {
    switch (action.type) {
      case "update":
        this.matrix = action.matrix;
        return { matrix: this.matrix, pattern: this.pattern, size: this.size };

      case "resize":
        this.resize(action.size);
        return { matrix: this.matrix, pattern: this.pattern, size: this.size };

      case "setPattern":
        this[action.pattern]();
        return { matrix: this.matrix, pattern: this.pattern, size: this.size };

      case "reset":
        this[this.pattern]();
        return { matrix: this.matrix, pattern: this.pattern, size: this.size };

      default:
        throw new Error("uh-oh");
    }
  };

  resize = (newSize) => {
    this.size = newSize;
    this[this.pattern]();
    console.debug(`resizing`);
  };

  bisected = () => {
    this.pattern = "bisected";
    this.matrix = matrixMap(this.newEmpty(), (_value, rowIndex) => {
      if (rowIndex === Math.floor(this.size / 2)) {
        return true;
      }
      return false;
    });
  };

  hourglass = () => {
    this.pattern = "hourglass";
    this.matrix = matrixMap(this.newEmpty(), (_value, rowIndex, colIndex) => {
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
    });
  };

  primes = () => {
    let primeCounter = 0;
    this.pattern = "primes";
    this.matrix = matrixMap(this.newEmpty(), () => {
      primeCounter += 1;
      if (isPrime(primeCounter)) {
        return true;
      }
      return false;
    });
  };

  faircoin = () => {
    this.pattern = "faircoin";
    this.matrix = matrixMap(this.newEmpty(), () => {
      return Math.random() > 0.5;
    });
  };

  newEmpty = () => {
    return Array(this.size)
      .fill([])
      .map(() => {
        return Array(this.size).fill(false);
      });
  };
}

const isPrime = (num) => {
  for (let i = 2, s = Math.sqrt(num); i <= s; i++)
    if (num % i === 0) return false;
  return num > 1;
};

export { Matrix };
