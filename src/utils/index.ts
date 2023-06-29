export const getColumnIndex = (columnLabel: string) => {
  const BASE = 26;
  const A_CHAR_CODE = "A".charCodeAt(0);
  let index = 0;

  for (let i = 0; i < columnLabel.length; i++) {
    index = index * BASE + columnLabel.charCodeAt(i) - A_CHAR_CODE + 1;
  }

  return index - 1;
};

export const getColumnLabel = (columnIndex: number) => {
  const BASE = 26;
  const A_CHAR_CODE = "A".charCodeAt(0);
  let label = "";

  while (columnIndex >= 0) {
    label = String.fromCharCode(A_CHAR_CODE + (columnIndex % BASE)) + label;
    columnIndex = Math.floor(columnIndex / BASE) - 1;
  }

  return label;
};

export const parseValueReference = (reference: string) => {
  const regex = /([A-Z]+)(\d+)/;
  const match = reference.match(regex);

  if (match) {
    const column = match[1];
    const row = Number(match[2]) - 1;
    return [column, row];
  }

  return ["", ""];
};

export const extractValueReferences = (expression: string) => {
  const regex = /([A-Z]+\d+)/g;
  return expression.match(regex) || [];
};
