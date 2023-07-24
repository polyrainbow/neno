
interface RadioOptionProps {
  key: string,
  groupId: string,
  value: string | number,
  label: string,
  onSelect: any,
  isSelected: boolean,
}


const RadioOption = ({
  groupId,
  value,
  label,
  onSelect,
  isSelected,
}: RadioOptionProps) => {
  const radioInputId = groupId + "_" + value;

  return <div
    className="radio-option"
  >
    <div
      className="radio-option-input-wrapper"
    >
      <input
        id={radioInputId}
        type="radio"
        name={groupId}
        value={value}
        onChange={() => onSelect()}
        checked={isSelected}
      />
    </div>
    <label htmlFor={radioInputId}>
      {label}
    </label>
  </div>;
};


const RadioGroup = ({
  id,
  options,
  selectedValue,
  onChange,
}) => {
  const radioOptions = options.map((option) => {
    return <RadioOption
      key={"radioGroupOption_" + id + "_" + option.value}
      groupId={id}
      value={option.value}
      label={option.label}
      onSelect={() => onChange(option.value)}
      isSelected={selectedValue === option.value}
    />;
  });

  return radioOptions;
};

export default RadioGroup;
