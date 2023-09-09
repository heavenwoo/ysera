import { gql } from 'apollo-angular';

export const AuthStatusFragment = gql`
  fragment AuthStatus on AuthStatusDto {
    ok
    message
  }
`;

export const AuthTokenStatusFragment = gql`
  fragment AuthTokenStatus on AuthTokenDto {
    ok
    token
    message
  }
`;

export const AuthUserLoginMutation = gql`
  mutation authUserLogin($data: AuthUserCredentialsInput!) {
    authUserLogin(data: $data) {
      ...AuthTokenStatus
    }
  }
  ${AuthTokenStatusFragment}
`;

export const AuthUserLogoutMutation = gql`
  mutation authUserLogout {
    authUserLogout {
      ...AuthStatus
    }
  }
  ${AuthStatusFragment}
`;

export const AuthUserSignupMutation = gql`
  mutation authUserSignup($data: AuthUserSignupInput!) {
    authUserSignup(data: $data) {
      ...AuthTokenStatus
    }
  }
  ${AuthTokenStatusFragment}
`;

export const AuthTokenRefreshMutation = gql`
  mutation authTokenRefresh {
    authTokenRefresh {
      ...AuthTokenStatus
    }
  }
  ${AuthTokenStatusFragment}
`;

// export const AuthPasswordChangeMutation = gql`
//   mutation authPasswordChange($input: AuthPasswordChangeInput!) {
//     authPasswordChange(input: $input) {
//       ...AuthStatus
//     }
//   }
//   ${AuthStatusFragment}
// `;
