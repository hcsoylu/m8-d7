import express from "express";
import q2m from "query-to-mongo";

import AuthorModel from "./schema.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const newAuthor = new AuthorModel(req.body);

    const { _id } = await newAuthor.save();
    res.status(201).send(_id);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const query = q2m(req.query);
    const total = await AuthorModel.countDocuments(query.criteria);

    const authors = await AuthorModel.find(query.criteria, query.options.fields)
      .skip(query.options.skip)
      .limit(query.options.limit)
      .sort(query.options.sort);

    res.send({ links: query.links("/author", total), authors });
  } catch (error) {
    console.log(error);
    next(error);
  }

  // try {
  //   const query = q2m(req.query);
  //   const { articles, total } = await ArticleModel.findArticleWithAuthors(
  //     query
  //   );
  //   res.send({ links: query.links("/articles", total), articles });
  // } catch (error) {
  //   console.log(error);
  //   next(error);
  // }
});

router.get("/:id", async (req, res, next) => {
  try {
    const author = await AuthorModel.findById(req.params.id);
    res.send(author);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const modifiedAuthor = await AuthorModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    );
    if (modifiedAuthor) {
      res.send(modifiedAuthor);
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const author = await AuthorModel.findByIdAndDelete(req.params.id);
    if (author) {
      res.send(author);
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default router;
