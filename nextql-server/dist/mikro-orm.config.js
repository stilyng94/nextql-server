"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Post_1 = require("./models/Post");
const constants_1 = require("./constants");
const path_1 = __importDefault(require("path"));
const User_1 = require("./models/User");
exports.default = {
    dbName: "farm-api-andela",
    password: "jack",
    type: "postgresql",
    debug: !constants_1.__prod__,
    entities: [Post_1.Post, User_1.User],
    migrations: {
        path: path_1.default.join(__dirname, "./migrations"),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
};
//# sourceMappingURL=mikro-orm.config.js.map