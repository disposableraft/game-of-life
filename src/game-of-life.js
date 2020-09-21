const matrixMap = (matrix, callback) => {
  return matrix.map((row, rowIndex) => {
    return row.map((value, colIndex) => {
      return callback(value, rowIndex, colIndex);
    });
  });
};

const createNewMatrix = (size) => {
  return Array(size)
    .fill(false)
    .map(() => {
      return Array(size).fill(false);
    });
};

// A matrix bisected by a horizontal line
export const bisectedMatrix = (size) => {
  return matrixMap(createNewMatrix(size), (_value, rowIndex, _colIndex) => {
    if (rowIndex === Math.floor(size / 2)) {
      return true;
    }
    return false;
  });
};

// An hourglass matrix
export const hourglassMatrix = (size) => {
  return matrixMap(createNewMatrix(size), (_value, rowIndex, colIndex) => {
    if (colIndex >= rowIndex && colIndex < size - rowIndex) {
      return false;
    }
    if (rowIndex * 2 > size) {
      const limit = Math.floor(size - rowIndex) - 1;
      if (colIndex >= limit && colIndex < size - limit) {
        return false;
      }
    }
    return true;
  });
};

// Fair coin matrix
export const fairCoinMatrix = (size) => {
  return matrixMap(createNewMatrix(size), (value, rowIndex, colIndex) => {
    return Math.random() > 0.5;
  });
};

// Primes matrix
let primeCounter = 0;

const isPrime = (num) => {
  for (let i = 2, s = Math.sqrt(num); i <= s; i++)
    if (num % i === 0) return false;
  return num > 1;
};

export const primeMatrix = (size) => {
  return matrixMap(createNewMatrix(size), () => {
    primeCounter += 1;
    if (isPrime(primeCounter)) {
      return true;
    }
    return false;
  });
};

export { matrixMap, createNewMatrix };
