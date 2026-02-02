import { describe, expect, it } from 'vitest';

import Pagination from '../../../src/api/pagination/Pagination.js';

describe('Pagination', () => {
  it('should get the limit successfully', () => {
    const pagination = new Pagination(1, 10);

    expect(pagination.getLimit()).to.be.equal(10);
  });

  it('should get the offset successfully', () => {
    const pagination = new Pagination(1, 10);

    expect(pagination.getOffset()).to.be.equal(0);
  });
});
