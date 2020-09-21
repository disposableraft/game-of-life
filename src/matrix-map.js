export default (matrix, callback) => {
  if (!matrix) throw new Error("no matrix, neo");
  return matrix.map((row, rowIndex) => {
    return row.map((value, colIndex) => {
      return callback(value, rowIndex, colIndex);
    });
  });
};
