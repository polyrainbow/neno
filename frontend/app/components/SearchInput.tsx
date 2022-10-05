import React from "react";

interface SearchInputProps {
  value: string,
  onChange: any,
  placeholder?: string,
  inputStyle?: any,
  autoComplete?: string,
}

const SearchInput = ({
  value,
  onChange,
  placeholder,
  inputStyle = {},
  autoComplete,
}: SearchInputProps) => {
  return <input
    style={{
      ...inputStyle,
    }}
    id="search-input"
    className="search-input"
    type="search"
    placeholder={placeholder}
    value={value}
    onChange={(e) => {onChange(e.target.value);}}
    autoComplete={autoComplete}
  />;
};

export default SearchInput;
