import { useMemo } from "react";
import { AppService, SyncStore } from "@framework/contracts";
import { useObservable } from "./use-observable.hook";
import { useAppService } from "./use-app-service.hook";

export function useSyncStore<T>(service: SyncStore<T>): T & AppService;
export function useSyncStore<T, K extends keyof T>(
  store: SyncStore<T>,
  keys: K[]
): Pick<T, K> & AppService;
export function useSyncStore<T, K extends keyof T>(
  store: SyncStore<T>,
  keys?: K[]
): (T & AppService) | (Pick<T, K> & AppService) {
  const { serviceId } = useAppService(store);
  const fullState = useObservable(store.state$, store.getSnapshot());

  const selectedState = useMemo(() => {
    if (!keys || keys.length === 0) return fullState;

    const partial: Partial<T> = {};
    keys.forEach((key) => {
      partial[key] = fullState[key];
    });

    return partial as Pick<T, K>;
  }, [fullState, keys]);

  return { ...selectedState, serviceId };
}
