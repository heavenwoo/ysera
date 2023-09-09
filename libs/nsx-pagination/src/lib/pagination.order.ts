import { Field, InputType, registerEnumType } from '@nestjs/graphql';

export enum OrderDirection {
  asc = 'asc',
  desc = 'desc',
}

registerEnumType(OrderDirection, {
  name: 'OrderDirection',
  description: 'Ascending or descending direction for a given `orderBy` argument.',
});

@InputType({ isAbstract: true })
export abstract class Order {
  @Field(() => OrderDirection)
  direction!: OrderDirection;
}
