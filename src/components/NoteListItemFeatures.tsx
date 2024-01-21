import Tooltip from "./Tooltip";
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
        ? <Tooltip
          title={l("list.item.features.contains-links")}>
          <Icon
            icon="public"
            title={l("list.item.features.contains-links")}
            size={ICON_SIZE}
          />
        </Tooltip>
        : null
    }
    {
      features.containsCode
        ? <Tooltip
          title={l("list.item.features.contains-code")}>
          <Icon
            icon="code"
            title={l("list.item.features.contains-code")}
            size={ICON_SIZE}
          />
        </Tooltip>
        : null
    }
    {
      features.containsImages
        ? <Tooltip
          title={l("list.item.features.contains-images")}>
          <Icon
            icon="image"
            title={l("list.item.features.contains-images")}
            size={ICON_SIZE}
          />
        </Tooltip>
        : null
    }
    {
      features.containsDocuments
        ? <Tooltip
          title={l("list.item.features.contains-documents")}>
          <Icon
            icon="note"
            title={l("list.item.features.contains-documents")}
            size={ICON_SIZE}
          />
        </Tooltip>
        : null
    }
    {
      features.containsAudio
        ? <Tooltip
          title={l("list.item.features.contains-audio")}>
          <Icon
            icon="headphones"
            title={l("list.item.features.contains-audio")}
            size={ICON_SIZE}
          />
        </Tooltip>
        : null
    }
    {
      features.containsVideo
        ? <Tooltip
          title={l("list.item.features.contains-video")}>
          <Icon
            icon="movie"
            title={l("list.item.features.contains-video")}
            size={ICON_SIZE}
          />
        </Tooltip>
        : null
    }
  </span>;
};

export default NoteListItemFeatures;
