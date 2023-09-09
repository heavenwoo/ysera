import { createAction, props } from "@ngrx/store";
import { AuthTokenDto, AuthUserCredentialsInput, UserDto } from "@ysera/ngx-graphql/schema";

export const login = createAction(
  "[Auth] Login",
  props<AuthUserCredentialsInput>()
);
export const loginSuccess = createAction(
  "[Auth] Login success",
  props<UserDto>()
);

export const logoutSuccess = createAction(
  "[Auth] Logout success",
  props<AuthTokenDto>()
);

export const getCurrentUser = createAction(
  "[Auth] Get current user",
  props<UserDto>()
);

export const setCurrentUser = createAction(
  "[Auth] Set current user",
  props<UserDto>()
);
