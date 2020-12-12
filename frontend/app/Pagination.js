import React from "react";
import { usePagination } from "@material-ui/lab/Pagination";


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
        }}>
          {items.map(({ page, type, selected, ...item }, index) => {
            let children = null;

            if (type === "start-ellipsis" || type === "end-ellipsis") {
              children = "…";
            } else if (type === "page") {
              children = (
                <button
                  type="button"
                  className={
                    "pagination-button" + (selected ? " selected" : "")
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
                  className="pagination-button"
                  {...item}
                >
                  {type === "previous" ? "< Previous" : "Next >"}
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
