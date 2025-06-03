import { Observable } from "rxjs";
import { AppService } from "./app-service.contract";

export interface Store<T> extends AppService {
  state$: Observable<T>;
  getSnapshot(): T;
}
