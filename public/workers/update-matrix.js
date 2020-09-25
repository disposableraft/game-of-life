this.onmessage = async (event) => {
  console.log("event", event);
  if (event && event.data && event.data.message === "update") {
    let updatedMatrix = false;
    const data = event.data;
    const newMatrix = update(data.matrix);

    if (!compare(data.matrix, newMatrix)) {
      updatedMatrix = newMatrix;
    }

    this.postMessage({ matrix: updatedMatrix });
  }
};

function countNeighbors(matrix, x, y) {
  let neighbors = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      if (i === 0 && j === 0) continue;
      if (matrix[x + i]?.[y + j]) {
        neighbors += 1;
      }
    }
  }
  return neighbors;
}

function update(matrix) {
  return matrix.map((rows, x) => {
    return rows.map((alive, y) => {
      const neighborCount = countNeighbors(matrix, x, y);
      // Any live cell with fewer than two live neighbours dies
      if (alive && neighborCount < 2) {
        return false;
      }
      // Any live cell with two or three live neighbours lives
      if (alive && (neighborCount === 2 || neighborCount === 3)) {
        return true;
      }
      // Any live cell with more than three live neighbours dies
      if (alive && neighborCount > 3) {
        return false;
      }
      // Any dead cell with exactly three live neighbours becomes a live cell
      if (!alive && neighborCount === 3) {
        return true;
      }
      return false;
    });
  });
}

function compare(arr1, arr2) {
  // No length checks because arrays are always square.
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr1[i].length; j++) {
      if (arr1[i][j] !== arr2[i][j]) {
        return false;
      }
    }
  }
  return true;
}
