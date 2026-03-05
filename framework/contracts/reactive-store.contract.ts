import { Observable } from "rxjs";
import { AppService } from "./app-service.contract";

export interface ReactiveStore<T> extends AppService {
  state$: Observable<T>;
  getSnapshot(): T;
  set(state: T): void;
  reset(): void;
}
