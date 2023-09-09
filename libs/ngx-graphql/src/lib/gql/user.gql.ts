import { gql } from 'apollo-angular';

export const UserFragment = gql`
  fragment User on UserDto {
    id
    email
    isActive
    isVerified
    username
    firstName
    lastName
    role
    permissions
    groupId
    avatar
    createdAt
    followedBy {
      id
      username
    }
    following {
      id
      username
    }
  }
`;

export const UserSelfQuery = gql`
  query UserSelf($id: String!) {
    userSelf(id: $id) {
      ...User
    }
  }
  ${UserFragment}
`;

export const UserQuery = gql`
  query User($data: UserWhereByIdInput!) {
    user(data: $data) {
      ...User
    }
  }
  ${UserFragment}
`;

export const UsersQuery = gql`
  query Users($pageArgs: PaginationArgs, $orderBy: UserOrder, $query: String) {
    users(pageArgs: $pageArgs, orderBy: $orderBy, query: $query) {
      edges {
        cursor
        node {
          ...User
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
  }
  ${UserFragment}
`;

export const UserConnectFollowing = gql`
  mutation UserConnectFollowing($data: UserWhereByIdInput!) {
    userConnectFollowing(data: $data) {
      ...User
    }
  }
  ${UserFragment}
`;

export const UserDisconnectFollowing = gql`
  mutation UserDisconnectFollowing($data: UserWhereByIdInput!) {
    userDisconnectFollowing(data: $data) {
      ...User
    }
  }
  ${UserFragment}
`;
