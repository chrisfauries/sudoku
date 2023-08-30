const fs = require('fs');

const {
  Worker,
  isMainThread,
  parentPort,
  threadId,
} = require("worker_threads");

const os = require("os");

const generateBoard = () => {
  let gameBoard = buildGameBoard();
  const BASE_AVAILABLE_VALUES = [
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

  function buildXYList() {
    return new Array(9)
      .fill(null)
      .map((_, x) => new Array(9).fill(null).map((_, y) => ({ x, y })))
      .flat();
  }

  function buildGameBoard() {
    return new Array(9).fill(null).map(() => new Array(9).fill(-1));
  }

  function getAvailableValueSetAtPosition(
    x,
    y,
    used
  ) {
    const availableValues = [...BASE_AVAILABLE_VALUES];

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
  }

  let positionStack = shuffle(buildXYList());
  let consumedStack = [];
  let counter = 0;
  let mul = 1;

  while (positionStack.length) {
    const { x, y, used } = positionStack.pop();
    const availabilityValues = getAvailableValueSetAtPosition(x, y);

    if (
      !availabilityValues.length ||
      used?.length === availabilityValues.length
    ) {
      positionStack.push({ x, y, used: undefined });
      const prev = consumedStack.pop();
      positionStack.push(prev);
      gameBoard[prev.x][prev.y] = -1;
      counter++;
      continue;
    }

    const filteredAvailableValues = availabilityValues.filter(
      (value) => !used?.includes(value),
      []
    );

    const value =
      filteredAvailableValues[
        Math.floor(Math.random() * filteredAvailableValues.length)
      ];

    gameBoard[x][y] = value;

    consumedStack.push({ x, y, used: used ? [...used, value] : [value] });

    if (counter >= 1000000) {
      mul++;
      gameBoard = buildGameBoard();
      positionStack = shuffle(buildXYList());
      consumedStack = [];
      counter = 0;
    }

    counter++;
  }

  return gameBoard;
};

let boards = 0;
const work = (worker, idx) => {
  console.log('starting worker: ', idx);
  worker.postMessage('start');

  worker.on("message", (result) => {
    console.log('reading file...')
    const file = fs.readFileSync('boards.json');
    const savedBoards = JSON.parse(file);
    console.log('saving new board...')
    fs.writeFileSync('boards.json', JSON.stringify([...savedBoards, result]));
    console.log('total boards generated: ',boards++);
    console.log('restarting worker: ', idx);
    worker.postMessage('start');
  });
};

let threads = os.cpus().length;

if (isMainThread) {
  const workers = new Array(Number(threads))
  .fill(null)
  .map((_) => new Worker("./generateBoards.js"));
  workers.forEach(work);
} else {
  parentPort.on("message", () => {
    console.log('generating new board from worker', threadId);
    parentPort.postMessage(generateBoard());
    console.log('board generated from worker', threadId);
  });
}

