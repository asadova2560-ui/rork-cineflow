export function redirectSystemPath({
  path,
  initial,
}: { path: string; initial: boolean }) {
  if (path.includes('movie/')) {
    return path;
  }
  return '/';
}
