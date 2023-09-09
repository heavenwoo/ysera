/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Base64 } from 'js-base64';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  /**
   * Gets the payload portion of a JWT token
   * @param token
   */
  getPayload<T>(token: string): any {
    let parts = [];

    try {
      parts = token.split('.');
      if (parts.length !== 3) {
        throw Error('JWT must have 3 parts');
      }
    } catch (e) {
      return undefined;
    }

    try {
      const decoded = Base64.decode(parts[1]);
      const payload = JSON.parse(decoded);
      return payload as T;
    } catch (e) {
      return undefined;
    }
  }
}
