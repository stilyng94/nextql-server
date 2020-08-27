import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import mikroConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import redis from "redis";
import expressSession from "express-session";
import connectRedis from "connect-redis";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();
  //

  const app = express();
  const RedisStore = connectRedis(expressSession);
  const redisClient = redis.createClient();

  app.use(
    expressSession({
      secret: "top-secret",
      resave: false,
      name: "qid",
      cookie: {
        maxAge: 1000 * 60 * 24 * 365 * 1,
        httpOnly: true,
        secure: __prod__,
        sameSite: "lax",
      },
      saveUninitialized: false,
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
    })
  );

  const apolloServer = new ApolloServer({
    debug: true,
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ db: orm.em, req, res }),
  });

  apolloServer.applyMiddleware({ app });
  app.listen(8000, () => console.log("server working"));
};

main().catch((err) => console.log(err));
