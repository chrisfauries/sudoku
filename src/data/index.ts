import { Grid } from "../state/grid";

const GAME_BOARD_SIZE = 9;

export type PlayerInputGrid = Array<Array<PlayerInput>>;

interface PlayerInput {
  value: number;
  center: number[];
  corner: number[];
}

const DEFAULT_BLANK_GRID: Grid = [
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

const DEFAULT_PLAYER_INPUT_GRID: PlayerInputGrid = [
  [
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
  ],
  [
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
  ],
  [
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
  ],
  [
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
  ],
  [
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
  ],
  [
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
  ],
  [
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
  ],
  [
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
  ],
  [
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
    { value: -1, center: [], corner: [] },
  ],
];

const DEFAULT_AVAILABLE_GRID = [
  [[], [], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], [], []],
];

export {
  DEFAULT_BLANK_GRID,
  GAME_BOARD_SIZE,
  DEFAULT_PLAYER_INPUT_GRID,
  DEFAULT_AVAILABLE_GRID,
};
