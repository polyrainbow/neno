import { useState, useEffect, useCallback } from "react";
import { l } from "../lib/intl";
import HeaderContainerLeftRight from "./HeaderContainerLeftRight";
import useNotesProvider from "../hooks/useNotesProvider";
import BusyIndicator from "./BusyIndicator";
import NavigationRail from "./NavigationRail";
import HistoryList from "./HistoryList";
import { CommitInfo } from "../lib/notes-worker/NotesProviderProxy";

const PAGE_SIZE = 20;

const HistoryView = () => {
  const notesProvider = useNotesProvider();
  const [commits, setCommits] = useState<CommitInfo[] | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  useEffect(() => {
    const fetchInitial = async () => {
      const page = await notesProvider.getCommitHistory({
        limit: PAGE_SIZE,
        offset: 0,
      });
      setCommits(page);
      setHasMore(page.length === PAGE_SIZE);
    };

    fetchInitial();
  }, [notesProvider]);

  const loadMore = useCallback(async () => {
    if (commits === null || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const next = await notesProvider.getCommitHistory({
        limit: PAGE_SIZE,
        offset: commits.length,
      });
      setCommits([...commits, ...next]);
      setHasMore(next.length === PAGE_SIZE);
    } finally {
      setIsLoadingMore(false);
    }
  }, [notesProvider, commits, isLoadingMore]);

  return <div className="view">
    <NavigationRail activeView="history" />
    <HeaderContainerLeftRight />
    <section className="content-section-wide history-view">
      {
        commits === null
          ? <BusyIndicator alt={l("history.fetching")} />
          : <HistoryList
            commits={commits}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={loadMore}
          />
      }
    </section>
  </div>;
};

export default HistoryView;
