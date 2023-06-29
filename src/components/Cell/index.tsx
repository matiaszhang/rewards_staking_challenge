import { FC, ChangeEvent, KeyboardEvent } from "react";
import { ICell } from "./types";

import "./cell.scss";

const Cell: FC<ICell> = ({ state, value, isDisabled, onCellBlur, onCellChange }) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onCellBlur();
    }
  };

  return (
    <input
      type="text"
      className={`cell cell-${state} ${`disabled-${isDisabled}`}`}
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onCellChange(e)}
      onBlur={onCellBlur}
      onKeyDown={handleKeyDown}
      disabled={isDisabled}
    />
  );
};

export default Cell;
