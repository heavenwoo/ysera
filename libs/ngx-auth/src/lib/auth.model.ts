export interface AuthState {
  userId: string;
  // isLoggedIn: boolean;
  // isSigningUp: boolean;
  // isAuthenticating: boolean;
  // logoutRequired: boolean;
  // hasError: boolean;
  token: string;
  message: string;
}

export type AuthSession = {
  userId: string;
  token: string;
};
