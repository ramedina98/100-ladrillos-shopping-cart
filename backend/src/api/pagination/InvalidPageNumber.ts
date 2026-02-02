import PaginationError from './PaginationError.js';

class InvalidPageNumber extends PaginationError {
  readonly page: number;

  constructor(page: number, options?: ErrorOptions) {
    super(`Invalid page number "${page}": must be a positive integer greater than 0`, options);

    this.page = page;
  }
}

export default InvalidPageNumber;
