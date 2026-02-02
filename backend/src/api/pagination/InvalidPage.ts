import PaginationError from './PaginationError.js';

class InvalidPage extends PaginationError {
  readonly page: number;

  constructor(page: number, options?: ErrorOptions) {
    super(`Invalid page "${page}": must be a positive integer`, options);

    this.page = page;
  }
}

export default InvalidPage;
