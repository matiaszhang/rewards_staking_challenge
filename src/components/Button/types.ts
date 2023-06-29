export interface IButton {
  type: ButtonType;
  isDisabled?: boolean;
  isLoading?: boolean;
  onClick: (type: ButtonType) => void;
}

export enum ButtonType {
  COLUMN = "column",
  ROW = "row",
}
