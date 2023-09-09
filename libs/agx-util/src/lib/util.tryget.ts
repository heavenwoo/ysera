export function tryGet<T>(fn: () => T, fallback: T = null): T {
  try {
    return fn() || fallback;
  } catch (e) {
    if (e instanceof TypeError) {
      return fallback;
    }
    throw e;
  }
}
