import { RequestCredentials, RequestMode } from "undici-types/fetch";
import { ClientRequest, ClientResponse, FetchFrontendClientOptions, FrontendClient } from "../interfaces";
import { prepareQuery } from "../utils/queryUtils";
import { isDefined, isFunction } from "../utils/validators";

/**
 * Main implementation of the Frontend client
 *
 * @public
 */
export class FetchFrontendClient implements FrontendClient {
  constructor(
    private baseUrl: string,
    private options?: FetchFrontendClientOptions,
  ) {}

  public async request<RequestBody, Response>(request: ClientRequest<RequestBody>): Promise<ClientResponse<Response>> {
    return this.call(request);
  }

  public async call<RequestBody, Response>(request?: ClientRequest<RequestBody>): Promise<ClientResponse<Response>> {
    const { data, query, headers, method, url } = request ?? {};

    const { _headers, _credentials, _mode, _bodyParser, _preRequestFn, _responder } = this.options ?? {};

    const options: RequestInit = {
      method,
      headers: { ...(_headers ?? {}), ...(headers ?? {}) },
    } as RequestInit;

    if (_credentials) {
      if (isRequestCredential(_credentials)) {
        options.credentials = _credentials;
      } else {
        console.warn(`"${_credentials as string}" is not a proper credential value. It should be one of: ${JSON.stringify(reqCredentials)}`);
      }
    }

    if (_mode) {
      if (isRequestMode(_mode)) {
        options.mode = _mode;
      } else {
        console.warn(`"${_mode as string}" is not a proper mode value. It should be one of: ${JSON.stringify(modes)}`);
      }
    }

    if (data !== undefined) {
      const body = (typeof data === "function" ? data() : data) as unknown as BodyInit;
      if (_bodyParser) {
        if (isFunction(_bodyParser)) {
          options.body = _bodyParser(body);
        } else {
          console.warn(`"bodyParser ${_bodyParser as string}" is not a function`);
        }
      }
    }

    if (_preRequestFn) {
      if (isFunction(_preRequestFn)) {
        await _preRequestFn();
      } else {
        console.warn(`"preRequest ${_preRequestFn as string}" is not a function`);
      }
    }

    const targetUrl = `${this.baseUrl}${url}${prepareQuery(query)}`;
    const fetchResponse = await fetch(targetUrl, options);

    const respondedResponse = isDefined(_responder) && isFunction(_responder) ? await _responder(fetchResponse) : fetchResponse;

    const response: ClientResponse<Response> = {
      httpStatus: respondedResponse.status,
      payload: respondedResponse.body as unknown as Response,
      responseHeaders: respondedResponse.headers as unknown as { [key: string]: string | string[] },
    };

    return response;
  }
}

const modes = ["cors", "navigate", "no-cors", "same-origin"];

function isRequestMode(arg: string): arg is RequestMode {
  return modes.includes(arg);
}

const reqCredentials = ["omit", "include", "same-origin"];

function isRequestCredential(arg: string): arg is RequestCredentials {
  return reqCredentials.includes(arg);
}
