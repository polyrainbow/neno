/*
  @license

  The MIT License (MIT)

  Copyright (c) 2014 Call-Em-All

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

import useControlled from "./useControlled";

interface UsePaginationProps {
  /**
   * Number of always visible pages at the beginning and end.
   * @default 1
   */
  boundaryCount?: number;
  /**
   * The name of the component where this hook is used.
   */
  componentName?: string;
  /**
   * The total number of pages.
   * @default 1
   */
  count?: number;
  /**
   * The page selected by default when the component is uncontrolled.
   * @default 1
   */
  defaultPage?: number;
  /**
   * If `true`, the component is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, hide the next-page button.
   * @default false
   */
  hideNextButton?: boolean;
  /**
   * If `true`, hide the previous-page button.
   * @default false
   */
  hidePrevButton?: boolean;
  /**
   * Callback fired when the page is changed.
   *
   * @param {React.ChangeEvent<unknown>} event The event source of the callback.
   * @param {number} page The page selected.
   */
  onChange?: (event: React.ChangeEvent<unknown>, page: number) => void;
  /**
   * The current page.
   */
  page: number;
  /**
   * If `true`, show the first-page button.
   * @default false
   */
  showFirstButton?: boolean;
  /**
   * If `true`, show the last-page button.
   * @default false
   */
  showLastButton?: boolean;
  /**
   * Number of always visible pages before and after the current page.
   * @default 1
   */
  siblingCount?: number;
}

export enum PaginationItemType {
  First = "first",
  Previous = "previous",
  Page = "page",
  Next = "next",
  Last = "last",
  StartEllipsis = "start-ellipsis",
  EndEllipsis = "end-ellipsis",
}

interface UsePaginationItem {
  onClick: React.ReactEventHandler;
  type: PaginationItemType;
  page: number | null;
  selected: boolean;
  disabled: boolean;
}

interface UsePaginationResult {
  items: UsePaginationItem[];
}

export default function usePagination(
  props: UsePaginationProps,
): UsePaginationResult {
  // keep default values in sync with @default tags in Pagination.propTypes
  const {
    boundaryCount = 1,
    count = 1,
    defaultPage = 1,
    disabled = false,
    hideNextButton = false,
    hidePrevButton = false,
    onChange: handleChange,
    page: pageProp,
    showFirstButton = false,
    showLastButton = false,
    siblingCount = 1,
    ...other
  } = props;

  const [page, setPageState] = useControlled({
    controlled: pageProp,
    default: defaultPage,
  });

  const handleClick = (event: React.ChangeEvent, value: number | null) => {
    if ((!pageProp) && value) {
      setPageState(value);
    }
    if (handleChange && value !== null) {
      handleChange(event, value);
    }
  };

  // https://dev.to/namirsab/comment/2050
  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  const startPages = range(1, Math.min(boundaryCount, count));
  const endPages = range(
    Math.max(count - boundaryCount + 1, boundaryCount + 1),
    count,
  );

  const siblingsStart = Math.max(
    Math.min(
      // Natural start
      page - siblingCount,
      // Lower boundary when page is high
      count - boundaryCount - siblingCount * 2 - 1,
    ),
    // Greater than startPages
    boundaryCount + 2,
  );

  const siblingsEnd = Math.min(
    Math.max(
      // Natural end
      page + siblingCount,
      // Upper boundary when page is low
      boundaryCount + siblingCount * 2 + 2,
    ),
    // Less than endPages
    endPages.length > 0 ? endPages[0] - 2 : count - 1,
  );

  // Basic list of items to render
  // e.g. itemList = ['first', 'previous', 1, 'ellipsis', 4, 5, 6, 'ellipsis',
  // 10, 'next', 'last']
  const itemList: (PaginationItemType | number)[] = [
    ...(showFirstButton ? [PaginationItemType.First] : []),
    ...(hidePrevButton ? [] : [PaginationItemType.Previous]),
    ...startPages,

    // Start ellipsis

    ...(siblingsStart > boundaryCount + 2
      ? [PaginationItemType.StartEllipsis]
      : boundaryCount + 1 < count - boundaryCount
        ? [boundaryCount + 1]
        : []),

    // Sibling pages
    ...range(siblingsStart, siblingsEnd),

    // End ellipsis

    ...(siblingsEnd < count - boundaryCount - 1
      ? [PaginationItemType.EndEllipsis]
      : count - boundaryCount > boundaryCount
        ? [count - boundaryCount]
        : []),

    ...endPages,
    ...(hideNextButton ? [] : [PaginationItemType.Next]),
    ...(showLastButton ? [PaginationItemType.Last] : []),
  ];

  // Map the button type to its page number
  const buttonPage = (type: PaginationItemType): number | null => {
    switch (type) {
    case PaginationItemType.First:
      return 1;
    case PaginationItemType.Previous:
      return page - 1;
    case PaginationItemType.Next:
      return page + 1;
    case PaginationItemType.Last:
      return count;
    default:
      return null;
    }
  };

  // Convert the basic item list to PaginationItem props objects
  const items: UsePaginationItem[] = itemList.map((item) => {
    return typeof item === "number"
      ? {
        "onClick": (event: React.ChangeEvent) => {
          handleClick(event, item);
        },
        "type": PaginationItemType.Page,
        "page": item,
        "selected": item === page,
        disabled,
        "aria-current": item === page ? "true" : undefined,
      }
      : {
        onClick: (event: React.ChangeEvent) => {
          handleClick(event, buttonPage(item));
        },
        type: item,
        page: buttonPage(item),
        selected: false,
        disabled:
            disabled
            || (item.indexOf("ellipsis") === -1
              && (
                item === "next" || item === "last" ? page >= count : page <= 1
              )
            ),
      };
  });

  return {
    items,
    ...other,
  };
}
