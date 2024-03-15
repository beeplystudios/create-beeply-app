/// <reference types="vinxi/types/client" />
import "./globals.css";
import { Root, hydrateRoot } from "react-dom/client";
import "vinxi/client";

import {
  type RouterManagedTag,
  StartClient,
} from "@tanstack/react-router-server/client";
import { StrictMode } from "react";
import { type ModuleNamespace } from "vite/types/hot.js";
import { createRouter } from "./lib/router";

render();

function render(mod?: ModuleNamespace) {
  const router = createRouter({});

  router.update({
    context: {
      ...router.options.context,
      assets: window.__ASSETS__,
    },
  });

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
    __ASSETS__: RouterManagedTag[];
  }
}
