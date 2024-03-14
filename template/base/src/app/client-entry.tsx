/// <reference types="vinxi/types/client" />
import "./globals.css";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "vinxi/client";
import { createRouter } from "./lib/router";
import { RouterProvider } from "@tanstack/react-router";

const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const router = createRouter();
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
