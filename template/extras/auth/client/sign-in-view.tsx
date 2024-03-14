import { Link, getRouteApi } from "@tanstack/react-router";

const routeApi = getRouteApi("/sign-in");

const createAuthMethodUrl = (
  provider: string,
  redirectPathname?: string,
  token?: string
) => {
  return `${__APP_URL__}/api/auth/sign-in/${provider}?${new URLSearchParams({
    redirect: `${__APP_URL__}${redirectPathname || "/"}`,
    token: token || "",
  }).toString()}`;
};

export const SignInView = () => {
  const searchParams = routeApi.useSearch();

  return (
    <div>
      Sign in
      <Link
        to={createAuthMethodUrl(
          "google",
          searchParams.callback,
          searchParams.token
        )}
      >
        Sign In
      </Link>
      <Link to="/">Go home</Link>
    </div>
  );
};
