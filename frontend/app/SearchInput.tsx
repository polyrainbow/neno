import React from "react";
import IconButton from "./IconButton.js";

interface SearchInputProps {
  value: string,
  onChange: any,
  label?: string,
  placeholder?: string,
  inputStyle?: any,
}

const SearchInput = ({
  value,
  onChange,
  label,
  placeholder,
  inputStyle = {},
}:SearchInputProps) => {
  return <>
    {
      label
        ? <label
          htmlFor="search-input"
          style={{
            marginRight: "5px",
          }}
        >{label}</label>
        : null
    }
    <input
      style={{
        ...inputStyle,
      }}
      id="search-input"
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => {onChange(e.target.value);}}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          onChange("");
        }
      }}
    />
    <IconButton
      title="Clear search"
      icon={
        value.length > 0
          ? "cancel"
          : "cancel_disabled"
      }
      onClick={() => onChange("")}
      disabled={value.length === 0}
    />
  </>;
};

export default SearchInput;
