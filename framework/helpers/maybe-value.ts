import { Maybe, MaybeNone, MaybeSome, MaybeStatus } from "@framework/models";

function none(): MaybeNone {
  return { status: MaybeStatus.NONE };
}

function some<T>(value: T): MaybeSome<T> {
  return { status: MaybeStatus.SOME, value };
}

function isSome<T>(value: Maybe<T>): value is MaybeSome<T> {
  return value.status === MaybeStatus.SOME;
}

function isNone<T>(value: Maybe<T>): value is MaybeNone {
  return value.status === MaybeStatus.NONE;
}

function getMaybe<T>(value: Maybe<T>): T | undefined {
  return isSome(value) ? value.value : undefined;
}

function get<T>(value: Maybe<T>): T {
  if (isSome(value)) return value.value;
  throw new Error(`Expected SOME but got ${value.status}`);
}

function getOr<T>(value: Maybe<T>, fallback: () => T): T {
  return isSome(value) ? value.value : fallback();
}

export const maybeValue = {
  none,
  some,
  isSome,
  isNone,
  getMaybe,
  get,
  getOr,
};
