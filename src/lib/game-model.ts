import { useEffect, useRef, useState } from "react";

let __uid = 1;
const getUniqueId = () => __uid++;

/*
 * This model is a bit unusual, because we're going to need a
 * graph so that the solve algorithm can be performant, but
 * React would prefer to have things immutable and normalized. I call
 * this the Mullet Pattern. React in the front, OOP in the back. The hook
 * facilitates the transation of the two, while the model implements an observer
 * pattern so that react can be updated.
 */

class Game {
  // key is a stringified index pair, e.g. "-3,5"
  cells: Map<string, Cell> = new Map();
  dominos: Domino[] = [];
  constraints: Constraint[] = [];

  subscribe(fn: (data: GameData) => void) {
    throw "TODO";
  }

  publish() {
    throw "TODO";
  }

  toGameData(): GameData {
    throw "TODO";
  }
}

class Domino {
  placement: { left: Cell; right: Cell } | null = null;
  id: number;
  left: number;
  right: number;

  constructor(leftValue: number, rightValue: number) {
    if (leftValue < 0 || leftValue > 6 || rightValue < 0 || rightValue > 6) {
      throw new Error(`Domino values must be between 0 and 6`);
    }

    // Make sure the left value is always first to normalize identical solutions
    if (leftValue > rightValue) {
      [leftValue, rightValue] = [rightValue, leftValue];
    }

    this.left = leftValue;
    this.right = rightValue;
    this.id = getUniqueId();
  }

  isPlaced() {
    return this.placement !== null;
  }
}

class Cell {
  row: number;
  col: number;
  contents: {
    domino: Domino;
    side: "left" | "right";
  } | null = null;

  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
  }
}

type ConstraintRule =
  | { type: "not-equal" }
  | { type: "equal" }
  | { type: "sum-equal"; value: number }
  | { type: "sum-less-than"; value: number }
  | { type: "sum-greater-than"; value: number };

class Constraint {
  id: number;
  color: string;
  rule: ConstraintRule;
  cells: Cell[];

  constructor(color: string, rule: ConstraintRule, cells: Cell[]) {
    this.color = color;
    this.rule = rule;
    this.cells = cells;
    this.id = getUniqueId();
  }

  // If all cells are occupied, this tells us if the constraint is satisfied
  // otherwise, it tells us whether it still *can* be satisfied
  satisfied() {
    throw "TODO";
  }
}

type GameData = {
  cells: { row: number; col: number }[];
  freeDominos: { id: number; left: number; right: number }[];
  placedDominos: {
    id: number;
    cell: { row: number; col: number };
    left: number;
    right: number;
    anchor: "left" | "right";
    rotation: 0 | 1 | 2 | 3;
  }[];
  constraints: {
    color: string;
    rule: ConstraintRule;
    cells: { row: number; col: number }[];
  }[];
};

type GameActions = {
  addCell: (row: number, col: number) => void;
  removeCell: (row: number, col: number) => void;
  createDomino: (left: number, right: number) => number;
  deleteDomino: (id: number) => void;
  addConstraint: (
    color: string,
    rule: ConstraintRule,
    cells: { row: number; col: number }[]
  ) => number;
  deleteConstraint: (id: number) => void;
  solve: () => void;
};

const useGame = (): GameData & GameActions => {
  const gameRef = useRef(new Game());
  const [gameData, setGameData] = useState(gameRef.current.toGameData());

  useEffect(() => {
    // TODO: Load from localstorage
  }, []);

  useEffect(() => {
    gameRef.current.subscribe((data) => {
      setGameData(data);
    });
  }, []);

  // Set up actions and merge with data
  throw "TODO";
};
