import { AppService } from "@framework/contracts";
import { useEffect, useState } from "react";

export function useAppService<T extends AppService>(service: T): AppService {
  const [id, setId] = useState(service.serviceId);

  useEffect(() => {
    if (service.serviceId !== id) {
      setId(service.serviceId);
    }
  }, [service, id]);

  return service;
}
