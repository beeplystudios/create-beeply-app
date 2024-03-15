import { Outlet } from "@tanstack/react-router";
import { Meta, Scripts } from "@tanstack/react-router-server/client";

export function RootRoute() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
