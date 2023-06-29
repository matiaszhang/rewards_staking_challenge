import { FC } from "react";
import { IButton } from "./types";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./button.scss";

const Button: FC<IButton> = ({ type, isDisabled, onClick }) => {
  return (
    <button
      type="button"
      className={`btn btn-${type} ${`disabled-${isDisabled}`}`}
      onClick={() => onClick(type)}
      disabled={isDisabled}
    >
      <FontAwesomeIcon icon={faPlus} size="sm" />
    </button>
  );
};

export default Button;
