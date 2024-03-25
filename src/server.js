import http from "node:http";
import { json } from "./middlewares/json.js";
import { routes } from "./routes.js";
import { extractQueryParams } from "./utils/extract-query-params.js";

const server = http.createServer(async (req, res) => {
  const { method, url } = req;
  await json(req, res);

  const route = routes.find((route) => route.method === method && route.path.test(url));

  if (route) {
    const { groups } = req.url.match(route.path);
    const { query, ...params } = groups;
    req.query = query ? extractQueryParams(query) : {};
    req.params = params;
    return route.handler(req, res);
  }

  return res.writeHead(404).end("Not found");
});

server.listen(3333);
