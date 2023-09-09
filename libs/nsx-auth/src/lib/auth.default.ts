import { SecurityConfig } from './auth.model';
import {
  AUTH_JWT_EXPIRY_DEFAULT,
  AUTH_PASSWORD_SALT_ROUND_DEFAULT,
  AUTH_SESSION_EXPIRY_DEFAULT
} from './auth.constant';

export const DefaultSecurityConfig: SecurityConfig = {
  accessTokenExpiry: `${AUTH_JWT_EXPIRY_DEFAULT}m`,
  sessionTokenExpiry: `${AUTH_SESSION_EXPIRY_DEFAULT}d`,
  bcryptSaltOrRound: AUTH_PASSWORD_SALT_ROUND_DEFAULT,
};
