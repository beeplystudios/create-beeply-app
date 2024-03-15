import globalCssHref from "../globals.css?url";

export const devStyleInject = () => {
  if (!import.meta.env.DEV) return [];

  return [
    {
      rel: "stylesheet",
      href: import.meta.env.SSR ? "/_build" + globalCssHref : globalCssHref,
    },
  ];
};
 