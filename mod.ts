import { SECRET_KEY } from "./configs.ts";
import clear from "./src/clear.ts";
import deleteOne from "./src/delete.ts";
import forEach from "./src/filter.ts";
import filter from "./src/filter.ts";
import get from "./src/get.ts";
import has from "./src/has.ts";
import set from "./src/set.ts";
import size from "./src/size.ts";

// Start listening on localhost.
const server = Deno.listen({ port: 8086 });
console.log(`HTTP webserver running.  Access it at:  http://localhost:8086/`);

// Connections to the server will be yielded up as an async iterable.
for await (const conn of server) {
  // In order to not be blocking, we need to handle each connection individually
  // in its own async function.
  (async () => {
    // This "upgrades" a network connection into an HTTP connection.
    const httpConn = Deno.serveHttp(conn);
    // Each request sent over the HTTP connection will be yielded as an async
    // iterator from the HTTP connection.
    for await (const requestEvent of httpConn) {
      if (!SECRET_KEY || requestEvent.request.headers.get("authorization") !== SECRET_KEY)
        return requestEvent.respondWith(
          new Response(JSON.stringify({ error: "Invalid secret key." }), {
            status: 401,
          })
        );

      const json = await requestEvent.request.json();

      let response;

      switch (json.type) {
        case "get":
          response = get(json.table, json.key);
          break;
        case "set":
          set(json.table, json.key, json.payload);
          break;
        case "clear":
          clear(json.table);
          break;
        case "delete":
          deleteOne(json.table, json.key);
          break;
        case "filter":
          response = filter(json.table, json.payload);
          break;
        case "forEach":
          forEach(json.table, json.payload);
          break;
        case "has":
          response = has(json.table, json.key);
          break;
        case "size":
          response = size(json.table);
          break;
      }

      requestEvent.respondWith(
        new Response(JSON.stringify({ success: true, response }), {
          status: 200,
        })
      );
    }
  })();
}
