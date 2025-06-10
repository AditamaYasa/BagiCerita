function extractPathnameSegments(path) {
  const parts = path.split('/').filter(Boolean); 
  return {
    resource: parts[0] || null,
    id: parts[1] || null,
  };
}

function constructRouteFromSegments({ resource, id }) {
  let pathname = '';
  if (resource) pathname += `/${resource}`;
  if (id) pathname += '/:id';
  return pathname || '/';
}

export function getActivePathname() {
  const cleanHash = location.hash.replace('#', '').split('?')[0];
  return cleanHash || '/';
}

export function getActiveRoute() {
  const pathname = getActivePathname();
  const urlSegments = extractPathnameSegments(pathname);
  return constructRouteFromSegments(urlSegments);
}

export function parseActivePathname() {
  return extractPathnameSegments(getActivePathname());
}

export function getRoute(pathname) {
  return constructRouteFromSegments(extractPathnameSegments(pathname));
}

export function parsePathname(pathname) {
  return extractPathnameSegments(pathname);
}
