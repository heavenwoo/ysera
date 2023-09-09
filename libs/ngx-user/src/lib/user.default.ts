import {
  OrderDirection,
  PaginationArgs,
  UserOrder,
  UserOrderField,
} from '@ysera/ngx-graphql/schema';

export const defaultUserOrder: UserOrder = {
  direction: OrderDirection.Desc,
  field: UserOrderField.CreatedAt,
};

export const defaultPageArgs: PaginationArgs = {
  first: 20,
};
