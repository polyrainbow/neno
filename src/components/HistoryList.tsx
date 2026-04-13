import { useState, useCallback } from "react";
import { l, getActiveLanguage } from "../lib/intl";
import {
  CommitInfo,
  FileDiff,
} from "../lib/notes-worker/NotesProviderProxy";
import useNotesProvider from "../hooks/useNotesProvider";
import CommitDiff from "./CommitDiff";
import BusyIndicator from "./BusyIndicator";

interface HistoryListProps {
  commits: CommitInfo[];
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
}

interface DiffState {
  loading: boolean;
  files?: FileDiff[];
  error?: string;
}

const formatRelativeTime = (
  epochSeconds: number,
  locale: string,
): string => {
  const nowSeconds = Date.now() / 1000;
  const diff = epochSeconds - nowSeconds;
  const abs = Math.abs(diff);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (abs < 60) {
    return rtf.format(Math.round(diff), "second");
  }
  if (abs < 3600) {
    return rtf.format(Math.round(diff / 60), "minute");
  }
  if (abs < 86400) {
    return rtf.format(Math.round(diff / 3600), "hour");
  }
  if (abs < 86400 * 7) {
    return rtf.format(Math.round(diff / 86400), "day");
  }
  return new Date(epochSeconds * 1000).toLocaleDateString(locale);
};

const splitMessage = (message: string): { subject: string; body: string } => {
  const trimmed = message.trim();
  const newlineIndex = trimmed.indexOf("\n");
  if (newlineIndex === -1) {
    return { subject: trimmed, body: "" };
  }
  return {
    subject: trimmed.slice(0, newlineIndex),
    body: trimmed.slice(newlineIndex + 1).trim(),
  };
};

const HistoryList = ({
  commits,
  hasMore,
  isLoadingMore,
  onLoadMore,
}: HistoryListProps) => {
  const locale = getActiveLanguage();
  const notesProvider = useNotesProvider();
  const [diffs, setDiffs] = useState<Record<string, DiffState>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleDiff = useCallback(async (oid: string) => {
    const isOpen = expanded[oid];
    setExpanded((prev) => ({ ...prev, [oid]: !isOpen }));

    if (isOpen) return;
    if (diffs[oid]?.files || diffs[oid]?.loading) return;

    setDiffs((prev) => ({ ...prev, [oid]: { loading: true } }));
    try {
      const files = await notesProvider.getCommitDiff(oid);
      setDiffs((prev) => ({ ...prev, [oid]: { loading: false, files } }));
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setDiffs((prev) => ({
        ...prev,
        [oid]: { loading: false, error: message },
      }));
    }
  }, [notesProvider, diffs, expanded]);

  if (commits.length === 0) {
    return <p>{l("history.empty")}</p>;
  }

  return <div className="history-list">
    {commits.map((commit) => {
      const { subject, body } = splitMessage(commit.message);
      const isExpanded = !!expanded[commit.oid];
      const diffState = diffs[commit.oid];
      return <article className="history-commit" key={commit.oid}>
        <header className="history-commit-header">
          <code className="history-commit-oid">
            {commit.oid.slice(0, 7)}
          </code>
          <span className="history-commit-subject">{subject}</span>
          <span className="history-commit-author">{commit.author.name}</span>
          <time
            className="history-commit-date"
            dateTime={new Date(commit.timestamp * 1000).toISOString()}
            title={new Date(commit.timestamp * 1000).toLocaleString(locale)}
          >
            {formatRelativeTime(commit.timestamp, locale)}
          </time>
        </header>
        {body.length > 0
          ? <pre className="history-commit-body">{body}</pre>
          : null}
        {commit.changes.length > 0
          ? <ul className="history-commit-changes">
            {commit.changes.map((change) => (
              <li
                key={change.path}
                className={`history-commit-change ${change.change}`}
              >
                <span className="history-commit-change-marker">
                  {change.change === "delete" ? "-" : "+"}
                </span>
                <span className="history-commit-change-path">
                  {change.path}
                </span>
              </li>
            ))}
          </ul>
          : null}
        {commit.changes.length > 0
          ? <button
            type="button"
            className="default-button-small default-action history-show-diff"
            onClick={() => toggleDiff(commit.oid)}
          >
            {isExpanded ? l("history.hide-diff") : l("history.show-diff")}
          </button>
          : null}
        {isExpanded
          ? <div className="history-commit-diff">
            {diffState?.loading
              ? <BusyIndicator alt={l("history.diff.loading")} />
              : null}
            {diffState?.error
              ? <p className="error-text">{diffState.error}</p>
              : null}
            {diffState?.files
              ? <CommitDiff files={diffState.files} />
              : null}
          </div>
          : null}
      </article>;
    })}
    {hasMore
      ? <button
        type="button"
        className="default-button default-action history-load-more"
        disabled={isLoadingMore}
        onClick={onLoadMore}
      >
        {l("history.load-more")}
      </button>
      : null}
  </div>;
};

export default HistoryList;
