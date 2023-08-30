const fs = require("fs");

const {
  Worker,
  isMainThread,
  parentPort,
  threadId,
} = require("worker_threads");

const os = require("os");

const DEFAULT_BLANK_GRID = [
  [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1],
];

function shuffle(arr) {
  if (!Array.isArray(arr)) {
    throw new Error("shuffle expect an array as parameter.");
  }

  var collection = arr,
    len = arr.length,
    rng = Math.random,
    random,
    temp;

  while (len) {
    random = Math.floor(rng() * len);
    len -= 1;
    temp = collection[len];
    collection[len] = collection[random];
    collection[random] = temp;
  }

  return collection;
}

const copy = (grid) => {
  const newGrid = [];
  for (let i = 0; i < grid.length; i++) {
    newGrid.push(grid[i].slice(0));
  }
  return newGrid;
};

const getCellRemovalNodeList = () => {
  return shuffle(
    new Array(9)
      .fill(null)
      .map((_, x) => new Array(9).fill(null).map((_, y) => ({ x, y })))
      .flat()
  );
};

const getAvailableValueSetAtPosition = (gameBoard, x, y) => {
  if (gameBoard[x][y] !== -1) {
    return [];
  }

  const availableValues = [
    false,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ];

  gameBoard[x].forEach((value) => {
    if (value !== -1) {
      availableValues[value] = false;
    }
  });
  gameBoard.forEach((row) => {
    if (row[y] !== -1) {
      availableValues[row[y]] = false;
    }
  });

  let startX = Math.floor(x / 3) * 3;
  const endX = startX + 3;
  let startY = Math.floor(y / 3) * 3;
  const endY = startY + 3;

  while (startX < endX) {
    while (startY < endY) {
      const value = gameBoard[startX][startY];
      if (value !== -1) {
        availableValues[value] = false;
      }
      startY++;
    }

    startY = endY - 3;
    startX++;
  }

  const result = [];
  for (let value = 1; value < availableValues.length; value++) {
    if (availableValues[value]) {
      result.push(value);
    }
  }

  return result;
};

const hasOneUniqueSolution = (grid) => {
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      if (grid[x][y] !== -1) {
        continue;
      }
      const availableValues = getAvailableValueSetAtPosition(grid, x, y);
      if (!availableValues.length) {
        return 0;
      }
      let total = 0;
      for (let availableValue of availableValues) {
        if (total > 1) break;
        const newGrid = copy(grid);
        newGrid[x][y] = availableValue;
        total += hasOneUniqueSolution(newGrid);
      }
      return total;
    }
  }

  return 1;
};

const generateUniqueSolutionPlayableBoardFromValidBoard = (grid, limit) => {
  const cellRemovalList = getCellRemovalNodeList();
  const removedCells = [];

  while (removedCells.length < limit && cellRemovalList.length) {
    const { x, y } = cellRemovalList.pop();
    const temp = grid[x][y];
    grid[x][y] = -1;
    const solutions = hasOneUniqueSolution(grid);
    if (solutions > 1) {
      grid[x][y] = temp;
      continue;
    }
    removedCells.push({ x, y });
  }

  return removedCells;
};

const generateBlanksForLevel = (grid, blankCount) => {
  const blankGrid = copy(DEFAULT_BLANK_GRID);
  let removedCells = [];
  while (removedCells.length < blankCount) {
    removedCells = generateUniqueSolutionPlayableBoardFromValidBoard(
      copy(grid),
      blankCount
    );
  }

  removedCells.forEach(({ x, y }) => {
    blankGrid[x][y] = 0;
  });

  return { grid, blankGrid };
};

const grids = JSON.parse(fs.readFileSync("../src/data/grids.json"));

const getRandomGrid = () => grids[Math.floor(grids.length * Math.random())];

let boards = 0;
const work = (worker, idx) => {
  console.log("starting worker: ", idx);
  worker.postMessage("start");

  worker.on("message", (result) => {
    console.log("reading file...");
    const file = fs.readFileSync("blanks.json");
    const savedBoards = JSON.parse(file);
    console.log("saving new board...");
    fs.writeFileSync("blanks.json", JSON.stringify([...savedBoards, result]));
    console.log("total boards generated: ", boards++);
    console.log("restarting worker: ", idx);
    worker.postMessage("start");
  });
};

let threads = os.cpus().length;

if (isMainThread) {
  const workers = new Array(Number(threads))
    .fill(null)
    .map((_) => new Worker("./generateBlanks.js"));
  workers.forEach(work);
} else {
  parentPort.on("message", () => {
    console.log("generating new board from worker", threadId);
    parentPort.postMessage(generateBlanksForLevel(getRandomGrid(), 60));
    console.log("board generated from worker", threadId);
  });
}
