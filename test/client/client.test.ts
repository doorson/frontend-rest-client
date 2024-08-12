import { initFetchFrontendClient } from "../../build";
import { HttpMethod } from "../../src";

describe("test client request", () => {
  beforeAll(() => {});

  it("Rest API client call with empty params should return empty response", async () => {
    const client = initFetchFrontendClient({ baseUrl: "https://google.com" });
    const response = await client.request<void, string>({
      resourceName: "getPage",
      method: HttpMethod.GET,
      url: "",
      data: undefined,
      query: { q: "test" },
    });

    expect(response).toBeTruthy();
  });
});
