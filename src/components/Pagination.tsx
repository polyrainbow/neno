import usePagination from "../hooks/usePagination";
import { l } from "../lib/intl";


const getNumberOfPages = (
  numberOfResults: number,
  searchResultsPerPage: number,
) => {
  let numberOfPages;

  const numberOfFullPages = Math.floor(
    numberOfResults / searchResultsPerPage,
  );

  if (numberOfResults % searchResultsPerPage !== 0) {
    numberOfPages = numberOfFullPages + 1;
  } else {
    numberOfPages = numberOfFullPages;
  }

  return numberOfPages;
};

interface PaginationProps {
  numberOfResults: number;
  searchResultsPerPage: number;
  page: number;
  onChange: (newPage: number) => void;
  placement?: "top" | "bottom";
}

const Pagination = ({
  numberOfResults,
  searchResultsPerPage,
  page,
  onChange,
  placement,
}: PaginationProps) => {
  const doRenderPagination = numberOfResults > searchResultsPerPage;

  const numberOfPages = getNumberOfPages(
    numberOfResults,
    searchResultsPerPage,
  );

  const { items } = usePagination({
    count: numberOfPages,
    page,
    onChange: (_event, newPage) => onChange(newPage),
  });

  if (!doRenderPagination) return null;

  return (
    <div className={"pagination " + (placement || "")}>
      <nav>
        <ul>
          {items.map(({ page, type, selected, ...item }, index) => {
            let children: React.ReactNode | null = null;

            if (type === "start-ellipsis" || type === "end-ellipsis") {
              children = <span className="pagination-ellipsis">…</span>;
            } else if (type === "page") {
              children = (
                <button
                  type="button"
                  className={
                    "default-button-small"
                    + (selected ? " pagination-button-selected" : "")
                  }
                  {...item}
                >
                  {page}
                </button>
              );
            } else {
              children = (
                <button
                  type="button"
                  className="default-button-small pagination-button-special"
                  title={
                    type === "previous"
                      ? l("list.pagination.previous-page")
                      : l("list.pagination.next-page")
                  }
                  {...item}
                >
                  {type === "previous" ? "<" : ">"}
                </button>
              );
            }

            return <li
              key={index}
            >{children}</li>;
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
