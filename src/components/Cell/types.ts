import { ChangeEvent } from "react";

export enum CellState {
  NORMAL = "normal",
  ERROR = "error",
}

export interface ICell {
  state: CellState;
  value: string;
  isDisabled: boolean;
  onCellChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onCellBlur: () => void;
}
