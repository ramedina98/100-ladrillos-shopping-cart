import PaginationError from './PaginationError.js';

class InvalidPerPage extends PaginationError {
  readonly perPage: number;

  constructor(perPage: number, options?: ErrorOptions) {
    super(`Invalid perPage "${perPage}": must be a positive integer`, options);

    this.perPage = perPage;
  }
}

export default InvalidPerPage;
