import React from "react";

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
      type="search"
      placeholder={placeholder}
      value={value}
      onChange={(e) => {onChange(e.target.value);}}
    />
  </>;
};

export default SearchInput;
