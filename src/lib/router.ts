interface UnparsedRoute {
  path: string,
  id: string,
}

export interface ActiveRoute {
  routeId: string,
  params: Record<string, string>,
}

interface Config {
  callback: (activeRoute: ActiveRoute | null) => void,
  basename: string,
  routes: UnparsedRoute[],
}

const getActiveRouteFromURL = (
  url: string,
  routes: UnparsedRoute[],
): ActiveRoute | null => {
  for (const route of routes) {
    // @ts-ignore
    const pattern = new URLPattern({ pathname: route.path });
    const result = pattern.exec(url);
    if (result) {
      const params: Record<string, string> = {};
      for (const [key, value] of Object.entries(result.pathname.groups)) {
        if (typeof value === "string") {
          params[key] = value;
        }
      }
      return {
        routeId: route.id,
        params,
      };
    } else {
      continue;
    }
  }

  return null;
};

export const initRouter = ({
  callback,
  basename,
  routes,
}: Config): void => {
  // @ts-ignore
  navigation.addEventListener("navigate", (event) => {
    const url = new URL(event.destination.url);

    if (url.pathname.startsWith(basename)) {
      const activeRoute = getActiveRouteFromURL(
        url.toString(),
        routes,
      );
      if (!activeRoute) {
        return;
      }
      // @ts-ignore
      event.intercept({
        focusReset: "manual",
      });
      callback(activeRoute);
    } else {
      return;
    }
  });

  if (location.pathname.startsWith(basename)) {
    const activeRoute = getActiveRouteFromURL(
      location.href,
      routes,
    );

    if (!activeRoute) {
      return;
    }
    callback(activeRoute);
  } else {
    callback(null);
    return;
  }
};
