import React from "react";
import { usePagination } from "@material-ui/lab/Pagination/index.js";


const getNumberOfPages = (numberOfResults, searchResultsPerPage) => {
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


const Pagination = (props) => {
  const numberOfResults = props.numberOfResults;
  const searchResultsPerPage = props.searchResultsPerPage;
  const page = props.page;

  const doRenderPageButtons = numberOfResults > searchResultsPerPage;

  const numberOfPages = getNumberOfPages(
    numberOfResults,
    searchResultsPerPage,
  );

  const { items } = usePagination({
    count: numberOfPages,
    page,
    onChange: (event, newPage) => props.onChange(newPage),
  });

  if (!doRenderPageButtons) return null;

  return (
    <div style={{ "textAlign": "center", "wordBreak": "break-all" }}>
      <nav>
        <ul style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          alignItems: "center",
          fontSize: "22px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}>
          {items.map(({ page, type, selected, ...item }, index) => {
            let children: JSX.Element | null = null;

            if (type === "start-ellipsis" || type === "end-ellipsis") {
              children = <span className="pagination-ellipsis">…</span>;
            } else if (type === "page") {
              children = (
                <button
                  type="button"
                  className={
                    "default-button"
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
                  className="default-button pagination-button-special"
                  title={type === "previous" ? "Previous page" : "Next page"}
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
