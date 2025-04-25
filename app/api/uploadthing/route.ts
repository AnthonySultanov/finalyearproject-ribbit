import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";

//this will export the routes for the Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,

});
