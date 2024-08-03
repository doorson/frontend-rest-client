import { isArray, isDefined, isFunction, isObject } from "./validators";
import { QueryDefinition } from "../interfaces";

export const prepareQuery = (query?: (() => Record<string, unknown>) | Record<string, unknown>) => {
  const queryObj = query && isFunction(query) ? query() : query;
  if (!queryObj) {
    return "";
  }

  const queryString = Object.keys(queryObj)
    .map((queryKey) => prepareQueryString(queryKey, queryObj[queryKey]))
    .join("&");

  return `${queryString.length ? "?" : ""}${queryString.endsWith("&") ? queryString.slice(0, -1) : queryString}`;
};

const prepareQueryString = (key: string, value: unknown, keySeparator = "=") => {
  if (isArray(value)) {
    return value
      .map((val) => encodeURIComponent(val as string))
      .map((v) => `${key}=${v}`)
      .join("&");
  }

  if (isQueryDefinition(value)) {
    const exploded = value.exploded;
    const explodeFormat = value.explodeFormat ?? "default";
    const separator = value.separator ? value.separator : ",";
    const urlEncode = value.urlEncode === undefined ? true : value.urlEncode;

    if (isArray(value.value)) {
      const arrayVal = value.value;
      if (exploded) {
        return arrayVal
          .map(String)
          .map((v) => (urlEncode ? encodeURIComponent(v) : v))
          .map((val, index) => `${key}${explodedParamSuffix(explodeFormat, index)}=${val}`)
          .join("&");
      }
      return `${key}${keySeparator}${arrayVal
        .map(String)
        .map((v) => (urlEncode ? encodeURIComponent(v) : v))
        .map(String)
        .map((v) => `${key}=${v}`)
        .join(separator)}`;
    }

    return `${key}${keySeparator}${String(value.value)}`;
  }

  return `${key}=${String(value)}`;
};

export const explodedParamSuffix = (format: "brackets" | "index" | "default", index: number) => {
  switch (format) {
    case "brackets": {
      return "[]";
    }

    case "index": {
      return `[${index}]`;
    }

    default: {
      return "";
    }
  }
};

function isQueryDefinition(arg: unknown): arg is QueryDefinition {
  return isObject(arg) && isDefined((arg as unknown as Record<string, unknown>)["exploded"]);
}
