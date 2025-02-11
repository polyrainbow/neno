import { l } from "../lib/intl";
import NoteListItemFeaturesType
  from "../lib/notes/types/NoteListItemFeatures";
import Icon from "./Icon";

const NoteListItemFeatures = ({
  features,
}: {
  features: NoteListItemFeaturesType,
}) => {
  const labels = [];
  if (features.containsWeblink) {
    labels.push(l("list.item.features.contains-links"));
  }
  if (features.containsCode) {
    labels.push(l("list.item.features.contains-code"));
  }
  if (features.containsImages) {
    labels.push(l("list.item.features.contains-images"));
  }
  if (features.containsDocuments) {
    labels.push(l("list.item.features.contains-documents"));
  }
  if (features.containsAudio) {
    labels.push(l("list.item.features.contains-audio"));
  }
  if (features.containsVideo) {
    labels.push(l("list.item.features.contains-video"));
  }

  return <span
    className="note-features"
    aria-label={labels.join(", ")}
  >
    {
      features.containsWeblink
        ? <Icon
          icon="public"
        />
        : null
    }
    {
      features.containsCode
        ? <Icon
          icon="code"
        />
        : null
    }
    {
      features.containsImages
        ? <Icon
          icon="image"
        />
        : null
    }
    {
      features.containsDocuments
        ? <Icon
          icon="note"
        />
        : null
    }
    {
      features.containsAudio
        ? <Icon
          icon="headphones"
        />
        : null
    }
    {
      features.containsVideo
        ? <Icon
          icon="movie"
        />
        : null
    }
  </span>;
};

export default NoteListItemFeatures;
