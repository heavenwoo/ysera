import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GqlStatusDto {
  @Field({ nullable: true })
  message?: string;

  @Field()
  ok!: boolean;
}
