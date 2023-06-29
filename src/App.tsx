import { useMemo, useState } from "react";
import moment from "moment-timezone";

import Cell from "components/Cell";
import Button from "components/Button";
import { ButtonType } from "components/Button/types";
import { CellState } from "components/Cell/types";
import { extractValueReferences, getColumnIndex, getColumnLabel, parseValueReference } from "utils";
import { getStatus, saveCSV } from "repositories/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

import { ISaveResponse } from "types";
import Spinner from "components/Spinner";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./App.scss";

function App() {
  const [rowCount, setRowCount] = useState<number>(8);
  const [colCount, setColCount] = useState<number>(8);
  const [isSaving, setSaving] = useState<boolean>(false);

  const [spreadsheetData, setSpreadsheetData] = useState<Array<Array<string>>>(
    Array.from({ length: rowCount }, () => Array.from({ length: colCount }, () => ""))
  );

  const [state, setState] = useState<Array<Array<CellState>>>(
    Array.from({ length: rowCount }, () => Array.from({ length: colCount }, () => CellState.NORMAL))
  );

  const headerRow = useMemo(
    () => Array.from({ length: colCount }, (_, colIndex) => getColumnLabel(colIndex)),
    [colCount]
  );

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    let updatedValue = value;
    if (value.toString().endsWith("%")) {
      updatedValue = (parseFloat(value) / 100).toFixed(2);
    }
    const updatedData: Array<Array<string>> = [...spreadsheetData];
    updatedData[rowIndex][colIndex] = updatedValue;
    setSpreadsheetData(updatedData);
  };

  const updateState = (rowIndex: number, colIndex: number, value: CellState) => {
    const updatedData: Array<Array<CellState>> = [...state];
    updatedData[rowIndex][colIndex] = value;
    setState(updatedData);
  };

  const handleCellBlur = (rowIndex: number, colIndex: number) => {
    const formula = spreadsheetData[rowIndex][colIndex].toString();
    const evaluatedValue = evaluateFormula(formula);

    if (!isNaN(evaluatedValue)) {
      handleCellChange(rowIndex, colIndex, evaluatedValue);
      updateState(rowIndex, colIndex, CellState.NORMAL);
    } else {
      updateState(rowIndex, colIndex, CellState.ERROR);
    }
  };

  const evaluateFormula = (formula: string) => {
    if (formula.startsWith("=")) {
      const expression = formula.substring(1);
      const references: string[] = extractValueReferences(expression);

      const evaluatedExpression = references.reduce((expr: string, reference: string) => {
        const [refColumn, refRow] = parseValueReference(reference);
        const refValue = spreadsheetData[Number(refRow)][getColumnIndex(refColumn as string)];
        return expr.replace(reference, refValue);
      }, expression);

      try {
        return eval(evaluatedExpression);
      } catch (err) {
        return NaN;
      }
    } else {
      return formula;
    }
  };

  const handleAddEvent = (type: ButtonType) => {
    if (type === ButtonType.COLUMN) {
      setRowCount((prev) => prev + 1);
      setSpreadsheetData((prevData) => [...prevData, Array.from({ length: colCount }, () => "")]);
      setState((prevState) => [...prevState, Array.from({ length: colCount }, () => CellState.NORMAL)]);
    } else {
      setColCount((prev) => prev + 1);
      setSpreadsheetData((prevData) => prevData.map((row) => [...row, ""]));
      setState((prevState) => prevState.map((row) => [...row, CellState.NORMAL]));
    }
  };

  const saveSpreadsheetData = async () => {
    const csvContent = spreadsheetData
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    setSaving(true);
    const toastLoading = toast.loading("Saving in progress!", {
      autoClose: false,
    });
    await saveCSV(csvContent)
      .then(({ data }: { data: ISaveResponse }) => {
        if (data.status !== "DONE") {
          const doneAtTime = moment.utc(data.done_at).add(1, "second");
          const currentTime = moment.utc();

          const timeDifference = doneAtTime.diff(currentTime);
          toast.update(toastLoading, {
            autoClose: timeDifference,
          });
          if (timeDifference > 0) {
            setTimeout(async () => {
              await getStatus(data.id)
                .then(({ data }) => {
                  if (data.status === "DONE") {
                    toast.dismiss(toastLoading);
                    toast.success("Saving completed!", { autoClose: 1000 });
                  }
                  setSaving(false);
                })
                .catch(() => {
                  setSaving(false);
                  toast.dismiss(toastLoading);
                  toast.error("Data not saved.", { autoClose: 1000 });
                });
            }, timeDifference);
          }
        } else {
          setSaving(false);
          toast.dismiss(toastLoading);
          toast.success("Saving completed!", { autoClose: 1000 });
        }
      })
      .catch(() => {
        setSaving(false);
        toast.dismiss(toastLoading);
        toast.error("Data not saved.", { autoClose: 1000 });
      });
  };

  return (
    <div className="App">
      <div className="container">
        <div className="header">
          <h1>Your Personal Staking Calculator</h1>
          <button className={`save-btn ${`disabled-${isSaving}`}`} onClick={saveSpreadsheetData} disabled={isSaving}>
            {isSaving ? <Spinner /> : <FontAwesomeIcon icon={faSave} size="lg" />}
          </button>
        </div>
        <div className="spreadsheet-container">
          <div className="spreadsheet">
            <div className="spreadsheet-header">
              {headerRow.map((header, headerIndex) => (
                <div key={headerIndex}>{header}</div>
              ))}
            </div>
            <div className="spreadsheet-body">
              {spreadsheetData.map((row, rowIndex) => (
                <div className="spreadsheet-row" key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <Cell
                      key={`cell-${rowIndex}-${colIndex} `}
                      state={state[rowIndex][colIndex]}
                      value={cell}
                      onCellChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                      onCellBlur={() => handleCellBlur(rowIndex, colIndex)}
                      isDisabled={isSaving}
                    />
                  ))}
                </div>
              ))}
            </div>
            <Button type={ButtonType.COLUMN} onClick={handleAddEvent} isDisabled={isSaving} />
          </div>
          <Button type={ButtonType.ROW} onClick={handleAddEvent} isDisabled={isSaving} />
        </div>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
}

export default App;
