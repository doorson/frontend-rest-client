import { RequestCredentials, RequestMode } from "undici-types/fetch";

/**
 * Client options for the client instance configuration
 *
 * @public
 */
export class FetchFrontendClientOptions {
  _headers?: Record<string, string | string[]> | undefined;
  _credentials?: RequestCredentials;
  _mode?: RequestMode;
  _bodyParser?: (body?: BodyInit) => string;
  _preRequestFn?: () => Promise<unknown>;
  _responder?: (response: Response) => Promise<Response>;

  public preRequest(preRequestFn: () => Promise<unknown>): FetchFrontendClientOptions {
    this._preRequestFn = preRequestFn;
    return this;
  }

  public headers(headers: Record<string, string | string[]> | undefined): FetchFrontendClientOptions {
    this._headers = headers;
    return this;
  }

  public mode(mode: RequestMode): FetchFrontendClientOptions {
    this._mode = mode;
    return this;
  }

  public credentials(credentials: RequestCredentials): FetchFrontendClientOptions {
    this._credentials = credentials;
    return this;
  }

  public bodyParser(bodyParser: (body?: BodyInit) => string): FetchFrontendClientOptions {
    this._bodyParser = bodyParser;
    return this;
  }

  public responder(responder: () => Promise<Response>) {
    this._responder = responder;
    return this;
  }
}

/**
 * FrontendClient interface to be used for invoking HTTP calls
 *
 * @public
 */
export interface FrontendClient {
  request<RequestBody, Response>(request?: ClientRequest<RequestBody>): Promise<ClientResponse<Response>>;
}

/**
 * Request method configuration interface
 *
 * @public
 */
export interface FetchClientData<RequestType> {
  url: string;
  method: HttpMethod;
  headers?: (() => Record<string, string | string[]>) | Record<string, string | string[]>;
  query?: (() => Record<string, unknown>) | Record<string, unknown>;
  body?: (() => RequestType) | RequestType;
  credentials?: RequestCredentials;
  mode?: RequestMode;
}

/**
 * Http method to be used in client request
 *
 * @public
 */
export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  OPTIONS = "OPTIONS",
  PATCH = "PATCH",
  HEAD = "HEAD",
}

/**
 * Type definition for query param value
 *
 * @public
 */
export type QueryParamValueType = number | number[] | string | string[] | object | object[] | undefined | Date | Date[];

/**
 * Client request parameters interface
 * @public
 */
export interface ClientRequest<RequestBody> {
  resourceName: string;
  method: HttpMethod | string;
  url: string;
  pathParams?: { [queryParam: string]: string | number | Date };
  query?: { [queryParam: string]: QueryParamValueType };
  data: RequestBody;
  headers?: { [key: string]: unknown };
}

/**
 * ClientResponse to be returned by the request method
 *
 * @public
 */
export interface ClientResponse<Response> {
  httpStatus: number;
  payload: Response;
  responseHeaders?: { [key: string]: string | string[] };
}

export interface QueryDefinition {
  exploded: boolean;
  explodeFormat?: "brackets" | "index" | "default";
  separator?: string;
  urlEncode?: boolean;
  value: unknown;
}
