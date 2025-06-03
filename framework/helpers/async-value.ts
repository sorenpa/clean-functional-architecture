import {
  Async,
  AsyncData,
  AsyncEmpty,
  AsyncError,
  AsyncLoading,
  AsyncStatus,
} from "@framework/models";

function empty(): AsyncEmpty {
  return { status: AsyncStatus.EMPTY };
}

function loading(): AsyncLoading {
  return { status: AsyncStatus.LOADING };
}

function error(error: Error): AsyncError {
  return { status: AsyncStatus.ERROR, error };
}

function data<T>(data: T): AsyncData<T> {
  return { status: AsyncStatus.DATA, data };
}

function hasData<T>(value: Async<T>): value is AsyncData<T> {
  return value.status === AsyncStatus.DATA;
}

function isError<T>(value: Async<T>): value is AsyncError {
  return value.status === AsyncStatus.ERROR;
}

function isLoading<T>(value: Async<T>): value is AsyncLoading {
  return value.status === AsyncStatus.LOADING;
}

function isEmpty<T>(value: Async<T>): value is AsyncEmpty {
  return value.status === AsyncStatus.EMPTY;
}

function getError<T>(value: Async<T>): unknown {
  if (isError(value)) return value.error;
  throw new Error(`Expected Error but got ${value.status}`);
}

function getMaybe<T>(value: Async<T>): T | undefined {
  return hasData(value) ? value.data : undefined;
}

function get<T>(value: Async<T>): T {
  if (hasData(value)) return value.data;
  throw new Error(`Expected SUCCESS but got ${value.status}`);
}

function getOr<T>(value: Async<T>, fallback: () => T): T {
  return hasData(value) ? value.data : fallback();
}

export const asyncValue = {
  empty,
  loading,
  error,
  data,
  hasData,
  isError,
  isLoading,
  isEmpty,
  getError,
  getMaybe,
  get,
  getOr,
};
