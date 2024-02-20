
interface SearchInputProps {
  value: string,
  onChange: (val: string) => void,
  placeholder?: string,
  inputStyle?: Record<string, string>,
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
    onChange={(e) => {
      onChange(e.target.value);
    }}
    autoComplete={autoComplete}
  />;
};

export default SearchInput;
