import { useMemo } from "react";

import { useObservable } from "./use-observable.hook";
import { useAppService } from "./use-app-service.hook";
import { Store } from "@framework/contracts";

export function useStore<T>(store: Store<T>) {
  const { serviceId } = useAppService(store);
  const data = useObservable(store.state$, store.getSnapshot());

  const state = useMemo(() => ({ data, serviceId }), [data, serviceId]);

  return state;
}
