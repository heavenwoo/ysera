import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { Order } from '@ysera/nsx-pagination';

export enum UserOrderField {
  id = 'id',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
  firstName = 'firstName',
  lastName = 'lastName',
  username = 'username',
}

registerEnumType(UserOrderField, {
  name: 'UserOrderField',
  description: 'User connection order llist.',
})

@InputType()
export class UserOrder extends Order {
  @Field(() => UserOrderField)
  field!: UserOrderField;
}
