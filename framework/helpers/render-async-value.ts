import { Async, AsyncStatus } from "@framework/models";
import { asyncValue } from "./async-value";

type RenderHandlers<T, R> = {
  empty: () => R;
  loading: () => R;
  error: (error: unknown) => R;
  success: (data: T) => R;
};

export function renderAsyncValue<T, R>(
  value: Async<T>,
  handlers: RenderHandlers<T, R>
): R {
  switch (value.status) {
    case AsyncStatus.EMPTY:
      return handlers.empty();
    case AsyncStatus.LOADING:
      return handlers.loading();
    case AsyncStatus.ERROR:
      return handlers.error(asyncValue.getError(value));
    case AsyncStatus.DATA:
    default:
      return handlers.success(asyncValue.get(value));
  }
}
