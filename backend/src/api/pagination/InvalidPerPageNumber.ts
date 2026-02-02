import PaginationError from './PaginationError.js';

class InvalidPerPageNumber extends PaginationError {
  readonly perPage: number;

  constructor(perPage: number, options?: ErrorOptions) {
    super(
      `Invalid perPage number "${perPage}": must be a positive integer greater than 0`,
      options
    );

    this.perPage = perPage;
  }
}

export default InvalidPerPageNumber;
