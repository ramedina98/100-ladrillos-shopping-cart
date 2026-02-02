interface Reporter {
  send(error: Error): void;
}

export type { Reporter };
