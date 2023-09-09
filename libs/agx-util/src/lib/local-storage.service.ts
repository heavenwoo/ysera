export class LocalStorageService {
  set<T>(key: string, value: T, options = {}): void {
    if (typeof value === 'string') {
      localStorage.setItem(key, value);
    }
  }

  get<T>(key: string, options = {}): T {
    const value = localStorage.getItem(key);

    return value as T;
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }
}
