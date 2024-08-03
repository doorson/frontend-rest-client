export const isArray = (value: unknown): value is Array<unknown> => Array.isArray(value);

export const isObject = (value: unknown): value is Record<symbol, unknown> => typeof value === "object" && !isArray(value);

export const isDefined = (value: unknown) => value !== null && value !== undefined;

export const isFunction = (fn: unknown): fn is () => unknown => typeof fn === "function";

export const isString = (value: unknown): value is string => typeof value === "string";
