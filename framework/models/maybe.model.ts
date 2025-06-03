import { MaybeStatus } from "./maybe-status.model";

export interface MaybeBase<T> {
  status: MaybeStatus;
  value?: T;
}

export interface MaybeNone extends MaybeBase<unknown> {
  status: MaybeStatus.NONE;
}

export interface MaybeSome<T> extends MaybeBase<T> {
  status: MaybeStatus.SOME;
  value: T;
}

export type Maybe<T> = MaybeNone | MaybeSome<T>;
