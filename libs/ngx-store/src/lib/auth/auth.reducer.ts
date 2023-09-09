import { Action, createReducer, on } from "@ngrx/store";
import { UserDto } from "@ysera/ngx-graphql/schema";
import { setCurrentUser } from "./auth.actions";

export interface AuthState {
  user?: UserDto;
}

export const initialState: AuthState = {};

export const authReducer = createReducer(
  initialState,
  on(setCurrentUser, (state, user) => ({ ...state, ...user }))
);

export function authReducerFn(state: AuthState | undefined, action: Action) {
  return authReducer(state, action);
}
