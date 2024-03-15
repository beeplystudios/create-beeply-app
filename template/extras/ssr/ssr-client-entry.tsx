/// <reference types="vinxi/types/client" />
import "./globals.css";
import { Root, hydrateRoot } from "react-dom/client";
import "vinxi/client";

import { StartClient } from "@tanstack/react-router-server/client";
import { type ModuleNamespace } from "vite/types/hot.js";
import { createRouter } from "./lib/router";
import { StrictMode } from "react";

render();

function render(mod?: ModuleNamespace) {
  const router = createRouter({});

  const app = (
    <StrictMode>
      <StartClient router={router} />
    </StrictMode>
  );

  if (!mod && !window.$root) {
    router.hydrate();
    window.$root = hydrateRoot(document, app);
  } else {
    window.$root?.render(app);
  }
}

if (import.meta.hot) {
  import.meta.hot.accept((mod) => {
    if (mod) {
      render(mod);
    }
  });
}

declare global {
  interface Window {
    $root?: Root;
  }
}
