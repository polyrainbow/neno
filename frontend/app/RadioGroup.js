import React from "react";

const RadioOption = ({
  groupId,
  value,
  label,
  onSelect,
  isSelected,
}) => {
  const radioInputId = groupId + "_" + value;

  return <div
    style={{
      "display": "flex",
      "alignItems": "center",
      "marginBottom": "15px",
    }}
  >
    <div
      style={{
        "width": "24px",
        "height": "24px",
        "marginRight": "10px",
      }}
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
