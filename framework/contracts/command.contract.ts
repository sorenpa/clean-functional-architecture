export interface Command<TInput> {
  execute(input: TInput): void;
}
