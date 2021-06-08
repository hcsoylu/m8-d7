import express from "express";
import UserModel from "./schema.js";
import { basicAuthMiddleware, adminOnly } from "../auth/index.js";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body);
    const { _id } = await newUser.save();

    res.status(201).send(_id);
  } catch (error) {
    next(error);
  }
});

router.get("/", basicAuthMiddleware, adminOnly, async (req, res, next) => {
  try {
    const users = await UserModel.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

router.get("/me", basicAuthMiddleware, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});

router.delete("/me", basicAuthMiddleware, async (req, res, next) => {
  try {
    await req.user.deleteOne();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.put("/me", basicAuthMiddleware, async (req, res, next) => {
  try {
    console.log(req.body);

    // req.user.name = req.body.name

    const updates = Object.keys(req.body);

    updates.forEach((u) => (req.user[u] = req.body[u]));

    await req.user.save();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
