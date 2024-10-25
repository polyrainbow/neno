interface UnparsedRoute {
  path: string,
  id: string,
}

interface ParsedRoute extends UnparsedRoute {
  params: Map<number, string>,
  segments: string[],
}

export interface ActiveRoute {
  routeId: string,
  params: Map<string, string>,
}

interface Config {
  callback: (activeRoute: ActiveRoute | null) => void,
  basename: string,
  routes: UnparsedRoute[],
}

const getPathSegments = (path: string): string[] => {
  return path.split("/").filter(s => s.trim().length > 0);
};

const pathMatchesRoute = (
  path: string,
  route: ParsedRoute,
): Map<string, string> | false => {
  const pathSegments = getPathSegments(path);
  const params = new Map<string, string>();
  let i = 0;
  for (const pathSegment of pathSegments) {
    if (route.params.has(i)) {
      const paramName = route.params.get(i)!;
      params.set(paramName, decodeURIComponent(pathSegment));
      i++;
    } else if (pathSegment === route.segments[i]) {
      i++;
      continue;
    } else {
      return false;
    }
  }

  return params;
};

const getActiveRouteFromPath = (
  path: string,
  routes: ParsedRoute[],
): ActiveRoute | null => {
  for (const route of routes) {
    const match = pathMatchesRoute(path, route);
    if (match) {
      return {
        routeId: route.id,
        params: match,
      };
    } else {
      continue;
    }
  }

  return null;
};

const parseRoute = (unparsedRoute: UnparsedRoute): ParsedRoute => {
  const params = new Map<number, string>();
  const segments = getPathSegments(unparsedRoute.path);
  let i = 0;

  for (const segment of segments) {
    if (segment.startsWith(":")) {
      params.set(i, segment.substring(1));
    }
    i++;
  }

  return {
    ...unparsedRoute,
    params,
    segments,
  };
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
      const path = url.pathname.substring(basename.length);

      const activeRoute = getActiveRouteFromPath(
        path,
        routes.map(parseRoute),
      );
      if (!activeRoute) {
        return;
      }
      // @ts-ignore
      event.intercept();
      callback(activeRoute);
    } else {
      return;
    }
  });


  if (location.pathname.startsWith(basename)) {
    const path = location.pathname.substring(basename.length);

    const activeRoute = getActiveRouteFromPath(
      path,
      routes.map(parseRoute),
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
