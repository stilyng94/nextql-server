import { ObjectType, Field } from "type-graphql";
import { Entity, Property, PrimaryKey } from "@mikro-orm/core";

@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field()
  @Property({ unique: true, length: 125 })
  username: string;

  @Property({ type: "text" })
  password: string;
}
