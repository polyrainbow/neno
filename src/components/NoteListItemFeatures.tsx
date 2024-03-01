import { l } from "../lib/intl";
import NoteListItemFeaturesType
  from "../lib/notes/types/NoteListItemFeatures";
import Icon from "./Icon";

const ICON_SIZE = 15;

const NoteListItemFeatures = ({
  features,
}: {
  features: NoteListItemFeaturesType,
}) => {
  return <span
    className="note-features"
  >
    {
      features.containsWeblink
        ? <Icon
          icon="public"
          title={l("list.item.features.contains-links")}
          size={ICON_SIZE}
        />
        : null
    }
    {
      features.containsCode
        ? <Icon
          icon="code"
          title={l("list.item.features.contains-code")}
          size={ICON_SIZE}
        />
        : null
    }
    {
      features.containsImages
        ? <Icon
          icon="image"
          title={l("list.item.features.contains-images")}
          size={ICON_SIZE}
        />
        : null
    }
    {
      features.containsDocuments
        ? <Icon
          icon="note"
          title={l("list.item.features.contains-documents")}
          size={ICON_SIZE}
        />
        : null
    }
    {
      features.containsAudio
        ? <Icon
          icon="headphones"
          title={l("list.item.features.contains-audio")}
          size={ICON_SIZE}
        />
        : null
    }
    {
      features.containsVideo
        ? <Icon
          icon="movie"
          title={l("list.item.features.contains-video")}
          size={ICON_SIZE}
        />
        : null
    }
  </span>;
};

export default NoteListItemFeatures;
