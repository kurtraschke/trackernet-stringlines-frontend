const customFetch: typeof fetch = (url, options) => {
  if (
    typeof url === "string" &&
    options?.method === "POST" &&
    typeof options.body === "string" &&
    options.body.startsWith("SELECT")
  ) {
    const query = options.body.replace(/\s\s+/g, " ");

    const parsedURL = new URL(url);
    parsedURL.searchParams.set("query", query);
    url = parsedURL.toString();

    options.method = "GET";
    options.body = undefined;
    delete (options.headers as { Authorization?: string }).Authorization;
  }

  return fetch(url, options);
};

export default customFetch;