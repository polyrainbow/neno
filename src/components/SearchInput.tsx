
interface SearchInputProps {
  value: string,
  onChange: (val: string) => void,
  placeholder?: string,
  autoComplete?: string,
}

const SearchInput = ({
  value,
  onChange,
  placeholder,
  autoComplete,
}: SearchInputProps) => {
  return <input
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
