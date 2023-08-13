import { l } from "../lib/intl";

interface NoteSlugUpdateReferencesToggleProps {
  isActivated: boolean;
  setIsActivated: (isActivated: boolean) => void;
}


const NoteSlugUpdateReferencesToggle = ({
  isActivated,
  setIsActivated,
}: NoteSlugUpdateReferencesToggleProps) => {
  return <div className="update-references-toggle">
    <label className="switch">
      <input
        type="checkbox"
        checked={isActivated}
        onChange={(e) => setIsActivated(e.target.checked)}
      />
      <span className="slider round"></span>
    </label>
    <span className="update-references-toggle-text">
      {l("note.slug.update-references")}
    </span>
  </div>;
};

export default NoteSlugUpdateReferencesToggle;
