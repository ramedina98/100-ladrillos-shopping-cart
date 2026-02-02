interface DatabasePagination {
  getOffset(): number;
  getLimit(): number;
}

export type { DatabasePagination };
