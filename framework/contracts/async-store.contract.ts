import { Async } from "../models";
import { AppService } from "./app-service.contract";
import { Store } from "./base-store.contract";

export type AsyncStore<T> = Store<Async<T>> & AppService;
