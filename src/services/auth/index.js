import atob from "atob";

import UserModel from "../users/schema.js";

export const basicAuthMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    const error = new Error("please provide auth!!!!!");
    error.httpStatusCode = 401;
    next(error);
  } else {
    const decoded = atob(req.headers.authorization.split(" ")[1]);
    const [email, password] = decoded.split(":");
  }

  const user = await UserModel.checkCredentials(email, password);

  if (user) {
    req.user = user;
    next(user);
  } else {
    const error = new Error("credentials are wrong");
    error.httpStatusCode = 401;
    next(error);
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user.role === "Admin") {
    next();
  } else {
    const error = new Error("Admin only");
    error.httpStatusCode = 403;
    next(error);
  }
};
