import { Maybe, Permission, Role, Scalars, UserDto } from '@ysera/ngx-graphql/schema';

export interface UserConfig {
  logState?: boolean;

  [id: string]: any;
}

export interface UserState extends Omit<UserDto, '__typename' | 'isActive'> {
  isActive?: boolean;
}

export type PageArgs = {
  first: number;
  last: number;
};

// export const storageSchema: JSONSchema = {
//   type: 'object',
//   properties: {
//     email: { type: 'string' },
//     firstName: { type: 'string' },
//     lastName: { type: 'string' },
//     groupId: { type: 'string' },
//     id: { type: 'string' },
//     language: { type: 'string' },
//     username: { type: 'string' },
//   },
//   required: ['id'],
// };

export type User = Omit<UserDto, '__typename'>;
