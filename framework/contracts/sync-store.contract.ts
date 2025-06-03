import { AppService } from "./app-service.contract";
import { Store } from "./base-store.contract";

export interface SyncStore<T> extends Store<T>, AppService {
  update(fn: (state: T) => T): void;
  reset(): void;
}
