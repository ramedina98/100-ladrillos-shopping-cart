import InvalidPage from './InvalidPage.js';
import InvalidPageNumber from './InvalidPageNumber.js';
import InvalidPerPage from './InvalidPerPage.js';
import InvalidPerPageNumber from './InvalidPerPageNumber.js';

import type { DatabasePagination } from '../../core/database/DatabasePagination.js';

interface PaginationQueryParams {
  page?: string;
  perPage?: string;
}

class Pagination implements DatabasePagination {
  private page: number;
  private perPage: number;

  constructor(page: number, perPage: number) {
    if (!Number.isInteger(page) || page <= 0) {
      throw new InvalidPageNumber(page);
    }

    if (!Number.isInteger(perPage) || perPage <= 0) {
      throw new InvalidPerPageNumber(perPage);
    }

    this.page = page;
    this.perPage = perPage;
  }

  static createFromExpressQuery(query: PaginationQueryParams): Pagination {
    let page = 1;
    let perPage = 25;

    if ('page' in query) {
      const queryPage = Number(query.page);

      if (isNaN(queryPage)) {
        throw new InvalidPage(queryPage);
      }

      if (!Number.isInteger(queryPage) || queryPage <= 0) {
        throw new InvalidPageNumber(queryPage);
      }

      page = queryPage;
    }

    if ('perPage' in query) {
      const queryPerPage = Number(query.perPage);

      if (isNaN(queryPerPage)) {
        throw new InvalidPerPage(queryPerPage);
      }

      if (!Number.isInteger(queryPerPage) || queryPerPage <= 0) {
        throw new InvalidPerPageNumber(queryPerPage);
      }

      perPage = queryPerPage;
    }

    return new Pagination(page, perPage);
  }

  getLimit(): number {
    return this.perPage;
  }

  getOffset(): number {
    /**
     * Calculates the number of items to skip in the query (OFFSET in SQL).
     *
     * The formula is: (page - 1) * perPage
     *
     * - We subtract 1 from the page number because pagination is typically 1-based
     *   (i.e., page 1 is the first page),
     *   but the offset is 0-based (i.e., the first item starts at index 0).
     * - We multiply by `perPage` to skip the correct number of items.
     *   For example, if we're on page 3 with 10 items per page, we skip (3 - 1) * 10 = 20 items,
     *   so we start from the 21st item.
     *
     * This allows us to fetch only the relevant slice of results from the database.
    */

    return (this.page - 1) * this.perPage;
  }
}

export default Pagination;
