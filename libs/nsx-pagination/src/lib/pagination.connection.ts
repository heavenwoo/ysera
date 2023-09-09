import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PageInfo } from './pagination.pageinfo';

export const Connection = <TItem>(TItemClass: Type<TItem>) => {
  @ObjectType(`${TItemClass.name}Edge`)
  class EdgeType {
    @Field(() => String)
    cursor!: string;

    @Field(() => TItemClass)
    node!: TItem;
  }

  @ObjectType({ isAbstract: true })
  class ConnectionType {
    @Field(() => [EdgeType], { nullable: true })
    edges?: Array<EdgeType>;

    @Field(() => PageInfo)
    pageInfo!: PageInfo;

    @Field(() => Int)
    totalCount!: number;
  }

  return ConnectionType;
};
