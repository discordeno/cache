import { SECRET_KEY } from "./configs.ts";

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

      switch (json.type) {
        case "get":

          break;
        case "set":
          
          break;
      }
      requestEvent.respondWith(
        new Response(JSON.stringify({ success: true }), {
          status: 200,
        })
      );
    }
  })();
}
