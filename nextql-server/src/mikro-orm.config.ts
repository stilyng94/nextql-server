import { Post } from "./models/Post";
import { __prod__ } from "./constants";
import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { User } from "./models/User";

export default {
  dbName: "farm-api-andela",
  password: "jack",
  type: "postgresql",
  debug: !__prod__,
  entities: [Post, User],
  migrations: {
    path: path.join(__dirname, "./migrations"), // path to the folder with migrations
    pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files
  },
} as Parameters<typeof MikroORM.init>[0];
