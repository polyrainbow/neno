import { l } from "../lib/intl";
import ActiveNote from "../types/ActiveNote";

interface NoteKeyValuesProps {
  note: ActiveNote,
  setNote: (note: ActiveNote) => void,
  setUnsavedChanges: (val: boolean) => void,
}

function replaceAt<T>(array: Array<T>, index: number, value: T) {
  const ret = array.slice(0);
  ret[index] = value;
  return ret;
}


const NoteKeyValues = ({
  note,
  setNote,
  setUnsavedChanges,
}: NoteKeyValuesProps) => {
  const displayedKeyValuePairs = note.keyValues;

  const setDisplayedKeyValuePairs = (val: [string, string][]) => {
    setNote({
      ...note,
      keyValues: val,
    });
  };

  const addKeyValuePair = () => {
    setDisplayedKeyValuePairs([...displayedKeyValuePairs, ["", ""]]);
  };

  const removeKeyValuePair = (keyToRemove: string) => {
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
    <h2>{l("note.custom-metadata")}</h2>
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
                // @ts-ignore
                if (e.nativeEvent.data === ":") {
                  e.preventDefault();
                  return;
                }
                changeKey(index, (e.target as HTMLInputElement).value);
                setUnsavedChanges(true);
              }}
            ></input>
            <input
              value={value}
              onInput={(e) => {
                changeValue(
                  index,
                  (e.target as HTMLInputElement).value,
                );
                setUnsavedChanges(true);
              }}
            ></input>
            <button
              className="default-button-small"
              onClick={() => {
                removeKeyValuePair(key);
                setUnsavedChanges(true);
              }}
            >{l("note.custom-metadata.remove")}</button>
          </div>;
        },
      )
    }
    <button
      className="default-button"
      onClick={() => {
        addKeyValuePair();
        setUnsavedChanges(true);
      }}
    >{l("note.custom-metadata.add")}</button>
  </section>;
};

export default NoteKeyValues;
