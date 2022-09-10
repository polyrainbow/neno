import React from "react";
import ActiveNote from "../interfaces/ActiveNote";

interface NoteKeyValuesProps {
  note: ActiveNote,
  setNote: (ActiveNote) => void,
}

function replaceAt(array, index, value) {
  const ret = array.slice(0);
  ret[index] = value;
  return ret;
}


const NoteKeyValues = ({
  note,
  setNote,
}: NoteKeyValuesProps) => {
  const displayedKeyValuePairs = note.keyValues;

  const setDisplayedKeyValuePairs = (val) => {
    setNote({
      ...note,
      keyValues: val,
    });
  };

  const addKeyValuePair = () => {
    setDisplayedKeyValuePairs([...displayedKeyValuePairs, ["", ""]]);
  };

  const removeKeyValuePair = (keyToRemove) => {
    setDisplayedKeyValuePairs(
      displayedKeyValuePairs.filter(([key]) => key !== keyToRemove),
    );
  };

  const changeValue = (index: number, newValue: string) => {
    const key = displayedKeyValuePairs[index][0];
    setDisplayedKeyValuePairs(
      replaceAt(displayedKeyValuePairs, index, [key, newValue]),
    );
  };


  const changeKey = (index: number, newKey: string) => {
    const value = displayedKeyValuePairs[index][1];
    setDisplayedKeyValuePairs(
      replaceAt(displayedKeyValuePairs, index, [newKey, value]),
    );
  };

  return <section
    className="key-values"
  >
    <h2>Custom metadata</h2>
    {
      displayedKeyValuePairs.map(
        ([key, value], index) => {
          return <div
            className="key-value-row"
            key={"kv_" + index}
          >
            <input
              value={key}
              onInput={(e) => {
                changeKey(index, (e.target as HTMLInputElement).value);
              }}
            ></input>
            <input
              value={value}
              onInput={(e) => changeValue(
                index,
                (e.target as HTMLInputElement).value,
              )}
            ></input>
            <button
              className="default-button-small"
              onClick={() => removeKeyValuePair(key)}
            >Remove</button>
          </div>;
        },
      )
    }
    <button
      className="default-button"
      onClick={() => addKeyValuePair()}
    >Add</button>
  </section>;
};

export default NoteKeyValues;
