import { signal } from "@angular/core";
// import ls from 'localstorage-slim';
import { LocalStorageService } from "@ysera/ngx-local-storage";

const ls = new LocalStorageService();

const localStorageToken: string | null = ls.get("token", { decrypt: true });
export const token = signal(localStorageToken);
