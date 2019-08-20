export interface CellItem {
  isStart: boolean;
  isLast: boolean;
  isActive: boolean;
  direction?: Direction;
  headDirection?: HeadDirection;
  food?: boolean;
}

export enum Direction {
  leftRight,
  topDown,
  leftDown,
  leftUp,
  rightDown,
  rghtUp
}

export enum HeadDirection {
  right,
  up,
  down,
  left
}

export interface Coordinates {
  x: number;
  y: number;
}

