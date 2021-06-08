import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";

import articlesRouter from "./services/articles/index.js";
import authorsRouter from "./services/authors/index.js";
import usersRouter from "./services/users/index.js";

import {
  unauthorizedErrorHandler,
  notFoundErrorHandler,
  badRequestErrorHandler,
  catchAllErrorHandler,
  forbiddenErrorHandler,
} from "./errorHandler.js";

const server = express();

const port = process.env.PORT || 5001;

server.use(express.json());

server.use(cors());

server.use("/articles", articlesRouter);
server.use("/authors", authorsRouter);
server.use("/users", usersRouter);

//ERROR HANDLERS
server.use(unauthorizedErrorHandler);
server.use(badRequestErrorHandler);
server.use(forbiddenErrorHandler);
server.use(catchAllErrorHandler);
server.use(notFoundErrorHandler);

console.log(listEndpoints(server));

mongoose
  .connect(process.env.URL_MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(server.listen(port, () => console.log("its running :", port)))
  .catch((err) => console.log(err));
