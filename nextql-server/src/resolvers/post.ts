import { Resolver, Query, Ctx, Arg, Int, Mutation } from "type-graphql";
import { MyContext } from "../types";
import { Post } from "../models/Post";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async posts(@Ctx() { db }: MyContext) {
    const posts = await db.find(Post, {});
    return posts;
  }

  @Query(() => Post, { nullable: true })
  async post(
    @Arg("id", () => Int) id: number,
    @Ctx() { db }: MyContext
  ): Promise<Post | null> {
    return await db.findOne(Post, { id });
  }

  @Mutation(() => Post)
  async createPost(
    @Arg("title", () => String) title: string,
    @Ctx() { db }: MyContext
  ): Promise<Post> {
    const post = db.create(Post, { title: title });
    await db.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String) title: string,
    @Ctx() { db }: MyContext
  ): Promise<Post | null> {
    const post = await db.findOne(Post, { id: id });
    if (!post || title === null) {
      return null;
    }
    post.title = title;
    await db.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { db }: MyContext
  ): Promise<boolean> {
    const post = await db.findOne(Post, { id: id });
    if (!post) {
      return false;
    }
    await db.removeAndFlush(post);
    return true;
  }
}
