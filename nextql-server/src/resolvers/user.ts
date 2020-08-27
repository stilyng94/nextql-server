import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  InputType,
  Field,
  ObjectType,
} from "type-graphql";
import { MyContext } from "../types";
import { User } from "../models/User";
import Argon2 from "argon2";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
export class FieldError {
  @Field()
  message: string;

  @Field()
  field: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: [FieldError];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg("options", { nullable: false }) options: UsernamePasswordInput,
    @Ctx() { db, req }: MyContext
  ): Promise<UserResponse> {
    const hashedPassword = await Argon2.hash(options.password, {
      saltLength: 12,
    });
    const user = db.create(User, {
      username: options.username,
      password: hashedPassword,
    });
    await db.persistAndFlush(user);
    req.session.userId = user.id;

    return { user };
  }

  @Query(() => UserResponse)
  async login(
    @Arg("options", { nullable: false }) options: UsernamePasswordInput,
    @Ctx() { db, req }: MyContext
  ): Promise<UserResponse> {
    const user = await db.findOne(User, { username: options.username });
    if (user === null) {
      return { errors: [{ field: "", message: "incorrect login detail" }] };
    }
    const verified = await Argon2.verify(user.password, options.password);

    req.session.userId = user.id;

    return verified
      ? { user }
      : { errors: [{ field: "", message: "incorrect login detail" }] };
  }

  @Query(() => UserResponse)
  async me(@Ctx() { db, req }: MyContext): Promise<UserResponse> {
    console.log(req.session);
    if (!req.session?.userId) {
      return { errors: [{ field: "", message: "account not found" }] };
    }
    const user = await db.findOne(User, { id: req.session.userId });
    if (user === null) {
      return { errors: [{ field: "", message: "account not found" }] };
    }
    return { user };
  }
}
